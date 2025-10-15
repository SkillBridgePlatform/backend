import { Controller, Get } from '@nestjs/common';
import { version } from '../package.json';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      version,
      name: 'SkillBridge API',
      status: 'running',
      message: 'Welcome to the SkillBridge API!',
      health: '/health',
      docs: '/docs',
    };
  }
}
