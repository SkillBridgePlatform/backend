import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { DashboardsService } from './dashboards.service';
import { StudentDashboard } from './entities/student-dashboard.entity';

@ApiTags('Dashboard')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('/dashboards')
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Get('student')
  @ApiOperation({ summary: 'Get student dashboard data' })
  @ApiResponse({
    status: 200,
    description: 'Student dashboard retrieved',
    type: StudentDashboard,
  })
  async getStudentDashboard(@Req() req: Request): Promise<StudentDashboard> {
    const studentId = req.user!.id;
    return this.dashboardsService.getStudentDashboard(studentId);
  }
}
