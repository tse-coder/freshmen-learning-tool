// src/global.d.ts
interface Window {
	Telegram?: {
		WebApp: {
			initData: string;
			initDataUnsafe: any;
			colorScheme: 'light' | 'dark';
			ready: () => void;
			onEvent: (event: string, callback: () => void) => void;
			offEvent: (event: string, callback: () => void) => void;
			sendData: (data: string) => void;
			openLink: (url: string) => void;
			expand: () => void;
			close: () => void;
			enableClosingConfirmation: () => void;
			// add more methods/properties as needed
		};
	};
}
