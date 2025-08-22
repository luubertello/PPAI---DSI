import { Module } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { EmpleadoController } from './empleado.controller';

@Module({
  providers: [EmpleadoService],
  controllers: [EmpleadoController]
})
export class EmpleadoModule {}
