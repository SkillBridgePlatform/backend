// src/modules/modules-supabase.repository.ts
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateLessonDto } from '../dto/create-lesson-dto';
import { UpdateLessonDto } from '../dto/update-lesson-dto';
import {
  ContentBlock,
  Lesson,
  LessonWithBlocks,
} from '../entities/lesson.entity';

@Injectable()
export class LessonsRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async getLessons(moduleId: string): Promise<Lesson[]> {
    const { data, error } = await this.supabase.client
      .from('lessons')
      .select('*')
      .eq('module_id', moduleId)
      .order('order', { ascending: true });

    if (error) throw new InternalServerErrorException(error.message);

    return data as Lesson[];
  }

  async reorderLessons(
    moduleId: string,
    lessonOrders: { id: string; order: number }[],
  ): Promise<void> {
    const updates = lessonOrders.map((m) =>
      this.supabase.client
        .from('lessons')
        .update({ order: m.order })
        .eq('id', m.id)
        .eq('module_id', moduleId),
    );

    const results = await Promise.all(updates);

    for (const res of results) {
      if (res.error) {
        throw new Error(`Failed to update lesson order: ${res.error.message}`);
      }
    }
  }

  async createLessonWithBlocks(
    moduleId: string,
    dto: CreateLessonDto,
  ): Promise<Lesson & { contentBlocks: ContentBlock[] }> {
    const { title, estimated_duration, contentBlocks } = dto;

    if (!title) throw new BadRequestException('Title is required');

    const baseSlug = this.generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const { data, error } = await this.supabase.client
        .from('lessons')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw new InternalServerErrorException(error.message);

      if (!data) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const { data: lastLesson, error: orderError } = await this.supabase.client
      .from('lessons')
      .select('order')
      .eq('module_id', moduleId)
      .order('order', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (orderError) throw new InternalServerErrorException(orderError.message);
    const order = lastLesson?.order != null ? lastLesson.order + 1 : 0;

    const { data: lessonData, error: lessonError } = await this.supabase.client
      .from('lessons')
      .insert({
        module_id: moduleId,
        title,
        estimated_duration: estimated_duration ?? null,
        order,
        slug,
      })
      .select()
      .single();

    if (lessonError)
      throw new InternalServerErrorException(lessonError.message);
    if (!lessonData)
      throw new InternalServerErrorException('Lesson not created');

    const lessonId = lessonData.id;
    const insertedBlocks: ContentBlock[] = [];

    for (let index = 0; index < contentBlocks.length; index++) {
      const block = contentBlocks[index];

      // Insert into content_blocks table
      const { data: contentBlockData, error: blockError } =
        await this.supabase.client
          .from('content_blocks')
          .insert({
            lesson_id: lessonId,
            type: block.type,
            order: index,
          })
          .select()
          .single();

      if (blockError)
        throw new InternalServerErrorException(blockError.message);

      if (block.type === 'text') {
        if (!block.content) {
          throw new BadRequestException('content is required for text blocks');
        }

        const { data: textData, error: textError } = await this.supabase.client
          .from('text_content_blocks')
          .insert({
            content_block_id: contentBlockData.id,
            title: block.title,
            content: block.content,
          })
          .select()
          .single();

        if (textError)
          throw new InternalServerErrorException(textError.message);

        insertedBlocks.push({
          ...contentBlockData,
          ...textData,
        } as ContentBlock);
      } else if (block.type === 'video') {
        if (!block.videoUrl) {
          throw new BadRequestException(
            'videoUrl is required for video blocks',
          );
        }

        const { data: videoData, error: videoError } =
          await this.supabase.client
            .from('video_content_blocks')
            .insert({
              content_block_id: contentBlockData.id,
              title: block.title,
              video_url: block.videoUrl,
            })
            .select()
            .single();

        if (videoError)
          throw new InternalServerErrorException(videoError.message);

        insertedBlocks.push({
          ...contentBlockData,
          ...videoData,
        } as ContentBlock);
      } else {
        throw new BadRequestException(`Invalid block type`);
      }
    }

    return {
      ...lessonData,
      contentBlocks: insertedBlocks,
    };
  }

  async updateLessonWithBlocks(
    lessonId: string,
    dto: UpdateLessonDto,
  ): Promise<Lesson & { contentBlocks: ContentBlock[] }> {
    const { title, estimated_duration, contentBlocks } = dto;

    // Ensure the lesson exists
    const { data: existingLesson, error: existingError } =
      await this.supabase.client
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .maybeSingle();

    if (existingError)
      throw new InternalServerErrorException(existingError.message);
    if (!existingLesson) throw new NotFoundException('Lesson not found');

    // Update basic lesson info
    const { data: updatedLesson, error: lessonError } =
      await this.supabase.client
        .from('lessons')
        .update({
          title,
          estimated_duration,
          updated_at: new Date().toISOString(),
        })
        .eq('id', lessonId)
        .select()
        .single();

    if (lessonError)
      throw new InternalServerErrorException(lessonError.message);

    // Clear old content blocks (cascade deletes text/video)
    const { error: deleteError } = await this.supabase.client
      .from('content_blocks')
      .delete()
      .eq('lesson_id', lessonId);

    if (deleteError)
      throw new InternalServerErrorException(deleteError.message);

    // Insert new content blocks
    const insertedBlocks: ContentBlock[] = [];

    const blocks = contentBlocks || [];
    for (let index = 0; index < blocks.length; index++) {
      const block = blocks[index];

      const { data: contentBlockData, error: blockError } =
        await this.supabase.client
          .from('content_blocks')
          .insert({
            lesson_id: lessonId,
            type: block.type,
            order: index,
          })
          .select()
          .single();

      if (blockError)
        throw new InternalServerErrorException(blockError.message);

      if (block.type === 'text') {
        if (!block.content)
          throw new BadRequestException('content is required for text blocks');

        const { data: textData, error: textError } = await this.supabase.client
          .from('text_content_blocks')
          .insert({
            content_block_id: contentBlockData.id,
            title: block.title,
            content: block.content,
          })
          .select()
          .single();

        if (textError)
          throw new InternalServerErrorException(textError.message);

        insertedBlocks.push({
          ...contentBlockData,
          ...textData,
        } as ContentBlock);
      } else if (block.type === 'video') {
        if (!block.videoUrl)
          throw new BadRequestException(
            'videoUrl is required for video blocks',
          );

        const { data: videoData, error: videoError } =
          await this.supabase.client
            .from('video_content_blocks')
            .insert({
              content_block_id: contentBlockData.id,
              title: block.title,
              video_url: block.videoUrl,
            })
            .select()
            .single();

        if (videoError)
          throw new InternalServerErrorException(videoError.message);

        insertedBlocks.push({
          ...contentBlockData,
          ...videoData,
        } as ContentBlock);
      } else {
        throw new BadRequestException(`Invalid block type`);
      }
    }

    return {
      ...updatedLesson,
      contentBlocks: insertedBlocks,
    };
  }

  async getLessonById(id: string): Promise<LessonWithBlocks | null> {
    const { data, error } = await this.supabase.client
      .from('lessons')
      .select(
        `
      *,
      courseModule:module_id(
        *,
        course:course_id(*)
      ),
      contentBlocks:content_blocks(
        *,
        text:text_content_blocks(*),
        video:video_content_blocks(*)
      )
    `,
      )
      .eq('id', id)
      .maybeSingle();

    if (error) throw new InternalServerErrorException(error.message);

    return data as LessonWithBlocks;
  }

  async getLessonBySlug(lessonSlug: string): Promise<LessonWithBlocks | null> {
    const { data, error } = await this.supabase.client
      .from('lessons')
      .select(
        `
      *,
      courseModule:module_id(
        *,
        course:course_id(*)
      ),
      contentBlocks:content_blocks(
        *,
        text:text_content_blocks(*),
        video:video_content_blocks(*)
      )
    `,
      )
      .eq('slug', lessonSlug)
      .maybeSingle();

    if (error) throw new InternalServerErrorException(error.message);

    return data as LessonWithBlocks;
  }

  async deleteLesson(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('lessons')
      .delete()
      .eq('id', id);

    if (error) throw new InternalServerErrorException(error.message);
  }

  async getLessonsByCourse(courseId: string): Promise<Lesson[]> {
    const { data: modules, error: moduleError } = await this.supabase.client
      .from('modules')
      .select('id')
      .eq('course_id', courseId);

    if (moduleError)
      throw new InternalServerErrorException(moduleError.message);
    if (!modules || modules.length === 0) return [];

    const moduleIds = modules.map((m) => m.id);

    const { data: lessons, error: lessonError } = await this.supabase.client
      .from('lessons')
      .select('*')
      .in('module_id', moduleIds)
      .order('order', { ascending: true });

    if (lessonError)
      throw new InternalServerErrorException(lessonError.message);

    return lessons as Lesson[];
  }

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}
