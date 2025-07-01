import { authorize } from '../config/calendarConfig.js';
import { google } from 'googleapis';

class CalendarService {
  constructor() {
    this.auth = null;
    this.calendar = null;
  }

  /**
   * Initialize calendar service
   */
  async initialize() {
    try {
      this.auth = await authorize();
      this.calendar = google.calendar({ version: 'v3', auth: this.auth });
    } catch (error) {
      console.error('Calendar initialization failed:', error);
      throw error;
    }
  }

  /**
   * Add payment event to calendar
   */
  async addPaymentEvent(candidateId, fullName, amount, paymentDate) {
    try {
      if (!this.calendar) {
        await this.initialize();
      }

      const formattedDate = new Date(paymentDate);
      
      const event = {
        summary: `Payment Due: ${candidateId} - ${fullName}`,
        description: `Balance payment of ₹${amount} due for candidate ${fullName} (${candidateId})`,
        start: {
          dateTime: formattedDate.toISOString(),
          timeZone: 'Asia/Kolkata',
        },
        end: {
          dateTime: new Date(formattedDate.getTime() + 60 * 60000).toISOString(),
          timeZone: 'Asia/Kolkata',
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 30 }, // 30 minutes before
          ],
        },
      };

      const result = await this.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      console.log(`Calendar event created: ${result.data.htmlLink}`);
      return result.data.htmlLink;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }

  /**
   * Add interview event to calendar
   */
  async addInterviewEvent(candidateId, fullName, interviewData) {
    try {
      if (!this.calendar) {
        await this.initialize();
      }

      const interviewDate = new Date(interviewData.interviewDateTime);
      
      const event = {
        summary: `Interview: ${candidateId} - ${fullName}`,
        description: `
          Interview Details:
          - Company: ${interviewData.companyName}
          - Domain: ${interviewData.domain}
          - Level: ${interviewData.interviewLevel}
          - Interviewer: ${interviewData.interviewerName}
          - HR: ${interviewData.hrName} (${interviewData.hrEmail})
          - Status: ${interviewData.status}
        `,
        start: {
          dateTime: interviewDate.toISOString(),
          timeZone: 'Asia/Kolkata',
        },
        end: {
          dateTime: new Date(interviewDate.getTime() + 90 * 60000).toISOString(), // 1.5 hour event
          timeZone: 'Asia/Kolkata',
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 60 }, // 1 hour before
            { method: 'popup', minutes: 15 }, // 15 minutes before
          ],
        },
      };

      const result = await this.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      console.log(`Interview event created: ${result.data.htmlLink}`);
      return result.data.htmlLink;
    } catch (error) {
      console.error('Error creating interview event:', error);
      throw error;
    }
  }

  /**
   * Update calendar event
   */
  async updateEvent(eventId, updatedData) {
    try {
      if (!this.calendar) {
        await this.initialize();
      }

      const result = await this.calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        resource: updatedData,
      });

      console.log(`Calendar event updated: ${result.data.htmlLink}`);
      return result.data.htmlLink;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  }

  /**
   * Delete calendar event
   */
  async deleteEvent(eventId) {
    try {
      if (!this.calendar) {
        await this.initialize();
      }

      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
      });

      console.log(`Calendar event deleted: ${eventId}`);
      return true;
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  }

  /**
   * List calendar events for a date range
   */
  async listEvents(startDate, endDate) {
    try {
      if (!this.calendar) {
        await this.initialize();
      }

      const result = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      return result.data.items;
    } catch (error) {
      console.error('Error listing calendar events:', error);
      throw error;
    }
  }
}

// Export singleton instance
const calendarService = new CalendarService();

// Export individual functions for backward compatibility
export const addPaymentToCalendar = (candidateId, fullName, amount, paymentDate) => 
  calendarService.addPaymentEvent(candidateId, fullName, amount, paymentDate);

export const addInterviewToCalendar = (candidateId, fullName, interviewData) => 
  calendarService.addInterviewEvent(candidateId, fullName, interviewData);

export default calendarService; 