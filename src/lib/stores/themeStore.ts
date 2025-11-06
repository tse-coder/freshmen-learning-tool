import { writable } from 'svelte/store';


function getInitialTheme(): 'light' | 'dark' {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('theme');
        if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'light';
}

// Ensure initial application before any components mount
const initialTheme = getInitialTheme();
if (typeof window !== 'undefined') {
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
}

export const theme = writable<'light' | 'dark'>(initialTheme);

theme.subscribe((value) => {
    if (typeof window !== 'undefined') {
        const html = document.documentElement;
        if (value === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
        localStorage.setItem('theme', value);
    }
});

export function toggleTheme() {
    theme.update(t => t === 'light' ? 'dark' : 'light');
}

export function setTheme(value: 'light' | 'dark') {
    theme.set(value);
}
