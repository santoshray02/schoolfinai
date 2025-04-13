import { Twilio } from 'twilio';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

let twilioClient: Twilio | null = null;

// Only initialize if credentials are available
if (accountSid && authToken) {
  twilioClient = new Twilio(accountSid, authToken);
}

/**
 * Send SMS message using Twilio
 * @param to Phone number to send SMS to
 * @param message SMS message content
 * @returns Promise with message SID or error
 */
export async function sendSMS(to: string, message: string) {
  if (!twilioClient) {
    console.error('Twilio client not initialized. Check environment variables.');
    return { success: false, error: 'SMS service not configured' };
  }

  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: fromNumber,
      to,
    });

    return { success: true, messageSid: result.sid };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Send bulk SMS messages
 * @param recipients Array of objects with phone numbers and messages
 * @returns Array of results
 */
export async function sendBulkSMS(
  recipients: Array<{ to: string; message: string }>
) {
  const results = [];

  for (const recipient of recipients) {
    const result = await sendSMS(recipient.to, recipient.message);
    results.push({ ...recipient, ...result });
  }

  return results;
}

/**
 * Send fee payment reminder
 * @param studentName Student name
 * @param parentPhone Parent phone number
 * @param amount Fee amount
 * @param dueDate Due date
 * @returns SMS sending result
 */
export async function sendFeeReminder(
  studentName: string,
  parentPhone: string,
  amount: number,
  dueDate: string
) {
  const message = `Dear Parent/Guardian, This is a reminder that ${studentName}'s fee payment of ${amount} is due on ${dueDate}. Please make the payment on time to avoid late fees. Thank you.`;
  
  return sendSMS(parentPhone, message);
}

/**
 * Send payment confirmation
 * @param studentName Student name
 * @param parentPhone Parent phone number
 * @param amount Amount paid
 * @param receiptNumber Receipt number
 * @returns SMS sending result
 */
export async function sendPaymentConfirmation(
  studentName: string,
  parentPhone: string,
  amount: number,
  receiptNumber: string
) {
  const message = `Thank you for your payment of ${amount} for ${studentName}. Receipt #${receiptNumber} has been generated. You can download it from the parent portal.`;
  
  return sendSMS(parentPhone, message);
}
