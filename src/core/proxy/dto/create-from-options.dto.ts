import { IsOptional, IsString } from 'class-validator';

export class CreateProxyFromOptionsDTO {
  @IsString()
  schema: string;

  @IsString()
  ip: string;

  @IsString()
  port: string;

  @IsString()
  @IsOptional()
  login?: string;

  @IsOptional()
  @IsString()
  password?: string;
}
