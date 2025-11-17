import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const GetModulesDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Retrieve all modules for a course' }),
    ApiResponse({ status: 200, description: 'List of modules' }),
  );

export const GetModuleByIdDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Retrieve a module by ID' }),
    ApiResponse({ status: 200, description: 'Module found' }),
    ApiResponse({ status: 404, description: 'Module not found' }),
  );

export const CreateModuleDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create a new module for a course' }),
    ApiResponse({ status: 201, description: 'Module successfully created' }),
  );

export const UpdateModuleDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update an existing module' }),
    ApiResponse({ status: 200, description: 'Module successfully updated' }),
    ApiResponse({ status: 404, description: 'Module not found' }),
  );

export const DeleteModuleDocs = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete a module' }),
    ApiResponse({ status: 200, description: 'Module successfully deleted' }),
    ApiResponse({ status: 404, description: 'Module not found' }),
  );
