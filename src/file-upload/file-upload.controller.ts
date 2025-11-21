import { Controller, Delete, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AdminJwtAuthGuard } from 'src/auth/guards/admin-jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/common/enums';
import { FileUploadService } from './file-upload.service';
import { WistiaFileUploadService } from './wisitia-file-upload.service';

@ApiBearerAuth('access-token')
@UseGuards(AdminJwtAuthGuard, RolesGuard)
@Controller('file-upload')
export class FileUploadController {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly wistiaFileUploadService: WistiaFileUploadService,
  ) {}

  @Roles(UserRole.SuperAdmin)
  @Get('request-wistia-upload')
  @ApiOperation({ summary: 'Get Wistia upload data for a video' })
  @ApiQuery({
    name: 'courseId',
    type: String,
    required: true,
    description: 'The course ID for which to generate upload data',
  })
  @ApiResponse({
    status: 200,
    description: 'Upload data generated successfully',
    schema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', example: 'yubrqaceql' },
        uploadToken: { type: 'string', example: 'short-lived-token' },
      },
    },
  })
  async requestWistiaUpload(@Query('courseId') courseId: string) {
    return this.wistiaFileUploadService.getUploadData(courseId);
  }

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin, UserRole.Teacher)
  @Delete()
  @ApiOperation({ summary: 'Delete a file' })
  @ApiResponse({ status: 200, description: 'File successfully deleted' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async deleteStudent(@Query('fileUrl') fileUrl: string): Promise<void> {
    return await this.fileUploadService.deleteFile(fileUrl);
  }
}
