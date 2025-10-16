import { IsMongoId, IsString } from 'class-validator';

export class CreateConversationDto {
  @IsMongoId()
  cityId: string;

  @IsString()
  title: string;

  @IsString()
  message: string; // first message from the user
}
