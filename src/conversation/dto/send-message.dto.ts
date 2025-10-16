import { IsMongoId, IsString } from 'class-validator';

export class SendMessageDto {
  @IsMongoId()
  conversationId: string;

  @IsString()
  message: string;
}
