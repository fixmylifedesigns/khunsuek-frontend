// lib/stripe.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export async function getPaymentDetails(sessionId) {
  try {
    if (!sessionId) {
      throw new Error("Session ID is missing");
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "payment_intent"],
    });

    const paymentDetails = {
      orderId: session.payment_intent.id,
      amountPaid: (session.amount_total / 100).toFixed(2),
      currency: session.currency.toUpperCase(),
      customerName: session.customer_details.name,
      customerEmail: session.customer_details.email,
      paymentStatus: session.payment_status,
      items: session.line_items.data.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        amount: (item.amount_total / 100).toFixed(2),
      })),
    };

    return paymentDetails;
  } catch (error) {
    console.error("Error retrieving session details:", error);
    throw error;
  }
}
