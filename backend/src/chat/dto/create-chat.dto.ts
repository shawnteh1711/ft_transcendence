import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateChatDto {
	@IsString()
	@IsNotEmpty()
	channel_name: string;

	@IsString()
	@IsNotEmpty()
	channel_type: string;

	@IsString()
	@IsOptional()
	channel_hash? : string;
}