import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

export const GetClassesForCourseDocs = () =>
  applyDecorators(
    ApiOperation({
      summary:
        'Retrieve classes assigned to a specific course with optional pagination and search',
    }),
    ApiResponse({
      status: 200,
      description: 'List of classes with total count',
    }),
    ApiQuery({
      name: 'course_id',
      required: true,
      description: 'Course UUID',
    }),
    ApiQuery({ name: 'limit', required: false }),
    ApiQuery({ name: 'offset', required: false }),
    ApiQuery({ name: 'search', required: false }),
    ApiQuery({ name: 'sortBy', required: false }),
    ApiQuery({ name: 'sortDirection', required: false }),
  );

export const GetCoursesForClassDocs = () =>
  applyDecorators(
    ApiOperation({
      summary:
        'Retrieve all courses assigned to a specific class with optional pagination, search, and sorting',
    }),
    ApiResponse({
      status: 200,
      description: 'List of courses with total count',
    }),
    ApiQuery({ name: 'limit', required: false }),
    ApiQuery({ name: 'offset', required: false }),
    ApiQuery({ name: 'search', required: false }),
    ApiQuery({ name: 'sortBy', required: false }),
    ApiQuery({ name: 'sortDirection', required: false }),
  );

export const GetAvailableCoursesForClassDocs = () =>
  applyDecorators(
    ApiOperation({
      summary:
        'Retrieve all available courses who are not yet assigned to a specific class',
    }),
    ApiResponse({
      status: 200,
      description: 'List of available courses with total count',
    }),
  );

export const AssignCoursesToClassDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Assign courses to a class' }),
    ApiResponse({ status: 200, description: 'Courses successfully assigned' }),
  );

export const UnassignCoursesFromClassDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Unassign courses from a class' }),
    ApiResponse({
      status: 200,
      description: 'Courses successfully unassigned',
    }),
  );
