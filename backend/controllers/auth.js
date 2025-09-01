import {verifyTelegramInitData} from "../utils/verifyTelegram.js";

export const login = async (req, res) => {
	const { initData } = req.body;

	const user = verifyTelegramInitData(initData);

	if (!user) return res.status(403).json({ ok: false, error: 'Invalid Telegram data' });

	// TODO: Check if user exists in DB and return session/JWT
	res.json({ ok: true, user });
};

export const signup = async (req, res) => {
	const { initData } = req.body;

	const user = verifyTelegramInitData(initData);

	if (!user) return res.status(403).json({ ok: false, error: 'Invalid Telegram data' });

	// TODO: Save user to DB if not exists, return session/JWT
	res.json({ ok: true, user });
};
