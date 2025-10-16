import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import OpenAI from 'openai';

import { City, CityDocument } from './city.schema';
import { CreateCityDto } from './dto/create-city.dto';
import { CityResponseDto } from './dto/city-response.dto';
import { CityRecommendationDto } from './dto/city-recommendation.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class CityService {
  private readonly openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
  });

  constructor(
    @InjectModel(City.name) private cityModel: Model<CityDocument>,
    private readonly userService: UserService,
  ) {}

  async create(dto: CreateCityDto): Promise<City> {
    return this.cityModel.create(dto);
  }

  async findAll(): Promise<CityResponseDto[]> {
    const cities = await this.cityModel.find().populate('countryId').lean();
    return plainToInstance(CityResponseDto, cities, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string): Promise<CityResponseDto> {
    const city = await this.cityModel.findById(id).populate('countryId').lean();
    if (!city) throw new NotFoundException('City not found');
    return plainToInstance(CityResponseDto, city, {
      excludeExtraneousValues: true,
    });
  }

  async deleteAll(): Promise<{ deletedCount: number }> {
    const result = await this.cityModel.deleteMany({});
    return { deletedCount: result.deletedCount ?? 0 };
  }

  /** Recommend a city and mark user as ready */
  async recommendCity(dto: CityRecommendationDto) {
    const cities = await this.cityModel.find().populate('countryId').lean();

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.6,
      max_tokens: 900,
      messages: [
        {
          role: 'system',
          content: `
You are a travel recommendation assistant that ONLY outputs JSON.
Do NOT include code fences, explanations, or text outside JSON.

You have access to detailed city data including climate, cost, safety, and connectivity.

Choose ONE city that best matches the user's preferences.
Write a short, factual explanation ("reason") about why it's recommended.

Then write a **visa note in Markdown** that includes:
- Visa type or requirement for the user's citizenship
- Duration and renewal options
- Ease or difficulty of obtaining it
- Digital nomad visa availability (if applicable)
- Any relevant start dates, restrictions, or tips

The JSON response MUST follow this format:
{
  "cityId": "<cityId>",
  "reason": "<brief explanation>",
  "visaNote": "<markdown-formatted visa note>"
}
`,
        },
        {
          role: 'user',
          content: `
User preferences:
- Wifi: ${dto.wifiPreference}
- Workspace: ${dto.workspacePreference}
- City preference: ${dto.cityPreference}
- Income range: ${dto.incomeRange}
- Citizenship: ${dto.citizenshipCountry}

Cities:
${JSON.stringify(cities, null, 2)}
`,
        },
      ],
    });

    let aiResponse = completion.choices[0]?.message?.content?.trim() ?? '{}';
    aiResponse = aiResponse.replace(/```json|```/g, '').trim();

    let recommendation: { cityId: string; reason: string; visaNote: string };
    try {
      recommendation = JSON.parse(aiResponse);
    } catch (err) {
      console.error('AI raw output:', aiResponse);
      throw new Error('AI response parsing failed');
    }

    const city = await this.cityModel
      .findById(recommendation.cityId)
      .populate('countryId')
      .lean();
    if (!city) throw new NotFoundException('Recommended city not found');

    if (dto.userId) {
      await this.userService.update(dto.userId, { isReady: true });
    }

    return {
      city,
      notes: recommendation.reason,
      visaNote: recommendation.visaNote,
    };
  }
}
