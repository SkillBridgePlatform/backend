import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

export const GetCoursesDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Retrieve courses with pagination, and sorting',
    }),
    ApiResponse({
      status: 200,
      description: 'List of courses with total count',
    }),
    ApiQuery({ name: 'limit', required: false }),
    ApiQuery({ name: 'offset', required: false }),
    ApiQuery({ name: 'search', required: false }),
    ApiQuery({ name: 'sortBy', required: false }),
    ApiQuery({ name: 'sortDirection', required: false, enum: ['asc', 'desc'] }),
  );

export const GetCourseByIdDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Retrieve a course by ID' }),
    ApiResponse({ status: 200, description: 'Course found' }),
    ApiResponse({ status: 404, description: 'Course not found' }),
  );

export const CreateCourseDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create a new course' }),
    ApiResponse({ status: 201, description: 'Course successfully created' }),
  );

export const UpdateCourseDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update an existing course' }),
    ApiResponse({ status: 200, description: 'Course successfully updated' }),
    ApiResponse({ status: 404, description: 'Course not found' }),
  );

export const DeleteCourseDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete a course' }),
    ApiResponse({ status: 200, description: 'Course successfully deleted' }),
    ApiResponse({ status: 404, description: 'Course not found' }),
  );

export const GetSchoolsAssignedToCourseDocs = () =>
  applyDecorators(
    ApiOperation({
      summary:
        'Retrieve schools linked to a course with optional pagination and search',
    }),
    ApiResponse({
      status: 200,
      description: 'List of schools with total count',
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

export const GetAvailableSchoolsForCourseAssignmentDocs = () =>
  applyDecorators(
    ApiOperation({
      summary:
        'Retrieve all available schools who are not yet assigned to this course',
    }),
    ApiResponse({
      status: 200,
      description: 'List of available schools with total count',
    }),
  );

export const AssignSchoolsToCourseDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Assign schools to course' }),
    ApiResponse({ status: 200, description: 'Schools assigned successfully' }),
  );

export const UnassignSchoolsFromCourseDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Unassign schools from course' }),
    ApiResponse({
      status: 200,
      description: 'Schools successfully unassigned',
    }),
  );
