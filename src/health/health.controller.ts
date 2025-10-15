import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health Endpoint' })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Healthy',
    };
  }
}
