


const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderEmail = async (order) => {
  try {
    const itemsList = order.items.map(item => {
      const variantText = item.variant?.name ? ` (${item.variant.name})` : '';
      const addOnsText = item.addOns?.length
        ? `<br>&nbsp;&nbsp;&nbsp;&nbsp;+ ${item.addOns.map(a => a.name).join(', ')}`
        : '';
      return `• ${item.name}${variantText} × ${item.quantity} = ₹${item.itemTotal}${addOnsText}`;
    }).join('<br>');

    const paymentLine = order.paymentMethod === 'cod'
      ? '💵 Payment: <b>CASH ON DELIVERY</b> 🏠'
      : '💳 Payment: Online (Screenshot attached below)';

    const html = `
      <div style="font-family: monospace; font-size: 14px; max-width: 500px; margin: auto; background: #f9f9f9; padding: 20px; border-radius: 12px; border: 1px solid #ddd;">

        <h2 style="text-align:center; color:#7C3AED;">🆕 NEW ORDER RECEIVED!</h2>
        <hr style="border-color:#ddd"/>

        <p>📋 <b>Order #${order.orderNumber}</b></p>

        <p>👤 <b>Customer:</b> ${order.customerName}<br>
        📱 <b>Phone:</b> ${order.customerPhone}</p>

        <p>📍 <b>Delivery Address:</b><br>
        ${order.deliveryAddress.fullAddress}<br>
        ${order.deliveryAddress.landmark ? `Landmark: ${order.deliveryAddress.landmark}<br>` : ''}
        ${order.deliveryAddress.pincode ? `Pincode: ${order.deliveryAddress.pincode}` : ''}</p>

        <hr style="border-color:#ddd"/>

        <p>🛒 <b>Items Ordered:</b><br>${itemsList}</p>

        <hr style="border-color:#ddd"/>

        <p>
          💰 Subtotal: ₹${order.subtotal}<br>
          🚚 Delivery: ₹${order.deliveryCharge}<br>
          💵 <b>TOTAL: ₹${order.totalAmount}</b>
        </p>

        <hr style="border-color:#ddd"/>

        <p>📝 <b>Notes:</b> ${order.notes || 'None'}</p>
        <p>${paymentLine}</p>

        ${order.paymentScreenshot
          ? `<hr style="border-color:#ddd"/>
             <p>💳 <b>Payment Screenshot:</b></p>
             <img src="${order.paymentScreenshot}" width="300" style="border-radius:8px; border:1px solid #ddd;"/>`
          : ''
        }

      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `🆕 New Order #${order.orderNumber} — ₹${order.totalAmount} ${order.paymentMethod === 'cod' ? '(COD)' : '(Online)'}`,
      html,
    });

    console.log('Order email sent!');
    return true;
  } catch (error) {
    console.error('Email Error:', error.message);
    return false;
  }
};

module.exports = { sendOrderEmail };