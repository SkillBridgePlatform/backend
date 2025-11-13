import { Injectable } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';

@Injectable()
export class WistiaFileUploadService {
  private apiUrl = process.env.WISTIA_API_URL!;
  private apiPassword = process.env.WISTIA_API_PASSWORD!;

  async uploadVideo(
    file: Buffer,
    fileName: string,
  ): Promise<{ hashedId: string; videoUrl: string }> {
    const form = new FormData();

    form.append('file', file, { filename: fileName });
    form.append('name', fileName);
    form.append('api_password', this.apiPassword);

    const response = await axios.post(this.apiUrl, form, {
      headers: form.getHeaders(),
    });

    const hashedId = response.data.hashed_id;
    const videoUrl = `https://fast.wistia.net/embed/iframe/${hashedId}`;

    return { hashedId, videoUrl };
  }
}
