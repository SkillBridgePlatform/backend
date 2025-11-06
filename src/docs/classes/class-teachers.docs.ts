import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

export const GetClassesForTeacherDocs = () =>
  applyDecorators(
    ApiOperation({
      summary:
        'Retrieve classes assigned to a specific teacher with optional pagination and search',
    }),
    ApiResponse({
      status: 200,
      description: 'List of classes with total count',
    }),
    ApiQuery({
      name: 'teacher_id',
      required: true,
      description: 'Teacher UUID',
    }),
    ApiQuery({ name: 'limit', required: false }),
    ApiQuery({ name: 'offset', required: false }),
    ApiQuery({ name: 'search', required: false }),
    ApiQuery({ name: 'sortBy', required: false }),
    ApiQuery({ name: 'sortDirection', required: false }),
  );

export const GetTeachersForClassDocs = () =>
  applyDecorators(
    ApiOperation({
      summary:
        'Retrieve all teachers assigned to a specific class with optional pagination, search, and sorting',
    }),
    ApiResponse({
      status: 200,
      description: 'List of teachers with total count',
    }),
    ApiQuery({ name: 'limit', required: false }),
    ApiQuery({ name: 'offset', required: false }),
    ApiQuery({ name: 'search', required: false }),
    ApiQuery({ name: 'sortBy', required: false }),
    ApiQuery({ name: 'sortDirection', required: false }),
  );

export const GetAvailableTeachersForClassDocs = () =>
  applyDecorators(
    ApiOperation({
      summary:
        'Retrieve all available teachers who are not yet assigned to a specific class',
    }),
    ApiResponse({
      status: 200,
      description: 'List of available teachers with total count',
    }),
  );

export const AssignTeachersToClassDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Assign teachers to a class' }),
    ApiResponse({ status: 200, description: 'Teachers successfully assigned' }),
  );

export const UnassignTeachersFromClassDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Unassign teachers from a class' }),
    ApiResponse({
      status: 200,
      description: 'Teachers successfully unassigned',
    }),
  );
