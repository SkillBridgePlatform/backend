import { Controller, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/common/enums';
import { FileUploadService } from './file-upload.service';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin, UserRole.Teacher)
  @Delete()
  @ApiOperation({ summary: 'Delete a file' })
  @ApiResponse({ status: 200, description: 'File successfully deleted' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async deleteStudent(@Query('fileUrl') fileUrl: string): Promise<void> {
    return await this.fileUploadService.deleteFile(fileUrl);
  }
}
