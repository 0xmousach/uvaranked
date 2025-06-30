import { supabase } from './supabase';

export class StudentService {

  static async getRandomProfiles() {
    const { data, error } = await supabase
      .rpc('get_random_profiles');
      
    if (error) throw error;
    return data || [];
  }
}
