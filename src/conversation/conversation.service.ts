import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import OpenAI from 'openai';

import { Conversation, ConversationDocument } from './conversation.schema';
import { CityService } from '../city/city.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ConversationService {
  private readonly openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
  });

  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<ConversationDocument>,
    private readonly cityService: CityService,
  ) {}

  /** Start new conversation for a city */
  async startConversation(dto: CreateConversationDto, userId: string) {
    const city = await this.cityService.findOne(dto.cityId);
    if (!city) throw new NotFoundException('City not found');

    const aiReply = await this.askCityAssistant(city, dto.message);

    const conversation = await this.conversationModel.create({
      cityId: dto.cityId,
      userId,
      title: dto.title,
      messages: [
        { sender: 'user', content: dto.message, createdAt: new Date() },
        { sender: 'assistant', content: aiReply, createdAt: new Date() },
      ],
    });

    return conversation;
  }

  /** Send message in existing conversation */
  async sendMessage(dto: SendMessageDto, userId: string) {
    const convo = await this.conversationModel
      .findOne({ _id: dto.conversationId, userId })
      .populate('cityId');

    if (!convo)
      throw new NotFoundException('Conversation not found or unauthorized');

    const aiReply = await this.askCityAssistant(convo.cityId, dto.message);

    convo.messages.push(
      { sender: 'user', content: dto.message, createdAt: new Date() },
      { sender: 'assistant', content: aiReply, createdAt: new Date() },
    );

    await convo.save();
    return convo;
  }

  /** Get all conversations for a given city for logged-in user */
  async findByCity(cityId: string, userId: string) {
    return this.conversationModel
      .find({ cityId, userId })
      .populate('cityId')
      .sort({ updatedAt: -1 });
  }

  /** Get all conversations for logged-in user */
  async findAllByUser(userId: string) {
    return this.conversationModel
      .find({ userId })
      .populate('cityId')
      .sort({ updatedAt: -1 });
  }

  /** Private helper for AI replies */
  private async askCityAssistant(city: any, message: string): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.6,
      messages: [
        {
          role: 'system',
          content: `
You are a travel and digital nomad assistant.
Answer only about this city using factual, friendly tone.
If question is unrelated to the city, politely redirect user.

use available city data and your knowledge about the city to answer the question.

Available City data:
${JSON.stringify(city, null, 2)}
          `,
        },
        { role: 'user', content: message },
      ],
    });

    return (
      completion.choices[0].message?.content ??
      'Sorry, I had trouble generating a response.'
    );
  }
}
