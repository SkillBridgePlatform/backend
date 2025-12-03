import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AdminJwtAuthGuard } from 'src/auth/guards/admin-jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { SortDirection, UserRole } from 'src/common/enums';
import { SortOptions } from 'src/common/interfaces';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { CreateStudentDto } from '../dto/create-student-dto';
import { ResetPinDto } from '../dto/reset-pin-dto';
import { UpdateStudentDto } from '../dto/update-student-dto';
import { Student } from '../entities/students.entity';
import { AdminStudentsService } from '../services/admin-students.service';

@ApiTags('Admin - Students')
@ApiBearerAuth('access-token')
@UseGuards(AdminJwtAuthGuard, RolesGuard)
@Controller('/admin/students')
export class AdminStudentsController {
  constructor(
    private readonly adminStudentsService: AdminStudentsService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() image: Express.Multer.File) {
    if (!image) {
      throw new BadRequestException('No file provided');
    }

    try {
      const imageUrl = await this.fileUploadService.uploadFile(
        image.buffer,
        image.originalname,
        'students',
      );
      return { imageUrl };
    } catch {
      throw new BadRequestException('Failed to upload student image');
    }
  }

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin, UserRole.Teacher)
  @Get()
  @ApiOperation({
    summary: 'Retrieve students with optional filters and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'List of students with total count',
  })
  @ApiQuery({ name: 'school_id', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortDirection', required: false })
  async getStudents(
    @Query('school_id') school_id?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortDirection') sortDirection?: SortDirection,
  ): Promise<{ students: Student[]; total: number }> {
    const filters = { school_id };
    const pagination = {
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };
    const sort: SortOptions = { sortBy, sortDirection };
    return this.adminStudentsService.getStudents(
      filters,
      pagination,
      sort,
      search,
    );
  }

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin, UserRole.Teacher)
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a student by ID' })
  @ApiResponse({ status: 200, description: 'Student found' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async getStudentById(@Param('id') id: string): Promise<Student> {
    return this.adminStudentsService.getStudentById(id);
  }

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin)
  @Post()
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({ status: 201, description: 'Student successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request / validation error' })
  async createStudent(
    @Req() req: Request,
    @Body() dto: CreateStudentDto,
  ): Promise<Student> {
    return this.adminStudentsService.createStudent(dto);
  }

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin)
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing student' })
  @ApiResponse({ status: 200, description: 'Student successfully updated' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async updateStudent(
    @Param('id') id: string,
    @Body() dto: UpdateStudentDto,
  ): Promise<Student> {
    return this.adminStudentsService.updateStudent(id, dto);
  }

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin, UserRole.Teacher)
  @Patch(':id/reset-pin')
  @ApiOperation({ summary: "Reset a student's PIN" })
  @ApiResponse({ status: 200, description: 'Student PIN successfully reset' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async resetPin(
    @Param('id') id: string,
    @Body() dto: ResetPinDto,
  ): Promise<void> {
    return await this.adminStudentsService.resetPin(id, dto.pin);
  }

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student' })
  @ApiResponse({ status: 200, description: 'Student successfully deleted' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async deleteStudent(@Param('id') id: string): Promise<void> {
    return this.adminStudentsService.deleteStudent(id);
  }
}
