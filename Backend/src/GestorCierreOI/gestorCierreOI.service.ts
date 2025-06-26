import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class GestorCierreOIService {
  private ordenes: {
  id: number;
  estado: { nombreEstado: string; esCompRealizada: () => boolean };
  estacionSismologica: { sismografo: { id: number; cambiosDeEstado: any[] } };
  empleado: { id: number; nombre: string };
  observacionCierre: string | null;
  fechaHoraCierre: Date | null;
}[] = [
  {
    id: 1,
    estado: { nombreEstado: 'completamente_realizada', esCompRealizada: () => true },
    estacionSismologica: { sismografo: { id: 1, cambiosDeEstado: [] } },
    empleado: { id: 1, nombre: 'Juan' },
    observacionCierre: null,
    fechaHoraCierre: null,
  },
];

  private empleados = [
    { id: 1, nombre: 'Juan' },
    { id: 2, nombre: 'Ana' },
  ];

private estados = {
  cerrada: {
    nombreEstado: 'cerrada',
    esCompRealizada: () => false,
  },
  fuera_de_servicio: {
    nombreEstado: 'fuera_de_servicio',
    esCompRealizada: () => false,
  },
};

  private motivoTipos = [
    { id: 1, descripcion: 'Motivo A' },
    { id: 2, descripcion: 'Motivo B' },
  ];

  async cerrarOrden(idOrden: number, idEmpleado: number, dto: any) {
    const orden = this.ordenes.find(o => o.id === idOrden);
    if (!orden) throw new NotFoundException('Orden no encontrada');

    if (!orden.estado.esCompRealizada()) {
      throw new BadRequestException('No se puede cerrar una orden que no está completamente realizada');
    }

    const empleado = this.empleados.find(e => e.id === idEmpleado);
    if (!empleado) throw new NotFoundException('Empleado no encontrado');

    if (!dto.observacionCierre || !dto.motivos || dto.motivos.length === 0) {
      throw new BadRequestException('Debe incluir observación de cierre y al menos un motivo');
    }

    // Simular actualización de orden
    orden.observacionCierre = dto.observacionCierre;
    orden.estado = this.estados.cerrada;
    orden.fechaHoraCierre = new Date();

    // Simular cambio estado sismografo
    const sismografo = orden.estacionSismologica.sismografo;
    // Cerrar último cambio de estado (simulado)
    const ultimoCambio = sismografo.cambiosDeEstado.find(c => !c.fechaHoraFin);
    if (ultimoCambio) {
      ultimoCambio.fechaHoraFin = new Date();
    }

    // Crear nuevo cambioEstado (simulado)
    const motivosSeleccionados = dto.motivos.map(motivoDto =>
      this.motivoTipos.find(m => m.id === motivoDto.motivoTipoId)
    );

    sismografo.cambiosDeEstado.push({
      fechaHoraInicio: new Date(),
      fechaHoraFin: null,
      estado: this.estados.fuera_de_servicio,
      motivos: motivosSeleccionados,
      empleadoResponsable: empleado,
    });

    return orden;
  }
}