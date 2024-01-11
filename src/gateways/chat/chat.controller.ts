import { Controller } from '@nestjs/common';
import { ChatGatewayService } from './chat.service';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatGatewayService) {}
}
