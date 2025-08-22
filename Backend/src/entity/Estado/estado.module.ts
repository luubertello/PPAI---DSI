import { Module } from '@nestjs/common';
import { EstadoService } from './estado.service';

@Module({
  providers: [EstadoService]
})
export class EstadoModule {}
