import { writable, type Writable } from 'svelte/store';
import type { Resource } from '../../types/types';

export const resourcesStore: Writable<Resource[] | null> = writable(null);
