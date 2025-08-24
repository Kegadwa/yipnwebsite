// Email service for sending ticket confirmations and notifications
// This is a placeholder service that can be integrated with services like SendGrid, AWS SES, or Nodemailer

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface TicketEmailData {
  customerName: string;
  customerEmail: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  ticketNumber: string;
  quantity: number;
  totalAmount: number;
  paymentMethod: string;
}

export const emailService = {
  // Send ticket confirmation email
  async sendTicketConfirmation(ticketData: TicketEmailData): Promise<boolean> {
    try {
      const emailData: EmailData = {
        to: ticketData.customerEmail,
        subject: `Ticket Confirmation - ${ticketData.eventTitle}`,
        html: generateTicketConfirmationHTML(ticketData),
        text: generateTicketConfirmationText(ticketData),
      };

      // TODO: Integrate with actual email service (SendGrid, AWS SES, etc.)
      console.log('Sending ticket confirmation email:', emailData);
      
      // For now, just return success
      // In production, this would call the actual email service
      return true;
    } catch (error) {
      console.error('Error sending ticket confirmation email:', error);
      return false;
    }
  },

  // Send order confirmation email
  async sendOrderConfirmation(orderData: OrderEmailData): Promise<boolean> {
    try {
      const emailData: EmailData = {
        to: orderData.customerEmail,
        subject: `Order Confirmation - YIPN Shop`,
        html: generateOrderConfirmationHTML(orderData),
        text: generateOrderConfirmationText(orderData),
      };

      // TODO: Integrate with actual email service
      console.log('Sending order confirmation email:', emailData);
      
      return true;
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      return false;
    }
  },

  // Send event reminder email
  async sendEventReminder(eventData: EventEmailData, attendees: AttendeeEmailData[]): Promise<boolean> {
    try {
      const promises = attendees.map(attendee => {
        const emailData: EmailData = {
          to: attendee.email,
          subject: `Event Reminder - ${eventData.title}`,
          html: generateEventReminderHTML(eventData, attendee),
          text: generateEventReminderText(eventData, attendee),
        };

        // TODO: Integrate with actual email service
        console.log('Sending event reminder email:', emailData);
        return Promise.resolve(true);
      });

      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error('Error sending event reminder emails:', error);
      return false;
    }
  },
};

// HTML email templates
function generateTicketConfirmationHTML(ticket: TicketEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ticket Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #66371B; color: #F7F1E1; padding: 20px; text-align: center; }
        .content { background: #F7F1E1; padding: 20px; }
        .ticket-details { background: #FFFFFF; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .footer { background: #8A6240; color: #F7F1E1; padding: 20px; text-align: center; }
        .highlight { color: #66371B; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎫 Ticket Confirmation</h1>
          <p>YIPN™ - Your Inner Peace Network</p>
        </div>
        
        <div class="content">
          <h2>Hello ${ticket.customerName}!</h2>
          <p>Thank you for purchasing tickets for <span class="highlight">${ticket.eventTitle}</span>.</p>
          
          <div class="ticket-details">
            <h3>Event Details</h3>
            <p><strong>Event:</strong> ${ticket.eventTitle}</p>
            <p><strong>Date:</strong> ${ticket.eventDate}</p>
            <p><strong>Time:</strong> ${ticket.eventTime}</p>
            <p><strong>Location:</strong> ${ticket.eventLocation}</p>
            <p><strong>Ticket Number:</strong> ${ticket.ticketNumber}</p>
            <p><strong>Quantity:</strong> ${ticket.quantity}</p>
            <p><strong>Total Amount:</strong> KSh ${ticket.totalAmount.toLocaleString()}</p>
            <p><strong>Payment Method:</strong> ${ticket.paymentMethod}</p>
          </div>
          
          <p>Please arrive 15 minutes before the event starts. Bring this confirmation with you.</p>
          
          <p>If you have any questions, please contact us at info@yipn.com</p>
        </div>
        
        <div class="footer">
          <p>© 2024 YIPN™ - Your Inner Peace Network</p>
          <p>Nairobi, Kenya</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateTicketConfirmationText(ticket: TicketEmailData): string {
  return `
Ticket Confirmation - YIPN™

Hello ${ticket.customerName}!

Thank you for purchasing tickets for ${ticket.eventTitle}.

Event Details:
- Event: ${ticket.eventTitle}
- Date: ${ticket.eventDate}
- Time: ${ticket.eventTime}
- Location: ${ticket.eventLocation}
- Ticket Number: ${ticket.ticketNumber}
- Quantity: ${ticket.quantity}
- Total Amount: KSh ${ticket.totalAmount.toLocaleString()}
- Payment Method: ${ticket.paymentMethod}

Please arrive 15 minutes before the event starts. Bring this confirmation with you.

If you have any questions, please contact us at info@yipn.com

© 2024 YIPN™ - Your Inner Peace Network
Nairobi, Kenya
  `;
}

function generateOrderConfirmationHTML(order: OrderEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #66371B; color: #F7F1E1; padding: 20px; text-align: center; }
        .content { background: #F7F1E1; padding: 20px; }
        .order-details { background: #FFFFFF; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .footer { background: #8A6240; color: #F7F1E1; padding: 20px; text-align: center; }
        .highlight { color: #66371B; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛍️ Order Confirmation</h1>
          <p>YIPN™ Shop</p>
        </div>
        
        <div class="content">
          <h2>Hello ${order.customerName}!</h2>
          <p>Thank you for your order from the YIPN™ Shop.</p>
          
          <div class="order-details">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Total Amount:</strong> KSh ${order.totalAmount.toLocaleString()}</p>
            <p><strong>Shipping Address:</strong> ${order.shippingAddress}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          </div>
          
          <p>We'll notify you when your order ships.</p>
          
          <p>If you have any questions, please contact us at shop@yipn.com</p>
        </div>
        
        <div class="footer">
          <p>© 2024 YIPN™ - Your Inner Peace Network</p>
          <p>Nairobi, Kenya</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateOrderConfirmationText(order: OrderEmailData): string {
  return `
Order Confirmation - YIPN™ Shop

Hello ${order.customerName}!

Thank you for your order from the YIPN™ Shop.

Order Details:
- Order ID: ${order.id}
- Total Amount: KSh ${order.totalAmount.toLocaleString()}
- Shipping Address: ${order.shippingAddress}
- Payment Method: ${order.paymentMethod}

We'll notify you when your order ships.

If you have any questions, please contact us at shop@yipn.com

© 2024 YIPN™ - Your Inner Peace Network
Nairobi, Kenya
  `;
}

function generateEventReminderHTML(event: EventEmailData, attendee: AttendeeEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Event Reminder</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #66371B; color: #F7F1E1; padding: 20px; text-align: center; }
        .content { background: #F7F1E1; padding: 20px; }
        .event-details { background: #FFFFFF; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .footer { background: #8A6240; color: #F7F1E1; padding: 20px; text-align: center; }
        .highlight { color: #66371B; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📅 Event Reminder</h1>
          <p>YIPN™ - Your Inner Peace Network</p>
        </div>
        
        <div class="content">
          <h2>Hello ${attendee.name}!</h2>
          <p>This is a friendly reminder about the upcoming event.</p>
          
          <div class="event-details">
            <h3>Event Details</h3>
            <p><strong>Event:</strong> ${event.title}</p>
            <p><strong>Date:</strong> ${event.date}</p>
            <p><strong>Time:</strong> ${event.time}</p>
            <p><strong>Location:</strong> ${event.location}</p>
          </div>
          
          <p>We look forward to seeing you there!</p>
          
          <p>If you have any questions, please contact us at info@yipn.com</p>
        </div>
        
        <div class="footer">
          <p>© 2024 YIPN™ - Your Inner Peace Network</p>
          <p>Nairobi, Kenya</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateEventReminderText(event: EventEmailData, attendee: AttendeeEmailData): string {
  return `
Event Reminder - YIPN™

Hello ${attendee.name}!

This is a friendly reminder about the upcoming event.

Event Details:
- Event: ${event.title}
- Date: ${event.date}
- Time: ${event.time}
- Location: ${event.location}

We look forward to seeing you there!

If you have any questions, please contact us at info@yipn.com

© 2024 YIPN™ - Your Inner Peace Network
Nairobi, Kenya
  `;
}
