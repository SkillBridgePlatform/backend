import { ApiProperty } from '@nestjs/swagger';

export class StudentLoginResponseDto {
  @ApiProperty({ example: 'jwt.token.here', description: 'JWT access token' })
  access_token: string;
}
