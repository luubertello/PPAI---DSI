// gestor-cierre-oi.controller.ts
import { Controller, Post, Body, Param } from '@nestjs/common';
import { GestorCierreOIService } from './gestorCierreOI.service';

@Controller('ordenes')
export class GestorCierreOIController {
  constructor(private readonly gestorService: GestorCierreOIService) {}

  @Post(':idOrden/cerrar/:idEmpleado')
  cerrarOrden(
    @Param('idOrden') idOrden: number,
    @Param('idEmpleado') idEmpleado: number,
    @Body() dto: any,
  ) {
    return this.gestorService.cerrarOrden(+idOrden, +idEmpleado, dto);
  }
}
