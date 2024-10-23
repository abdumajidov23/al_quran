import { IsString, IsOptional } from 'class-validator';

export class UpdateHadislarDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  about?: string;
}
