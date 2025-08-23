import { Controller } from '@nestjs/common';
import { Post, Body } from '@nestjs/common';
import { CambioEstadoService } from './cambioEstado.service';

@Controller('cambio-estado')
export class CambioEstadoController {

  @Post()
  async create(@Body() dto: CreateCambioEstado) {
    return this.CambioEstadoService.create(dto);
  }
}
