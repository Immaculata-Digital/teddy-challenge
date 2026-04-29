import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name!: string;

  @IsNumber({}, { message: 'O salário deve ser um número' })
  @Min(0, { message: 'O salário não pode ser negativo' })
  salary!: number;

  @IsNumber({}, { message: 'O valor da empresa deve ser um número' })
  @Min(0, { message: 'O valor da empresa não pode ser negativo' })
  companyValue!: number;
}
