import { IsString, Length } from 'class-validator';

export class SignInDto {
  @IsString()
  @Length(3, 20)
  username: string;

  @IsString()
  @Length(6, 50)
  password: string;
}
