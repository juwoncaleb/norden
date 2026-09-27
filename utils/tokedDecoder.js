// utils/tokenDecoder.js
import { OAuth2Client } from 'google-auth-library';

const CLIENT_ID_GOOGLE = '711392695392-53glhbgfacnh3a5tatq5978oolannhk5.apps.googleusercontent.com'; // Replace with your actual Google Client ID

export async function getDecodedOAuthJwtGoogle(token) {
  const client = new OAuth2Client(CLIENT_ID_GOOGLE);

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID_GOOGLE,
    });

    return ticket.getPayload();
  } catch (error) {
    throw new Error('Token verification failed');
  }
}
