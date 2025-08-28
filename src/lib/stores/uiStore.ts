import { writable } from 'svelte/store';

export const pageTitle = writable('Fresh Hub');

export function setPageTitle(t: string) {
	pageTitle.set(t);
}

export function resetPageTitle() {
	pageTitle.set('Fresh Hub');
}
