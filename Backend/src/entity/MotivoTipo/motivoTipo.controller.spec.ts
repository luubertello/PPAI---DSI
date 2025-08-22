import { Test, TestingModule } from '@nestjs/testing';
import { MotivoTipoController } from './motivoTipo.controller';

describe('MotivoTipoController', () => {
  let controller: MotivoTipoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MotivoTipoController],
    }).compile();

    controller = module.get<MotivoTipoController>(MotivoTipoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
