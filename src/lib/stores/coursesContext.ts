import { writable, type Writable } from 'svelte/store';
import type { Course } from '../../types/types';

export const coursesStore: Writable<Course[] | null> = writable(null);
