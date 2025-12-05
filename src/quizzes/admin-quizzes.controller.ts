import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AdminJwtAuthGuard } from 'src/auth/guards/admin-jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { SortDirection, UserRole } from 'src/common/enums';
import { PaginationOptions, SortOptions } from 'src/common/interfaces';

import {
  CreateQuizDocs,
  DeleteQuizDocs,
  GetQuizByIdDocs,
  GetQuizzesDocs,
} from 'src/docs/quizzes/quizzes.docs';
import { CreateQuizDto } from './dto/create-quiz-dto';
import { Quiz } from './entities/quizzes.entity';
import { QuizzesService } from './quizzes.service';

@ApiTags('Admin - Quizzes')
@ApiBearerAuth('access-token')
@UseGuards(AdminJwtAuthGuard, RolesGuard)
@Controller('/admin/quizzes')
export class AdminQuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Roles(UserRole.SuperAdmin)
  @Get()
  @GetQuizzesDocs()
  async getQuizzes(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortDirection') sortDirection?: SortDirection,
  ): Promise<{ quizzes: Quiz[]; total: number }> {
    const pagination: PaginationOptions = {
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };
    const sort: SortOptions = { sortBy, sortDirection };
    return this.quizzesService.getQuizzes(pagination, sort, search);
  }

  @Roles(UserRole.SuperAdmin)
  @Get(':id')
  @GetQuizByIdDocs()
  async getQuizById(@Param('id') id: string): Promise<Quiz | null> {
    return this.quizzesService.getQuizById(id);
  }

  @Roles(UserRole.SuperAdmin)
  @Delete(':id')
  @DeleteQuizDocs()
  async deleteQuiz(@Param('id') id: string): Promise<void> {
    return this.quizzesService.deleteQuiz(id);
  }

  @Roles(UserRole.SuperAdmin)
  @Post()
  @CreateQuizDocs()
  async createQuiz(@Body() dto: CreateQuizDto): Promise<{ quizId: string }> {
    const quizId = await this.quizzesService.createQuiz(dto);
    return { quizId };
  }
}
