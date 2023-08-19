import { IsDefined, IsEmail, IsNotEmpty } from '@nestjs/class-validator';

export class SignInDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  public email!: string;

  @IsDefined()
  @IsNotEmpty()
  public password!: string;
}
