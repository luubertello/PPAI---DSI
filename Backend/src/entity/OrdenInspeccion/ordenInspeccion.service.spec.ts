import { Test, TestingModule } from '@nestjs/testing';
import { OrdenInspeccionService } from './ordenInspeccion.service';

describe('OrdenInspeccionService', () => {
  let service: OrdenInspeccionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdenInspeccionService],
    }).compile();

    service = module.get<OrdenInspeccionService>(OrdenInspeccionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
