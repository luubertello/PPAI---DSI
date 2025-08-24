// src/gestor-cierre-oi/gestor-cierre-oi.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GestorCierreOIService } from './gestorCierreOI.service';
import { GestorCierreOIController } from './gestorCierreOI.controller';

import { OrdenInspeccion } from '../entity/OrdenInspeccion/OrdenInspeccion.entity';
import { Estado } from '../entity/Estado/estado.entity';
import { Sismografo } from '../entity/Sismografo/sismografo.entity';
import { EstacionSismologica } from 'src/entity/EstacionSismologica/estacionSismologica.entity';
import { CambioEstado } from '../entity/CambioEstado/cambioEstado.entity';
import { MotivoTipo } from '../entity/MotivoTipo/motivoTipo.entity';
import { MotivoFueraServicio } from 'src/entity/MotivoFueraServicio/motivoFueraServicio.entity';
import { Empleado } from '../entity/Empleado/empleado.entity';
import { Sesion } from 'src/entity/Sesion/sesion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrdenInspeccion,
      Estado,
      EstacionSismologica,
      Sismografo,
      CambioEstado,
      MotivoTipo,
      MotivoFueraServicio,
      Empleado,
      Sesion,
    ]),
  ],
  controllers: [GestorCierreOIController],
  providers: [GestorCierreOIService],
  exports: [GestorCierreOIService],
})
export class GestorCierreOIModule {}
