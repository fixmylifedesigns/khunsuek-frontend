// app/success/page.js
import { Suspense } from "react";
import Link from "next/link";
import PaymentDetails from "./PaymentDetails";

export default function SuccessPage({ searchParams }) {
  const { session_id } = searchParams;

  return (
    <div
      id="success-page-container"
      className="max-w-3xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md"
    >
      <div className="text-center mb-8">
        <h1
          id="success-title"
          className="text-4xl font-bold text-green-600 mb-2"
        >
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-600">
          Thank you for your purchase. Your order has been processed
          successfully.
        </p>
      </div>

      {session_id ? (
        <Suspense
          fallback={
            <div id="loading-message" className="text-center text-gray-600">
              Loading payment details...
            </div>
          }
        >
          <PaymentDetails sessionId={session_id} />
        </Suspense>
      ) : (
        <div
          id="error-message"
          className="text-red-600 bg-red-100 border border-red-400 rounded p-4 mb-6"
        >
          <p className="font-semibold">Error: No session ID provided.</p>
          <p>
            Please contact customer support if you believe this is an error.
          </p>
        </div>
      )}

      <div
        id="next-steps-container"
        className="bg-white shadow-md rounded-lg p-6 mb-6"
      >
        <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Check your email for a detailed receipt and confirmation.</li>
          <li>Save your order number for future reference.</li>
          <li>
            If you booked a hotel, please bring your confirmation details with
            you.
          </li>
          <li>Prepare for an amazing experience at our gym in Thailand!</li>
        </ul>
      </div>

      <div id="contact-info" className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
        <p>
          If you have any questions or concerns, please don&apos;t hesitate to
          contact us:
        </p>
        <p className="mt-2">
          Email:{" "}
          <a
            href="mailto:support@thaigymbooking.com"
            className="text-blue-600 hover:underline"
          >
            support@thaigymbooking.com
          </a>
        </p>
        <p>Phone: +66 12 345 6789</p>
      </div>

      <div className="text-center">
        <Link
          href="/"
          id="return-home-link"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
