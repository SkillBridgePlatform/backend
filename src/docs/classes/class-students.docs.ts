import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

export const GetStudentsForClassDocs = () =>
  applyDecorators(
    ApiOperation({
      summary:
        'Retrieve all students assigned to a specific class with optional pagination, search, and sorting',
    }),
    ApiResponse({
      status: 200,
      description: 'List of students with total count',
    }),
    ApiQuery({ name: 'limit', required: false }),
    ApiQuery({ name: 'offset', required: false }),
    ApiQuery({ name: 'search', required: false }),
    ApiQuery({ name: 'sortBy', required: false }),
    ApiQuery({ name: 'sortDirection', required: false }),
  );

export const GetAvailableStudentsForClassDocs = () =>
  applyDecorators(
    ApiOperation({
      summary:
        'Retrieve all available students who are not yet assigned to a specific class',
    }),
    ApiResponse({
      status: 200,
      description: 'List of available students with total count',
    }),
  );

export const AssignStudentsToClassDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Assign students to a class' }),
    ApiResponse({ status: 200, description: 'Students successfully assigned' }),
  );

export const UnassignStudentsFromClassDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Unassign students from a class' }),
    ApiResponse({
      status: 200,
      description: 'Students successfully unassigned',
    }),
  );
