import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sismografo } from './sismografo.entity';
import { CambioEstado } from '../CambioEstado/cambioEstado.entity';
import { Estado } from '../Estado/estado.entity';

@Injectable()
export class SismografoService {
  constructor(
    @InjectRepository(Sismografo)
    private readonly sismografoRepo: Repository<Sismografo>,

    @InjectRepository(CambioEstado)
    private readonly cambioEstadoRepo: Repository<CambioEstado>,

    @InjectRepository(Estado)
    private readonly estadoRepo: Repository<Estado>,
  ) {}

  async buscarUltimoCambioEstado(sismografoId: number): Promise<CambioEstado | null> {
    return await this.cambioEstadoRepo.findOne({
    where: { sismografo: { id: sismografoId }  as any },
    order: { fechaHoraFin: 'DESC' },
    relations: ['sismografo', 'estado'] // si necesitás datos relacionados
  });
  }

  async enviarAReparar(sismografoId: number): Promise<void> {
    // Logica
  }

  async solicitarCertificacion(sismografoId: number): Promise<void> {
    // Logica
  }
}
