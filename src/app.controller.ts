import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { version } from '../package.json';

@ApiTags('app')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Root endpoint' })
  @ApiResponse({
    status: 200,
    description: 'API status and information',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        timestamp: '2025-10-15T14:00:00.000Z',
        data: {
          name: 'SkillBridge API',
          version: '1.0.0',
          status: 'running',
          message: 'Welcome to the SkillBridge API!',
          health: '/health',
          docs: '/docs',
        },
      },
    },
  })
  getRoot() {
    return {
      success: true,
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      data: {
        name: 'SkillBridge API',
        version,
        status: 'running',
        message: 'Welcome to the SkillBridge API!',
        health: '/health',
        docs: '/docs',
      },
    };
  }
}
