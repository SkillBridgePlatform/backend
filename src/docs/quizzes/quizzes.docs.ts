// src/quizzes/docs/admin-quizzes.docs.ts
import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateQuizDto } from 'src/quizzes/dto/create-quiz-dto';

export const GetQuizzesDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Retrieve quizzes with optional pagination and search',
    }),
    ApiQuery({ name: 'limit', required: false }),
    ApiQuery({ name: 'offset', required: false }),
    ApiQuery({ name: 'search', required: false }),
    ApiQuery({ name: 'sortBy', required: false }),
    ApiQuery({ name: 'sortDirection', required: false }),
    ApiResponse({
      status: 200,
      description: 'List of quizzes with total count',
    }),
  );

export const GetQuizByIdDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Retrieve a quiz by ID' }),
    ApiResponse({ status: 200, description: 'Quiz found' }),
    ApiResponse({ status: 404, description: 'Quiz not found' }),
  );

export const DeleteQuizDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete a quiz' }),
    ApiResponse({ status: 200, description: 'Quiz successfully deleted' }),
    ApiResponse({ status: 404, description: 'Quiz not found' }),
  );

export const CreateQuizDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create a new quiz' }),
    ApiBody({ type: CreateQuizDto }),
    ApiResponse({
      status: 201,
      description: 'Quiz successfully created, returns quiz ID',
    }),
    ApiResponse({ status: 400, description: 'Invalid input' }),
  );
