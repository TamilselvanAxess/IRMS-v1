// config/calendarConfig.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Path to the credentials file downloaded from Google Cloud Console
const CREDENTIALS_PATH = path.join(__dirname, '../config/credentials.json');
// Path where the token will be stored after authentication
const TOKEN_PATH = path.join(__dirname, '../config/token.json');

// Scopes required for Google Calendar API
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

/**
 * Create an OAuth2 client with the given credentials
 */
async function authorize() {
  try {
    // Load client secrets from file
    const content = await fs.readFile(CREDENTIALS_PATH);
    const credentials = JSON.parse(content);
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token
    try {
      const token = await fs.readFile(TOKEN_PATH);
      oAuth2Client.setCredentials(JSON.parse(token));
      return oAuth2Client;
    } catch (err) {
      return getAccessToken(oAuth2Client);
    }
  } catch (err) {
    console.error('Error loading credentials:', err);
    throw err;
  }
}

/**
 * Get and store new token after prompting for user authorization
 */
async function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  
  console.log('Authorize this app by visiting this url:', authUrl);
  
  // For a production application, you would use a proper authentication flow
  // For simplicity in this demo, we'll use a command-line approach
  console.log('After authorization, copy the code from the redirect URL and run:');
  console.log('node setToken.js <the-code-from-url>');
  
  throw new Error('Authentication required. Follow the instructions in the console.');
}

/**
 * Store token to disk for later program executions
 */
export async function storeToken(code) {
  try {
    // Load client secrets
    const content = await fs.readFile(CREDENTIALS_PATH);
    const credentials = JSON.parse(content);
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    
    // Exchange authorization code for access token
    const { tokens } = await oAuth2Client.getToken(code);
    console.log(tokens);
    oAuth2Client.setCredentials(tokens);
    
    // Store the token to disk for later program executions
    await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens));
    console.log('Token stored to', TOKEN_PATH);
    
    return oAuth2Client;
  } catch (err) {
    console.error('Error storing token:', err);
    throw err;
  }
}

export { authorize };