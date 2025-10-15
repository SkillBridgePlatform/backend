import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      name: 'SkillBridge API',
      status: 'running',
      message: 'Welcome to the SkillBridge API!',
      health: '/health',
    };
  }
}
