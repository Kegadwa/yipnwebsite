import type { NextApiRequest, NextApiResponse } from 'next';
import { emailService } from '../../lib/firebase-services';

interface OrderItem {
  product: {
    id?: string;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
  selectedVariants?: { [key: string]: string };
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  mpesaCode: string;
}

interface OrderData {
  customerInfo: CustomerInfo;
  items: OrderItem[];
  total: number;
  orderDate: string;
  orderId: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const orderData: OrderData = req.body;

    // Validate required fields
    if (!orderData.customerInfo?.email || !orderData.customerInfo?.name) {
      return res.status(400).json({ message: 'Missing required customer information' });
    }

    // Generate receipt HTML
    const receiptHTML = generateReceiptHTML(orderData);
    const receiptText = generateReceiptText(orderData);

    // Send email receipt
    const emailSent = await emailService.sendOrderConfirmation({
      customerEmail: orderData.customerInfo.email,
      customerName: orderData.customerInfo.name,
      orderId: orderData.orderId,
      orderDate: new Date(orderData.orderDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      items: orderData.items.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        total: item.product.price * item.quantity,
        variants: item.selectedVariants || {}
      })),
      totalAmount: orderData.total,
      mpesaCode: orderData.customerInfo.mpesaCode
    });

    if (emailSent) {
      res.status(200).json({ message: 'Receipt sent successfully' });
    } else {
      res.status(500).json({ message: 'Failed to send receipt' });
    }
  } catch (error) {
    console.error('Error sending order receipt:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

function generateReceiptHTML(orderData: OrderData): string {
  const itemsHTML = orderData.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <div style="font-weight: 600; color: #374151;">${item.product.name}</div>
        ${item.selectedVariants && Object.keys(item.selectedVariants).length > 0 ? 
          `<div style="font-size: 12px; color: #6b7280; margin-top: 4px;">
            ${Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ')}
          </div>` : ''
        }
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">KSh ${item.product.price.toLocaleString()}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">KSh ${(item.product.price * item.quantity).toLocaleString()}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Receipt - YIPN</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 20px; background-color: #f9fafb; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background-color: #66371B; color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 30px; }
        .order-info { background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .order-info h2 { margin-top: 0; color: #374151; }
        .order-details { margin-bottom: 30px; }
        .order-details h3 { color: #374151; border-bottom: 2px solid #66371B; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background-color: #f9fafb; padding: 12px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb; }
        .total-row { background-color: #f9fafb; font-weight: 600; }
        .footer { background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; }
        .contact-info { margin-top: 15px; }
        .contact-info a { color: #66371B; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 YIPN Order Receipt</h1>
          <p>Thank you for your purchase!</p>
        </div>
        
        <div class="content">
          <div class="order-info">
            <h2>Order Information</h2>
            <p><strong>Order ID:</strong> ${orderData.orderId}</p>
            <p><strong>Order Date:</strong> ${new Date(orderData.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>M-Pesa Code:</strong> ${orderData.customerInfo.mpesaCode}</p>
          </div>
          
          <div class="order-details">
            <h3>Order Details</h3>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>
            
            <div style="text-align: right; font-size: 18px; font-weight: 600; color: #66371B;">
              Total: KSh ${orderData.total.toLocaleString()}
            </div>
          </div>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #66371B;">
            <h4 style="margin-top: 0; color: #374151;">What's Next?</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Your order will be processed within 24 hours</li>
              <li>You'll receive updates on your order status</li>
              <li>For any questions, contact our support team</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Yoga in the Park Nairobi™</strong></p>
          <div class="contact-info">
            <p>📧 <a href="mailto:yogaintheparknairobi@gmail.com">yogaintheparknairobi@gmail.com</a></p>
            <p>📱 <a href="tel:+254733334041">+254 733 334 041</a></p>
            <p>🌐 <a href="https://yogaintheparknairobi.com">yogaintheparknairobi.com</a></p>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
            © 2025 Yoga in the Park Nairobi™. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateReceiptText(orderData: OrderData): string {
  const itemsText = orderData.items.map(item => 
    `${item.product.name} x${item.quantity} - KSh ${(item.product.price * item.quantity).toLocaleString()}`
  ).join('\n');

  return `
YIPN Order Receipt
==================

Order ID: ${orderData.orderId}
Order Date: ${new Date(orderData.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
M-Pesa Code: ${orderData.customerInfo.mpesaCode}

Order Details:
${itemsText}

Total: KSh ${orderData.total.toLocaleString()}

What's Next:
- Your order will be processed within 24 hours
- You'll receive updates on your order status
- For any questions, contact our support team

Contact Information:
Email: yogaintheparknairobi@gmail.com
Phone: +254 733 334 041
Website: yogaintheparknairobi.com

© 2025 Yoga in the Park Nairobi™. All rights reserved.
  `;
}
