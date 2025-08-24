// src/gestor-cierre-oi/dto/cerrar-orden.dto.ts
export class ListarOrdenesCompletasQuery {
  sesionId!: string; // id de Sesion
}

export class MotivoCierreDto {
  motivoTipoId!: string;
  comentario!: string;
}

export class CerrarOIDto {
  ordenId!: string;
  sesionId!: string; // para obtener al Empleado (RI)
  observacionCierre!: string;
  accionSismografo!: 'FUERA_SERVICIO' | 'EN_LINEA';
  motivosFS?: MotivoCierreDto[];
}
