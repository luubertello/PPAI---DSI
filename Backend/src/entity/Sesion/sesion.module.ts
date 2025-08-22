import { Module } from '@nestjs/common';
import { SesionService } from './sesion.service';
import { SesionController } from './sesion.controller';

@Module({
  providers: [SesionService],
  controllers: [SesionController]
})
export class SesionModule {}
