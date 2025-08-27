import crypto from 'crypto';
const botToken = process.env.BOT_TOKEN;

export const verifyTelegramInitData = (initData) => {
	const params = new URLSearchParams(initData);
	const data = {};
	params.forEach((v, k) => (data[k] = v));

	const receivedHash = data.hash;
	delete data.hash;

	const checkString = Object.keys(data)
		.sort()
		.map((key) => `${key}=${data[key]}`)
		.join('\n');

	const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();

	const hmac = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex');

	return hmac === receivedHash ? JSON.parse(data.user) : null;
};
