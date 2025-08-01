// src/lib/utils/useTelegram.ts
export const tg = window.Telegram?.WebApp;

export function initTelegramTheme() {
	if (!tg) return;
	tg.expand(); // make app full screen
	tg.enableClosingConfirmation();
	document.body.classList.toggle('dark', tg.colorScheme === 'dark');
}
