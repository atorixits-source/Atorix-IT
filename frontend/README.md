# Atorix IT Website

This is the website for Atorix IT, built with Next.js for the frontend and Express/MongoDB for the backend.

## Project Structure

- `src/` - Frontend Next.js application
- `backend/` - Backend Express API server

## Frontend Setup

1. **Install Dependencies**

```bash
npm install
# or
bun install
```

2. **Environment Variables**

Create a `.env.local` file in the root directory using the `.env.example` as a template:

```bash
cp .env.example .env.local
```

Edit the `.env.local` file to set the backend API URL:

```
NEXT_PUBLIC_API_URL=http://localhost:5001  # Or your production API URL
```

3. **Start Development Server**

```bash
npm run dev
# or
bun dev
```

Visit `http://localhost:3000` to view the application.

## Backend Setup

The backend is in the `backend/` directory. See the [backend README](./backend/README.md) for detailed setup instructions.

1. **Quick Setup**

```bash
cd backend
npm install
cp .env.example .env  # Then edit .env with your credentials
npm run dev
```

The backend server will run on `http://localhost:5001` by default.

## Forms Integration

This project includes several forms connected to the backend API:

1. **Contact Form** - Located on the Contact page
2. **Demo Request Form** - Located on the Get Demo page
3. **Quick Contact Form** - Located in the CTA section on the homepage

All forms submit data to the backend, which stores the information in MongoDB and sends email notifications.

## Deployment

### Frontend

The frontend is a Next.js application that can be deployed to Vercel, Netlify, or any platform supporting Next.js.

### Backend

The backend is a standard Express application that can be deployed to platforms like:

- Heroku
- Digital Ocean
- AWS
- Railway

Remember to set up environment variables on your deployment platform.

## License

All rights reserved.
