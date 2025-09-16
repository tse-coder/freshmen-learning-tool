import { writable } from 'svelte/store';


function getInitialTheme(): 'light' | 'dark' {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('theme');
        if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'light';
}

export const theme = writable<'light' | 'dark'>(getInitialTheme());

theme.subscribe((value) => {
    if (typeof window !== 'undefined') {
        document.documentElement.classList.toggle('dark', value === 'dark');
        localStorage.setItem('theme', value);
    }
});

export function toggleTheme() {
    theme.update(t => t === 'light' ? 'dark' : 'light');
}

export function setTheme(value: 'light' | 'dark') {
    theme.set(value);
}
