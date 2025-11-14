import { Tables } from 'src/supabase/types';
import { Course } from './course.entity';
import { CourseModule } from './module.entity';

export type Lesson = Tables<'lessons'>;
export type ContentBlock = Tables<'content_blocks'>;
export type TextContentBlock = Tables<'text_content_blocks'>;
export type VideoContentBlock = Tables<'video_content_blocks'>;

export type LessonWithBlocks = Lesson & {
  courseModule: CourseModule & {
    course: Course;
  };
  contentBlocks: (ContentBlock & {
    text: TextContentBlock | null;
    video: VideoContentBlock | null;
  })[];
};
