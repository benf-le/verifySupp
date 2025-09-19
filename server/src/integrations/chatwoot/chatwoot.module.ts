import { Module } from '@nestjs/common';
import { ChatwootController } from './chatwoot.controller';

@Module({
  imports:[],
  controllers:[ChatwootController],
  providers:[]
})
export class ChatwootModule {}
