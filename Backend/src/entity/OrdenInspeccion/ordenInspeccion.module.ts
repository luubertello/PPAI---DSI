import { Module } from '@nestjs/common';
import { OrdenInspeccionService } from './ordenInspeccion.service';
import { OrdenInspeccionController } from '../orden-inspeccion.controller';

@Module({
  providers: [OrdenInspeccionService],
  controllers: [OrdenInspeccionController]
})
export class OrdenInspeccionModule {}
