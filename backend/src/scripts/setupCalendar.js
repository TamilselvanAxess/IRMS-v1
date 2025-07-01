// src/scripts/setupCalendar.js
import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import readline from 'readline';

// Define paths
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const CREDENTIALS_PATH = path.join(process.cwd(), 'src', 'config', 'credentials.json');
const TOKEN_PATH = path.join(process.cwd(), 'src', 'config', 'token.json');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Check if credentials file exists
if (!fs.existsSync(CREDENTIALS_PATH)) {
  console.error(`
  Error: credentials.json file not found at ${CREDENTIALS_PATH}
  
  Please follow these steps:
  1. Go to the Google Cloud Console (https://console.cloud.google.com/)
  2. Create a project or select an existing one
  3. Enable the Google Calendar API
  4. Create OAuth 2.0 credentials
  5. Download the credentials as "credentials.json"
  6. Place the file in: ${CREDENTIALS_PATH}
  
  Then run this script again.
  `);
  process.exit(1);
}

// Read credentials file
const content = fs.readFileSync(CREDENTIALS_PATH);
const credentials = JSON.parse(content);

// Handle both web and installed (desktop) application credentials
let client_id, client_secret, redirect_uris;

if (credentials.web) {
  // Web application credentials
  client_id = credentials.web.client_id;
  client_secret = credentials.web.client_secret;
  redirect_uris = credentials.web.redirect_uris || ['http://localhost:8000/auth/google/callback'];
} else if (credentials.installed) {
  // Desktop application credentials
  client_id = credentials.installed.client_id;
  client_secret = credentials.installed.client_secret;
  redirect_uris = credentials.installed.redirect_uris;
} else {
  throw new Error('Invalid credentials format');
}

// If redirect URIs aren't specified in web credentials, add a default one
if (!redirect_uris || redirect_uris.length === 0) {
  redirect_uris = ['http://localhost'];
  console.log('No redirect URIs found in credentials, using default: http://localhost');
}

const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Generate authorization URL
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});

console.log('Authorize this app by visiting this URL:', authUrl);
console.log('\nAfter authorization, you will be redirected to a page. Copy the code from the URL.');
console.log('The code will be after "code=" in the URL.');

// Get authorization code from user
rl.question('Enter the code from that page here: ', (code) => {
  rl.close();
  
  // Exchange code for tokens
  oAuth2Client.getToken(code, (err, token) => {
    if (err) {
      console.error('Error retrieving access token:', err);
      return;
    }
    
    // Create directory if it doesn't exist
    const tokenDir = path.dirname(TOKEN_PATH);
    if (!fs.existsSync(tokenDir)) {
      fs.mkdirSync(tokenDir, { recursive: true });
    }
    
    // Save token to file
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to', TOKEN_PATH);
    
    // Test the token by listing calendar events
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err) {
        console.error('The API returned an error:', err);
        return;
      }
      
      const events = res.data.items;
      if (events.length) {
        console.log('Upcoming 10 events:');
        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          console.log(`${start} - ${event.summary}`);
        });
      } else {
        console.log('No upcoming events found.');
      }
      console.log('\nGoogle Calendar integration is now set up successfully!');
    });
  });
});