import { Test, TestingModule } from '@nestjs/testing';
import { GiftsController } from './gifts.controller';
import { GiftsService } from './gifts.service';

describe('GiftsController', () => {
  let controller: GiftsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GiftsController],
      providers: [GiftsService],
    }).compile();

    controller = module.get<GiftsController>(GiftsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
