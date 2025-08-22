import { Module } from '@nestjs/common';
import { EstacionSismologicaService } from './estacion-sismologica.service';
import { EstacionSismologicaController } from './estacionSismologica.controller';

@Module({
  providers: [EstacionSismologicaService],
  controllers: [EstacionSismologicaController]
})
export class EstacionSismologicaModule {}
