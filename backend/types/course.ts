// types/course.ts
export interface Course {
	id: string; // UUID or Supabase-generated primary key
	name: string; // Course name (e.g., "Mathematics", "Physics")
	created_at?: string; // ISO date string
	updated_at?: string;
}
