// src/gestor-cierre-oi/dto/cerrar-orden.dto.ts
import { IsInt, IsNotEmpty, IsArray, ArrayNotEmpty, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class MotivoCierreDto {
  @IsInt()
  motivoTipoId: number;

  @IsString()
  comentario: string;
}

export class CerrarOrdenDto {
  @IsNotEmpty()
  @IsString()
  observacionCierre: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => MotivoCierreDto)
  motivos: MotivoCierreDto[];
}
