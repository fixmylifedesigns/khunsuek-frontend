import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in the environment variables");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export async function POST(req) {
  try {
    const { items } = await req.json();

    // Check if all items have the same currency
    const currencies = new Set(items.map((item) => item.currency));
    if (currencies.size > 1) {
      throw new Error("All items must have the same currency");
    }

    const currency = items[0].currency;

    // Create line items from the cart items
    const lineItems = await Promise.all(
      items.map(async (item) => {
        const product = await stripe.products.retrieve(item.id);
        const price = await stripe.prices.list({
          product: item.id,
          active: true,
          currency: currency,
          limit: 1,
        });

        if (price.data.length === 0) {
          throw new Error(
            `No active price found for product ${item.id} in ${currency}`
          );
        }

        return {
          price: price.data[0].id,
          quantity: item.quantity,
        };
      })
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      currency: currency,
      success_url: `${req.headers.get(
        "origin"
      )}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/checkout`,
    });

    return new Response(JSON.stringify({ sessionId: session.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({
        error: "Error creating checkout session",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
