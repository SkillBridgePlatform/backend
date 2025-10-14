import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { Database } from './types';

dotenv.config();

@Injectable()
export class SupabaseService {
  private readonly supabase: SupabaseClient<Database>;

  constructor() {
    const SUPABASE_URL = process.env.SUPABASE_URL!;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

    this.supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  }

  get client(): SupabaseClient<Database> {
    return this.supabase;
  }
}
