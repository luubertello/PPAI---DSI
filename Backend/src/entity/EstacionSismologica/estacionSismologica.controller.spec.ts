import { Test, TestingModule } from '@nestjs/testing';
import { EstacionSismologicaController } from './estacionSismologica.controller';

describe('EstacionSismologicaController', () => {
  let controller: EstacionSismologicaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstacionSismologicaController],
    }).compile();

    controller = module.get<EstacionSismologicaController>(EstacionSismologicaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
