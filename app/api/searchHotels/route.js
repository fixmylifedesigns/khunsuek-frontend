// app/api/searchHotels/route.js
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  const { checkIn, checkOut, adults } = await req.json();

  const options = {
    method: "GET",
    url: "https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotelsByCoordinates",
    params: {
      latitude: "8.039216", // Replace with the actual latitude of your gym
      longitude: "98.821836", // Replace with the actual longitude of your gym
      arrival_date: checkIn,
      departure_date: checkOut,
      adults_number: adults,
      room_qty: "1",
      radius: "10",
      units: "metric",
      page_number: "1",
      temperature_unit: "c",
      languagecode: "en-us",
      currency_code: "THB",
    },
    headers: {
      "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
      "X-RapidAPI-Host": "booking-com15.p.rapidapi.com",
    },
  };

  try {
    console.log("Sending request to Booking.com API:", options);
    const response = await axios.request(options);
    console.log("Received response from Booking.com API:", response.data);

    if (response.data.status === false) {
      return NextResponse.json(
        { status: false, message: response.data.message },
        { status: 400 }
      );
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(
      "API Error:",
      error.response ? error.response.data : error.message
    );
    return NextResponse.json(
      {
        status: false,
        message: "An error occurred while fetching hotels",
        error: error.response ? error.response.data : error.message,
      },
      { status: 500 }
    );
  }
}
