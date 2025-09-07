const dotenv = require('dotenv');
dotenv.config();

require('./auth');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const { getGmailClient } = require('./auth');
const session = require('express-session');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const secret = process.env.JWT_SECRET;

const app = express();

//middleware
app.use(
	cors({
		origin: 'http://localhost:8080',
		credentials: true,
	})
);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			secure: false,
			sameSite: 'lax',
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());

// Validate environment variables
if (!process.env.MONGODB_URI || !process.env.PORT || !process.env.JWT_SECRET) {
	console.error(
		'Fatal Error: MONGODB_URI, PORT or JWT_SECRET not defined in .env'
	);
	process.exit(1);
}

mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => console.log('✅ Connected to MongoDB'))
	.catch((err) => console.error('❌ MongoDB connection error:', err));

// 🔐 Secret key for encryption
const secretKey = process.env.JWT_SECRET;

//sign-up
app.post('/api/register', async (req, res) => {
	const { name, email, password } = req.body;

	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ error: 'User already exists' });
		}

		const newUser = new User({ name, email, password });
		await newUser.save();
		res.status(201).json({ message: 'User registered successfully' });
	} catch (error) {
		console.error('❌ /api/register error:', error);
		res.status(500).json({ error: 'Registration failed', details: error });
	}
});

// Backend login
app.post('/api/login', async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ error: 'Email and password are required.' });
	}

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ error: 'User not found' });
		}

		// Compare hashed passwords using bcryptjs
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			return res.status(400).json({ error: 'Invalid password' });
		}

		// Create JWT token
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: '1h',
		});

		const { password: _, ...safeUser } = user._doc;

		// ✅ Set the token as an HTTP-only cookie
		res.cookie('token', token, {
			httpOnly: true,
			secure: false,
			sameSite: 'lax',
			maxAge: 3600000,
		});

		res.json({ token, user: safeUser });
	} catch (error) {
		console.error('❌ Login error:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Start OAuth flow
app.get(
	'/auth/google',
	passport.authenticate('google', {
		scope: ['profile', 'email', 'https://mail.google.com/'],
		accessType: 'offline',
		prompt: 'consent',
	})
);

// OAuth callback
app.get(
	'/auth/google/callback',
	passport.authenticate('google', { failureRedirect: '/login' }),
	async (req, res) => {
		const accessToken = req.user.tokens?.access_token;
		const refreshToken = req.user.tokens?.refresh_token;
		const profile = req.user.profile;

		if (!accessToken || !refreshToken) {
			console.error('❌ Tokens missing from req.user');
			return res.status(500).send('Authentication failed');
		}

		// Generate JWT using user profile ID
		const token = jwt.sign({ userId: profile.id }, process.env.JWT_SECRET, {
			expiresIn: '1h',
		});

		res.cookie('token', token, {
			httpOnly: true,
			secure: false,
			sameSite: 'lax',
			maxAge: 3600000,
		});

		res.redirect(
			`http://localhost:8080/?access_token=${accessToken}&refresh_token=${refreshToken}`
		);
	}
);

// Send email
app.post('/gmail/send', async (req, res) => {
	const authHeader = req.headers.authorization;
	const token = authHeader?.split(' ')[1] || req.cookies.token;

	if (!token) {
		return res.status(401).send('Unauthorized: No token found');
	}

	try {
		let googleAccessToken;

		if (token.startsWith('ya29.') || token.length > 300) {
			googleAccessToken = token;
		} else {
			return res.status(401).send('Google access token required');
		}

		const gmail = getGmailClient(googleAccessToken);
		if (!gmail) {
			return res.status(500).send('Gmail client not authenticated');
		}

		const { to, subject, body } = req.body;
		if (!to || !subject || !body) {
			return res.status(400).send('Missing required fields');
		}

		const message = [
			`From: me`,
			`To: ${to}`,
			'Content-Type: text/plain; charset="UTF-8"',
			'MIME-Version: 1.0',
			`Subject: ${subject}`,
			'',
			body,
		].join('\r\n');

		const encodedMessage = Buffer.from(message)
			.toString('base64')
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=+$/, '');

		await gmail.users.messages.send({
			userId: 'me',
			requestBody: { raw: encodedMessage },
		});

		res.status(200).send('Email sent!');
	} catch (err) {
		console.error(
			'❌ Error sending email:',
			err.message,
			err.response?.data || ''
		);
		res.status(500).send('Error sending email');
	}
});

//inbox
app.get('/gmail/inbox', async (req, res) => {
	try {
		const token = req.headers.authorization?.split(' ')[1];
		if (!token) return res.status(401).send('Missing access token');

		const gmail = getGmailClient(token);

		const response = await gmail.users.messages.list({
			userId: 'me',
			labelIds: ['INBOX'],
			maxResults: 10,
		});

		const messages = await Promise.all(
			(response.data.messages || []).map((msg) =>
				gmail.users.messages.get({ userId: 'me', id: msg.id })
			)
		);

		const parsed = messages.map(({ data }) => {
			const headers = data.payload.headers || [];
			let body = '';

			if (data.payload.parts) {
				const part = data.payload.parts.find(
					(p) => p.mimeType === 'text/plain'
				);
				body = part?.body?.data
					? Buffer.from(part.body.data, 'base64').toString('utf-8')
					: '';
			}

			return {
				id: data.id,
				sender: headers.find((h) => h.name === 'From')?.value || '',
				subject: headers.find((h) => h.name === 'Subject')?.value || '',
				body: body || data.snippet || '',
				date: data.internalDate,
				read: !(data.labelIds || []).includes('UNREAD'),
			};
		});

		res.json(parsed);
	} catch (err) {
		console.error('Error fetching inbox:', err.message);
		res.status(500).send('Failed to fetch inbox');
	}
});

//sent emails
app.get('/gmail/sent', async (req, res) => {
	const token = req.headers.authorization?.split(' ')[1];
	if (!token) return res.status(401).send('Missing access token');

	const gmail = getGmailClient(token);

	try {
		const response = await gmail.users.messages.list({
			userId: 'me',
			labelIds: ['SENT'],
			maxResults: 10,
		});

		const messages = await Promise.all(
			(response.data.messages || []).map((msg) =>
				gmail.users.messages.get({ userId: 'me', id: msg.id })
			)
		);

		const parsed = messages.map(({ data }) => ({
			id: data.id,
			sender: data.payload.headers.find((h) => h.name === 'From')?.value || '',
			recipient: data.payload.headers.find((h) => h.name === 'To')?.value || '',
			subject:
				data.payload.headers.find((h) => h.name === 'Subject')?.value || '',
			body: data.snippet,
			date: data.internalDate,
			read: !(data.labelIds || []).includes('UNREAD'),
		}));

		res.json(parsed);
	} catch (err) {
		console.error('Error fetching sent messages:', err.message);
		res.status(500).send('Failed to fetch sent emails');
	}
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
});
