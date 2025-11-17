import {
  Controller,
  Delete,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
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
  @Post('upload-video-to-wistia')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file provided');
    }

    const { hashedId, videoUrl } =
      await this.wistiaFileUploadService.uploadVideo(
        file.buffer,
        file.originalname,
      );

    return {
      hashedId,
      videoUrl,
    };
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
