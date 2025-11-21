import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CoursesService } from 'src/courses/services/courses.service';

@Injectable()
export class WistiaFileUploadService {
  constructor(private readonly coursesService: CoursesService) {}

  private readonly apiBaseUrl = process.env.WISTIA_API_BASE_URL!;
  private readonly apiPassword = process.env.WISTIA_API_PASSWORD!;

  async getOrCreateProject(courseId: string): Promise<string> {
    const course = await this.coursesService.getCourse(courseId);

    const projectsRes = await axios.get(`${this.apiBaseUrl}/v1/projects.json`, {
      headers: { Authorization: `Bearer ${this.apiPassword}` },
    });

    const existing = (projectsRes.data as any[]).find(
      (p) => p.name === course.title,
    );
    if (existing) return existing.hashedId as string;

    const createRes = await axios.post(
      `${this.apiBaseUrl}/v1/projects.json`,
      { name: course.title },
      { headers: { Authorization: `Bearer ${this.apiPassword}` } },
    );

    return createRes.data.hashedId as string;
  }

  async generateExpiringToken(projectId: string): Promise<string> {
    const expiresAt = Math.floor(Date.now() / 1000) + 30 * 60;

    const resp = await axios.post(
      `${this.apiBaseUrl}/v2/expiring_token`,
      null,
      {
        headers: { Authorization: `Bearer ${this.apiPassword}` },
        params: {
          expires_at: expiresAt,
          required_params: JSON.stringify({ project_id: projectId }),
        },
      },
    );

    return resp.data.data.attributes.token as string;
  }

  async getUploadData(courseId: string) {
    const projectId = await this.getOrCreateProject(courseId);
    const uploadToken = await this.generateExpiringToken(projectId);

    return {
      projectId,
      uploadToken,
    };
  }
}
