// app/success/PaymentDetails.js
import { getPaymentDetails } from "@/lib/stripe";

export default async function PaymentDetails({ sessionId }) {
  try {
    const paymentDetails = await getPaymentDetails(sessionId);

    return (
      <div
        id="payment-details-container"
        className="bg-white shadow-md rounded-lg p-6 mb-6"
      >
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="font-semibold">Order ID:</p>
            <p>{paymentDetails.orderId}</p>
          </div>
          <div>
            <p className="font-semibold">Payment Status:</p>
            <p className="capitalize">{paymentDetails.paymentStatus}</p>
          </div>
          <div>
            <p className="font-semibold">Customer Name:</p>
            <p>{paymentDetails.customerName}</p>
          </div>
          <div>
            <p className="font-semibold">Customer Email:</p>
            <p>{paymentDetails.customerEmail}</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-2">Items Purchased</h3>
        <ul className="list-none p-0">
          {paymentDetails.items.map((item, index) => (
            <li key={index} className="border-b last:border-b-0 py-2">
              <div className="flex justify-between items-center">
                <span>
                  {item.description} (x{item.quantity})
                </span>
                <span>
                  {paymentDetails.currency} {item.amount}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 text-right">
          <p className="text-xl font-semibold">
            Total Amount Paid: {paymentDetails.currency}{" "}
            {paymentDetails.amountPaid}
          </p>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in PaymentDetails component:", error);
    return (
      <div
        id="error-message"
        className="text-red-600 bg-red-100 border border-red-400 rounded p-4"
      >
        <p className="font-semibold">Error: Unable to fetch payment details.</p>
        <p>Details: {error.message}</p>
        <p>Please contact customer support with the following information:</p>
        <p>Session ID: {sessionId}</p>
        <p>Time: {new Date().toISOString()}</p>
      </div>
    );
  }
}
