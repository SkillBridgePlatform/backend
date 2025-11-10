import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AdminJwtAuthGuard } from 'src/auth/guards/admin-jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Class } from 'src/classes/entities/classes.entity';
import { SortDirection, UserRole } from 'src/common/enums';
import { PaginationOptions, SortOptions } from 'src/common/interfaces';
import {
  AssignStudentsToClassDocs,
  GetAvailableStudentsForClassDocs,
  GetStudentsForClassDocs,
  UnassignStudentsFromClassDocs,
} from 'src/docs/classes/class-students.docs';
import {
  AssignTeachersToClassDocs,
  GetAvailableTeachersForClassDocs,
  GetClassesForTeacherDocs,
  GetTeachersForClassDocs,
  UnassignTeachersFromClassDocs,
} from 'src/docs/classes/class-teachers.docs';
import {
  CreateClassDocs,
  DeleteClassDocs,
  GetClassByIdDocs,
  GetClassesDocs,
  UpdateClassDocs,
} from 'src/docs/classes/classes.docs';
import { Student } from 'src/students/entities/students.entity';
import { User } from 'src/users/entities/user.entity';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class-dto';
import { UpdateClassDto } from './dto/update-class-dto';

@ApiTags('Admin - Classes')
@ApiBearerAuth('access-token')
@UseGuards(AdminJwtAuthGuard, RolesGuard)
@Controller('/admin/classes')
export class AdminClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin, UserRole.Teacher)
  @Get('teacher')
  @GetClassesForTeacherDocs()
  async getClassesForTeacher(
    @Query('teacher_id') teacher_id: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortDirection') sortDirection?: SortDirection,
  ): Promise<{ classes: Class[]; total: number }> {
    const pagination: PaginationOptions = {
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };
    const sort: SortOptions = { sortBy, sortDirection };
    return this.classesService.getClassesForTeacher(
      teacher_id,
      pagination,
      sort,
      search,
    );
  }

  //#region Class CRUD

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin)
  @Get()
  @GetClassesDocs()
  async getClasses(
    @Req() req: Request,
    @Query('school_id') school_id?: string,
    @Query('teacher_id') teacher_id?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortDirection') sortDirection?: SortDirection,
  ): Promise<{ classes: Class[]; total: number }> {
    const filters = { school_id, teacher_id };
    const pagination: PaginationOptions = {
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };
    const sort: SortOptions = { sortBy, sortDirection };

    const authUser = req.user;
    return this.classesService.getClasses(
      authUser,
      filters,
      pagination,
      sort,
      search,
    );
  }

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin, UserRole.Teacher)
  @Get(':classId')
  @GetClassByIdDocs()
  async getClass(@Param('classId') classId: string): Promise<Class | null> {
    return this.classesService.getClass(classId);
  }

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin)
  @Post()
  @CreateClassDocs()
  async createClass(@Body() dto: CreateClassDto): Promise<Class> {
    return this.classesService.createClass(dto);
  }

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin)
  @Patch(':classId')
  @UpdateClassDocs()
  async updateClass(
    @Param('classId') classId: string,
    @Body() dto: UpdateClassDto,
  ): Promise<Class> {
    return this.classesService.updateClass(classId, dto);
  }

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin)
  @Delete(':classId')
  @DeleteClassDocs()
  async deleteClass(@Param('classId') classId: string): Promise<void> {
    return this.classesService.deleteClass(classId);
  }

  //#endregion

  //#region Class Teachers

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin)
  @Get(':classId/teachers')
  @GetTeachersForClassDocs()
  async getTeachersForClass(
    @Param('classId') classId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortDirection') sortDirection?: SortDirection,
  ): Promise<{ teachers: any[]; total: number }> {
    const pagination: PaginationOptions = {
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };
    const sort: SortOptions = { sortBy, sortDirection };

    return this.classesService.getTeachersForClass(
      classId,
      pagination,
      sort,
      search,
    );
  }

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin)
  @Get(':classId/available-teachers')
  @GetAvailableTeachersForClassDocs()
  async getAvailableTeachersForClass(
    @Param('classId') classId: string,
  ): Promise<Partial<User>[]> {
    return this.classesService.getAvailableTeachersForClass(classId);
  }

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin)
  @Post(':classId/teachers')
  @AssignTeachersToClassDocs()
  async assignTeachersToClass(
    @Param('classId') classId: string,
    @Body('teacherIds') teacherIds: string[],
  ): Promise<void> {
    return this.classesService.assignTeachersToClass(classId, teacherIds);
  }

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin)
  @Delete(':classId/teachers')
  @UnassignTeachersFromClassDocs()
  async unassignTeachersFromClass(
    @Param('classId') classId: string,
    @Body('teacherIds') teacherIds: string[],
  ): Promise<void> {
    return this.classesService.unassignTeachersFromClass(classId, teacherIds);
  }

  //#endregion

  //#region Class Students

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin, UserRole.Teacher)
  @Get(':classId/students')
  @GetStudentsForClassDocs()
  async getStudentsForClass(
    @Param('classId') classId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortDirection') sortDirection?: SortDirection,
  ): Promise<{ students: any[]; total: number }> {
    const pagination: PaginationOptions = {
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };
    const sort: SortOptions = { sortBy, sortDirection };

    return this.classesService.getStudentsForClass(
      classId,
      pagination,
      sort,
      search,
    );
  }

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin)
  @Post(':classId/students')
  @AssignStudentsToClassDocs()
  async assignStudentsToClass(
    @Param('classId') classId: string,
    @Body('studentIds') studentIds: string[],
  ): Promise<void> {
    return this.classesService.assignStudentsToClass(classId, studentIds);
  }

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin)
  @Delete(':classId/students')
  @UnassignStudentsFromClassDocs()
  async unassignStudentsFromClass(
    @Param('classId') classId: string,
    @Body('studentIds') studentIds: string[],
  ): Promise<void> {
    return this.classesService.unassignStudentsFromClass(classId, studentIds);
  }

  @Roles(UserRole.SuperAdmin, UserRole.SchoolAdmin)
  @Get(':classId/available-students')
  @GetAvailableStudentsForClassDocs()
  async getAvailableStudentsForClass(
    @Param('classId') classId: string,
  ): Promise<Student[]> {
    return this.classesService.getAvailableStudentsForClass(classId);
  }

  //#endregion
}
