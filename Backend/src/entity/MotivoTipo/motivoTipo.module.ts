import { Module } from '@nestjs/common';
import { MotivoTipoService } from './motivoTipo.service';
import { MotivoTipoController } from './motivoTipo.controller';

@Module({
  providers: [MotivoTipoService],
  controllers: [MotivoTipoController]
})
export class MotivoTipoModule {}
