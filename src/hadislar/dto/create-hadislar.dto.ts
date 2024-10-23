import { IsString, IsNotEmpty } from 'class-validator';

export class CreateHadislarDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  about: string;
}
