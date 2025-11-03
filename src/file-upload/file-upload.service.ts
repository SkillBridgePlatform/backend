import { BadRequestException, Injectable } from '@nestjs/common';
import * as path from 'path';
import { SupabaseService } from 'src/supabase/supabase.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileUploadService {
  constructor(private readonly supabase: SupabaseService) {}

  async uploadFile(
    file: Buffer,
    originalName: string,
    folder: string,
  ): Promise<string> {
    if (!file || !originalName) {
      throw new BadRequestException('File and filename are required');
    }

    const ext = path.extname(originalName);
    const fileName = `${uuidv4()}${ext}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await this.supabase.client.storage
      .from('user-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error(error);
      throw new BadRequestException('Failed to upload file');
    }

    const { data } = this.supabase.client.storage
      .from('user-images')
      .getPublicUrl(filePath);
    return data.publicUrl;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    if (!fileUrl) {
      throw new BadRequestException('File URL is required');
    }

    try {
      const url = new URL(fileUrl);
      const pathParts = url.pathname.split('/');
      const filePathIndex = pathParts.findIndex(
        (part) => part === 'user-images',
      );
      if (filePathIndex === -1) {
        throw new BadRequestException('Invalid file URL');
      }
      const filePath = pathParts.slice(filePathIndex + 1).join('/');

      const { error } = await this.supabase.client.storage
        .from('user-images')
        .remove([filePath]);

      if (error) {
        console.error(error);
        throw new BadRequestException('Failed to delete file');
      }
    } catch (err) {
      console.error(err);
      throw new BadRequestException('Failed to delete file');
    }
  }
}
