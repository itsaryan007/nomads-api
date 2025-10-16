import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  /** Start a new conversation */
  @Post()
  async startConversation(@Body() dto: CreateConversationDto, @Request() req) {
    return this.conversationService.startConversation(dto, req.user.userId);
  }

  /** Send a message in an existing conversation */
  @Post('message')
  async sendMessage(@Body() dto: SendMessageDto, @Request() req) {
    return this.conversationService.sendMessage(dto, req.user.userId);
  }

  /** Get all conversations for a city (for current user) */
  @Get('city/:cityId')
  async getByCity(@Param('cityId') cityId: string, @Request() req) {
    return this.conversationService.findByCity(cityId, req.user.userId);
  }

  /** Get all conversations for current user */
  @Get('me')
  async getMyConversations(@Request() req) {
    return this.conversationService.findAllByUser(req.user.userId);
  }
}
