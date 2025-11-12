import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const GetLessonsDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Retrieve all lessons for a course' }),
    ApiResponse({ status: 200, description: 'List of lessons' }),
  );

export const GetLessonByIdDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Retrieve a lesson by ID' }),
    ApiResponse({ status: 200, description: 'Lesson found' }),
    ApiResponse({ status: 404, description: 'Lesson not found' }),
  );

export const CreateLessonDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create a new lesson for a course' }),
    ApiResponse({ status: 201, description: 'Lesson successfully created' }),
  );

export const UpdateLessonDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update an existing lesson' }),
    ApiResponse({ status: 200, description: 'Lesson successfully updated' }),
    ApiResponse({ status: 404, description: 'Lesson not found' }),
  );

export const DeleteLessonDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete a lesson' }),
    ApiResponse({ status: 200, description: 'Lesson successfully deleted' }),
    ApiResponse({ status: 404, description: 'Lesson not found' }),
  );
