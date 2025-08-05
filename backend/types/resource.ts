// types/module.ts
export interface Resource {
	id: string; // UUID or Supabase-generated primary key
	course_id: string; // Foreign key referencing courses.id
	title: string; // Resource title (e.g., "Algebra Basics")
	type: string; // Resource type, e.g., 'PDF', 'Video'
	url: string; // Public URL or Supabase Storage path to the resource (e.g. PDF link)
	created_at?: string;
	updated_at?: string;
}
