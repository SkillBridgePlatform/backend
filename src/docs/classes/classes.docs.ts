import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

export const GetClassesDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Retrieve classes with optional pagination and search',
    }),
    ApiResponse({
      status: 200,
      description: 'List of classes with total count',
    }),
    ApiQuery({ name: 'school_id', required: false }),
    ApiQuery({ name: 'teacher_id', required: false }),
    ApiQuery({ name: 'limit', required: false }),
    ApiQuery({ name: 'offset', required: false }),
    ApiQuery({ name: 'search', required: false }),
    ApiQuery({ name: 'sortBy', required: false }),
    ApiQuery({ name: 'sortDirection', required: false }),
  );

export const GetClassByIdDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Retrieve a class by ID' }),
    ApiResponse({ status: 200, description: 'Class found' }),
    ApiResponse({ status: 404, description: 'Class not found' }),
  );

export const CreateClassDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create a new class' }),
    ApiResponse({ status: 201, description: 'Class successfully created' }),
  );

export const UpdateClassDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update an existing class' }),
    ApiResponse({ status: 200, description: 'Class successfully updated' }),
    ApiResponse({ status: 404, description: 'Class not found' }),
  );

export const DeleteClassDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete a class' }),
    ApiResponse({ status: 200, description: 'Class successfully deleted' }),
    ApiResponse({ status: 404, description: 'Class not found' }),
  );
