const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { google } = require('googleapis');
require('dotenv').config();

//passport strategy setup here
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: '/auth/google/callback',
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

function getGmailClient(accessToken) {
	if (!accessToken) return null;
	const oauth2Client = new google.auth.OAuth2();
	oauth2Client.setCredentials({ access_token: accessToken });
	return google.gmail({ version: 'v1', auth: oauth2Client });
}

module.exports = {
	passport,
	getGmailClient,
};
