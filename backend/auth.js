const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { google } = require('googleapis');
require('dotenv').config();

// Passport Strategy Setup
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.GOOGLE_CALLBACK_URL,
		},
		(accessToken, refreshToken, profile, done) => {
			done(null, {
				profile,
				tokens: { access_token: accessToken, refresh_token: refreshToken },
			});
		}
	)
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Gmail API Client
function getGmailClient(accessToken) {
	if (!accessToken) return null;
	const oauth2Client = new google.auth.OAuth2(
		process.env.GOOGLE_CLIENT_ID,
		process.env.GOOGLE_CLIENT_SECRET
	);
	oauth2Client.setCredentials({ access_token: accessToken });
	return google.gmail({ version: 'v1', auth: oauth2Client });
}

module.exports = {
	passport,
	getGmailClient,
};
