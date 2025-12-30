# Atorix IT Solutions Website

This repository contains the code for the Atorix IT Solutions website, including both frontend and backend components.

## Project Structure

The project is split into two main directories:

- `frontend`: A Next.js-based frontend application
- `backend`: An Express-based backend API for form handling and data storage

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   SENDGRID_API_KEY=your_sendgrid_api_key
   NOTIFICATION_EMAIL=email_to_receive_notifications
   SENDER_EMAIL=email_address_for_sending_notifications
   PORT=5001
   ```

4. Start the backend server:
   ```
   npm start
   ```

   The backend server will run on http://localhost:5001

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the frontend directory with the following variables:
   ```
   NEXT_PUBLIC_API_URL=https://atorix-backend-server.onrender.com
   ```

4. Start the frontend development server:
   ```
   npm run dev
   ```

   The frontend will be available at http://localhost:3000

## Form Handling

The website includes multiple forms for user interaction:

- Contact Form: Located on the Contact page
- Demo Request Form: Located on the Get Demo page
- Quick Contact Form: Located in the CTA sections throughout the site

All forms submit data to the backend API, which processes the submissions and stores them in the MongoDB database. Form validation is implemented on both the frontend and backend to ensure data integrity.

## Troubleshooting

If you encounter issues with form submission, check the following:

1. Ensure both frontend and backend servers are running
2. Verify MongoDB connection is working
3. Check the browser console and server logs for error messages
4. Ensure all required form fields are filled in

For CORS issues, make sure the frontend URL is included in the `allowedOrigins` array in the backend's `server.js` file.

## Production Deployment

For production deployment:

1. Set up a MongoDB Atlas database
2. Deploy the backend to a hosting service like Render or Heroku
3. Deploy the frontend to Vercel or Netlify
4. Configure environment variables on your hosting providers

Make sure to update the `NEXT_PUBLIC_API_URL` in your frontend environment to point to your deployed backend URL.
