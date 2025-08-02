# Health Tracker Application

A comprehensive health tracking application that helps users manage their healthcare journey, including appointments, medications, vitals, and more.

## Features

- **Dashboard**: Overview of health metrics, upcoming appointments, and reminders
- **Appointment Management**: Schedule, track, and receive reminders for healthcare appointments
- **Medication Tracker**: Manage medications and dosage schedules
- **Health Records**: Store and access medical history and documents
- **Notifications**: Receive reminders for appointments and medications

## Appointment Reminder System

The application includes a robust appointment reminder system:

### How It Works

1. **Creating Appointments**: 
   - When scheduling an appointment, users can toggle "Set Reminder" option
   - This creates an appointment with the `setReminder` flag enabled

2. **Backend Processing**:
   - A daily scheduled job runs at 8:00 AM (`schedule-reminders.js`)
   - This job executes the appointment checker (`check-appointments.js`)
   - The checker finds all appointments scheduled for the next day with reminders enabled
   - For each qualifying appointment, a notification is sent to the user

3. **Frontend Display**:
   - The dashboard shows upcoming reminders in the `UpcomingReminders` component
   - This includes appointments with reminders enabled for the next 7 days

### Technical Implementation

- **Data Model**: 
  - MongoDB schema for appointments includes a `setReminder` boolean field
  - User model includes notification preferences

- **Scheduled Job**:
  - Uses `node-cron` to schedule the daily reminder check
  - Run with `npm run reminders` to start the scheduler

- **Notification System**:
  - Currently outputs notification details to console for demonstration
  - Designed to be extended with email delivery via Nodemailer
  - Support for multiple notification channels (email, push, SMS)

## Getting Started

### Environment Setup

1. **Copy environment variables:**
   ```bash
   # For Linux/Mac
   ./setup-env.sh
   
   # For Windows PowerShell
   .\setup-env.ps1
   
   # Or manually
   cp .env.example .env
   ```

2. **Configure environment variables in `.env`:**
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT tokens
   - `NEXT_PUBLIC_GEMINI_API_KEY`: Your Google Gemini API key
   - `EMAIL_USER`: Email address for sending reminders (optional)
   - `EMAIL_PASS`: Email password or app-specific password (optional)

3. **Install dependencies:**
   ```bash
   # Frontend dependencies
   npm install
   
   # Backend dependencies  
   cd backend && npm install
   ```

4. **Start the development servers:**
   ```bash
   # Start the frontend (Next.js)
   npm run dev
   
   # In another terminal, start the backend
   cd backend && node server.js
   
   # Optionally, start the reminder scheduler
   npm run reminders
   ```

### Important Security Notes

- Never commit your `.env` file to version control
- Use strong, unique values for `JWT_SECRET`
- Keep your API keys secure and rotate them regularly
- For production, use environment variables provided by your hosting service

## Technical Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT-based authentication
- **Scheduling**: node-cron 

## Folder Structure

```
project-root/
├── .next/                  # Next.js build output
├── app/                    # Next.js app directory (routes)
│   ├── dashboard/          # Dashboard page
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── backend/                # Backend code
│   ├── models/             # MongoDB schema models
│   ├── routes/             # API routes
│   │   ├── appointments.js # Appointment endpoints
│   │   ├── auth.js         # Authentication endpoints
│   │   ├── conditions.js   # Health conditions endpoints
│   │   ├── healthRecords.js# Health records endpoints
│   │   └── medications.js  # Medication endpoints
│   ├── uploads/            # File uploads storage
│   ├── check-appointments.js # Appointment checker
│   ├── check-db.js         # Database checker
│   ├── schedule-reminders.js # Reminder scheduler
│   └── server.js           # Express server setup
├── components/             # UI components
│   ├── appointments/       # Appointment-related components
│   ├── auth/               # Authentication components
│   ├── dashboard/          # Dashboard components
│   ├── health-records/     # Health records components
│   ├── insights/           # Health insights components
│   ├── medications/        # Medication components
│   ├── profile/            # User profile components
│   ├── settings/           # Settings components
│   ├── shared/             # Shared components
│   ├── ui/                 # UI component library
│   ├── landing-page.tsx    # Landing page component
│   └── theme-provider.tsx  # Theme provider
├── context/                # React context providers
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── public/                 # Static files
├── styles/                 # Additional styles
├── next.config.mjs         # Next.js configuration
├── package.json            # Dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration 