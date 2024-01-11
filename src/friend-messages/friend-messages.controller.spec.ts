import { Test, TestingModule } from '@nestjs/testing';
import { FriendMessagesController } from './friend-messages.controller';
import { FriendMessagesService } from './friend-messages.service';

describe('FriendMessagesController', () => {
  let controller: FriendMessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendMessagesController],
      providers: [FriendMessagesService],
    }).compile();

    controller = module.get<FriendMessagesController>(FriendMessagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
