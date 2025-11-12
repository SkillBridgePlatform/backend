import { Tables } from 'src/supabase/types';

export type Lesson = Tables<'lessons'>;
export type ContentBlock = Tables<'content_blocks'>;
export type TextContentBlock = Tables<'text_content_blocks'>;
export type VideoContentBlock = Tables<'video_content_blocks'>;
