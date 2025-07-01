// Function to add payment schedule to Google Calendar
import { authorize } from '../config/calendarConfig.js';
import { google } from 'googleapis';

async function addPaymentToCalendar(candidateId, fullName, amount, paymentDate) {
    try {
      const auth = await authorize();
      const calendar = google.calendar({ version: 'v3', auth });
      
      // Format the date properly
      const formattedDate = new Date(paymentDate);
      
      // Create event details
      const event = {
        summary: `Payment Due: ${candidateId} - ${fullName}`,
        description: `Balance payment of ${amount} due for candidate ${fullName} (${candidateId})`,
        start: {
          dateTime: formattedDate.toISOString(),
          timeZone: 'Asia/Kolkata', // Adjust to your timezone
        },
        end: {
          dateTime: new Date(formattedDate.getTime() + 60 * 60000).toISOString(), // 1 hour event
          timeZone: 'Asia/Kolkata', // Adjust to your timezone
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 30 }, // 30 minutes before
          ],
        },
      };
  
      // Insert the event
      const result = await calendar.events.insert({
        calendarId: 'primary', // Use primary calendar or specify another calendar ID
        resource: event,
      });
  
      console.log(`Event created: ${result.data.htmlLink}`);
      return result.data.htmlLink;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }
  
  export default addPaymentToCalendar;