import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AdminJwtAuthGuard } from 'src/auth/guards/admin-jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/common/enums';
import { DashboardsService } from './dashboards.service';

@ApiTags('Admin - Dashboards')
@ApiBearerAuth('access-token')
@UseGuards(AdminJwtAuthGuard, RolesGuard)
@Controller('/admin/dashboards')
export class AdminDashboardsController {
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
