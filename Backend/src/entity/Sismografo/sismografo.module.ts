import { Module } from '@nestjs/common';
import { SismografoService } from './sismografo.service';
import { SismografoController } from './sismografo.controller';

@Module({
  providers: [SismografoService],
  controllers: [SismografoController]
})
export class SismografoModule {}
