// gestor-cierre-oi.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { GestorCierreOIService } from './gestorCierreOI.service';
import { CerrarOIDto } from 'src/DTO/cerrarOrden.DTO';

@Controller('gestor-cierre-oi')
export class GestorCierreOIController {
  constructor(private readonly gestorService: GestorCierreOIService) {}

  //paso 2, y si el RI no tiene OI realizadas, error
  @Get('ri/:sesionId/ordenes-completas')
  async listarOrdenesCompletasDeRI(
    @Param('sesionId', ParseIntPipe) sesionId: number,
  ) {
    const ordenes =
      await this.gestorService.listarOrdenesCompletasDeRI(sesionId);

    if (!ordenes.length) {
      return { statusCode: 204, message: 'No hay OI realizadas' };
    }
    //si hay al menos una OI completamente realizada, éxito
    return ordenes;
  }

  // Cerrar una OI (flujo normal, A2, A3)
  @Post('orden/:idOrden/cerrar')
  @HttpCode(200) // éxito: 200 OK
  async cerrarOrden(
    @Param('idOrden', ParseIntPipe) idOrden: number,
    @Body() dto: CerrarOIDto,
  ) {
    try {
      return await this.gestorService.cerrarOrden(idOrden, dto);
    } catch (err) {
      if (err instanceof NotFoundException) {
        // sesión/empleado/OI no encontrada → 404
        return { statusCode: 404, message: err.message };
      }
      // si el service lanza BadRequest por datos faltantes (A3) → 400
      if (err.getStatus && err.getStatus() === 400) {
        return { statusCode: 400, message: err.message };
      }
      throw err;
    }
  }
}
