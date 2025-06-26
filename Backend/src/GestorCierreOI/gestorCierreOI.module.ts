// src/gestor-cierre-oi/gestor-cierre-oi.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GestorCierreOIService } from './gestorCierreOI.service';
import { GestorCierreOIController } from './gestorCierreOI.controller';

import { OrdenInspeccion } from '../entity/OrdenInspeccion';
import { Estado } from '../entity/Estado';
import { Sismografo } from '../entity/Sismografo';
import { CambioEstado } from '../entity/CambioEstado';
import { MotivoTipo } from '../entity/MotivoTipo';
import { Empleado } from '../entity/Empleado';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrdenInspeccion,
      Estado,
      Sismografo,
      CambioEstado,
      MotivoTipo,
      Empleado,
    ]),
  ],
  controllers: [GestorCierreOIController],
  providers: [GestorCierreOIService],
})
export class GestorCierreOIModule {}
