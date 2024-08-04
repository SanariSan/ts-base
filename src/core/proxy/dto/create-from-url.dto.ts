import { IsString } from 'class-validator';

export class CreateProxyFromUrlDTO {
  @IsString()
  url: string;
}
