// Using Twilio WhatsApp API
// Sign up at https://www.twilio.com → Messaging → Try WhatsApp
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send new order notification to your WhatsApp
 * @param {Object} order - Full order object
 */
// const sendOrderNotification = async (order) => {
//   try {
//     // Format the order items
//     const itemsList = order.items.map(item => {
//       const variantText = item.variant?.name ? ` (${item.variant.name})` : '';
//       const addOnsText = item.addOns?.length 
//         ? `\n    + ${item.addOns.map(a => a.name).join(', ')}` 
//         : '';
//       return `• ${item.name}${variantText} x${item.quantity} = ₹${item.itemTotal}${addOnsText}`;
//     }).join('\n');

//     const message = `
// 🆕 *NEW ORDER RECEIVED!*
// ━━━━━━━━━━━━━━━━━━
// 📋 *Order #${order.orderNumber}*

// 👤 *Customer:* ${order.customerName}
// 📱 *Phone:* ${order.customerPhone}

// 📍 *Delivery Address:*
// ${order.deliveryAddress.fullAddress}
// ${order.deliveryAddress.landmark ? `Landmark: ${order.deliveryAddress.landmark}` : ''}
// ${order.deliveryAddress.pincode ? `Pincode: ${order.deliveryAddress.pincode}` : ''}

// 🛒 *Items Ordered:*
// ${itemsList}

// ━━━━━━━━━━━━━━━━━━
// 💰 Subtotal: ₹${order.subtotal}
// 🚚 Delivery: ₹${order.deliveryCharge}
// 💵 *TOTAL: ₹${order.totalAmount}*
// ━━━━━━━━━━━━━━━━━━
// 📝 Notes: ${order.notes || 'None'}
// 💳 Payment: Screenshot shared below
//     `.trim();

//     // Send text message
//     await client.messages.create({
//       from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,  // e.g., whatsapp:+14155238886
//       to: `whatsapp:${process.env.OWNER_WHATSAPP}`,           // your number e.g., whatsapp:+919876543210
//       body: message,
//     });

//     // Send payment screenshot as media message
//     if (order.paymentScreenshot) {
//       await client.messages.create({
//         from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
//         to: `whatsapp:${process.env.OWNER_WHATSAPP}`,
//         body: `💳 Payment screenshot for Order #${order.orderNumber}`,
//         mediaUrl: [order.paymentScreenshot],
//       });
//     }

//     console.log('WhatsApp notification sent!');
//     return true;
//   } catch (error) {
//     console.error('WhatsApp Error:', error.message);
//     return false;
//   }
// };


const sendOrderNotification = async (order) => {
  try {
    const itemsList = order.items.map(item => {
      const variantText = item.variant?.name ? ` (${item.variant.name})` : '';
      const addOnsText = item.addOns?.length
        ? `\n    + ${item.addOns.map(a => a.name).join(', ')}`
        : '';
      return `• ${item.name}${variantText} x${item.quantity} = ₹${item.itemTotal}${addOnsText}`;
    }).join('\n');

    // ✅ Different payment line based on method
    const paymentLine = order.paymentMethod === 'cod'
      ? '💵 Payment: *CASH ON DELIVERY* 🏠'
      : '💳 Payment: Online (Screenshot shared below)';

    const message = `
🆕 *NEW ORDER RECEIVED!*
━━━━━━━━━━━━━━━━━━
📋 *Order #${order.orderNumber}*

👤 *Customer:* ${order.customerName}
📱 *Phone:* ${order.customerPhone}

📍 *Delivery Address:*
${order.deliveryAddress.fullAddress}
${order.deliveryAddress.landmark ? `Landmark: ${order.deliveryAddress.landmark}` : ''}
${order.deliveryAddress.pincode ? `Pincode: ${order.deliveryAddress.pincode}` : ''}

🛒 *Items Ordered:*
${itemsList}

━━━━━━━━━━━━━━━━━━
💰 Subtotal: ₹${order.subtotal}
🚚 Delivery: ₹${order.deliveryCharge}
💵 *TOTAL: ₹${order.totalAmount}*
━━━━━━━━━━━━━━━━━━
📝 Notes: ${order.notes || 'None'}
${paymentLine}
    `.trim();

    await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
      to: `whatsapp:${process.env.OWNER_WHATSAPP}`,
      body: message,
    });

    // ✅ Only send screenshot message for online payments
    if (order.paymentMethod === 'online' && order.paymentScreenshot) {
      await client.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
        to: `whatsapp:${process.env.OWNER_WHATSAPP}`,
        body: `💳 Payment screenshot for Order #${order.orderNumber}`,
        mediaUrl: [order.paymentScreenshot],
      });
    }

    console.log('WhatsApp notification sent!');
    return true;
  } catch (error) {
    console.error('WhatsApp Error:', error.message);
    return false;
  }
};

module.exports = { sendOrderNotification };