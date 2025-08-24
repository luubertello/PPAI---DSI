// src/gestor-cierre-oi/dto/cerrar-orden.dto.ts
import { IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MotivoCierreDto {
  @IsNotEmpty()
  motivoTipoId: number;

  @IsString()
  comentario: string;
}

export class CerrarOrdenDto {
  @IsNotEmpty()
  @IsString()
  observacionCierre: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MotivoCierreDto)
  motivos: MotivoCierreDto[];
}

