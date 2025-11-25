import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const StudentLoginDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Student login with username and pin' }),
    ApiBody({
      description: 'Student credentials',
      schema: {
        type: 'object',
        properties: {
          username: { type: 'string', example: 'student1' },
          pin: { type: 'string', example: '1234' },
        },
        required: ['username', 'pin'],
      },
    }),
    ApiResponse({
      status: 201,
      description: 'JWT access token returned on successful login',
      schema: {
        type: 'object',
        properties: {
          access_token: { type: 'string', example: 'jwt.token.here' },
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Invalid username or pin' }),
  );

export const GetStudentProfileDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get current student profile' }),
    ApiResponse({
      status: 200,
      description: 'Returns the authenticated student profile.',
    }),
  );

export const GetStudentCoursesDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Retrieve student courses',
    }),
    ApiResponse({
      status: 200,
      description: 'List of courses',
    }),
  );

export const StartStudentCourseDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Start a course for a student',
      description: 'Creates a course progress record for the student',
    }),
    ApiResponse({
      status: 200,
      description: 'Course started successfully',
    }),
  );
