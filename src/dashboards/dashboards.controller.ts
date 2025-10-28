import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/common/enums';
import { DashboardsService } from './dashboards.service';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboards')
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Roles(UserRole.SuperAdmin)
  @Get('superadmin')
  @ApiOperation({ summary: 'Get super admin dashboard data' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved' })
  async getSuperAdminDashboard() {
    return this.dashboardsService.getSuperAdminDashboard();
  }

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin)
  @Get('school/:schoolId')
  @ApiOperation({ summary: 'Get school dashboard data' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved' })
  async getSchoolDashboard(
    @Req() req: Request,
    @Param('schoolId') schoolId: string,
  ) {
    const authUser = req.user;
    return this.dashboardsService.getSchoolDashboard(authUser, schoolId);
  }
}
