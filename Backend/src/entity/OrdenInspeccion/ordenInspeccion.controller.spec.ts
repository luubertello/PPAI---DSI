import { Test, TestingModule } from '@nestjs/testing';
import { OrdenInspeccionController } from './orden-inspeccion.controller';

describe('OrdenInspeccionController', () => {
  let controller: OrdenInspeccionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdenInspeccionController],
    }).compile();

    controller = module.get<OrdenInspeccionController>(OrdenInspeccionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
