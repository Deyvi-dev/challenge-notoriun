import { IsNotEmpty, IsString, IsOptional, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{14}$/, { message: 'CNPJ must have 14 digits' })
  cnpj: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{8}$/, { message: 'CEP must have 8 digits' })
  cep: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  neighborhood: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  number: string;

  @IsOptional()
  @IsString()
  complement?: string;

  @IsOptional()
  @IsString()
  latitude?: string;

  @IsOptional()
  @IsString()
  longitude?: string;
}
