import { Test, TestingModule } from '@nestjs/testing';
import { GroupMessagesController } from './group-messages.controller';
import { GroupMessagesService } from './group-messages.service';

describe('GroupMessagesController', () => {
  let controller: GroupMessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupMessagesController],
      providers: [GroupMessagesService],
    }).compile();

    controller = module.get<GroupMessagesController>(GroupMessagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
