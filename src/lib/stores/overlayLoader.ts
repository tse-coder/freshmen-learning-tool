import { writable } from 'svelte/store';

export const overlayLoading = writable(false);
export const overlayMessage = writable('Loading...');
