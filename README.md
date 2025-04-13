# SchoolFinAI: AI-Powered School Finance Management System

An open-source, AI-powered web application for managing school finances, including student records, fee collection, staff salary tracking, expense management, and reporting. SchoolFinAI leverages generative AI to provide intelligent insights, automated reporting, and predictive analytics for educational institutions.

## Project Overview

The School Finance Management System is designed to help educational institutions efficiently manage their financial operations. The system provides a comprehensive set of features to track student fees, staff salaries, expenses, and generate financial reports.

## Features

- **Student Management**
  - Register and manage student records
  - Track student enrollment status
  - Manage student contact information
  - AI-powered enrollment trend analysis

- **Fee Management**
  - Create and manage fee categories
  - Generate fee invoices
  - Record and track fee payments
  - Generate payment receipts
  - AI-driven fee defaulter prediction

- **SMS Alert System**
  - Send payment reminders
  - Notify about due dates
  - Send receipt confirmations
  - Personalized AI-generated communication templates

- **Staff Salary Tracking**
  - Manage staff records
  - Track salary payments
  - Generate salary slips
  - Intelligent salary forecasting

- **Expense Tracking**
  - Record and categorize expenses
  - Upload and store receipts
  - Track expense approvals
  - AI-powered expense categorization and anomaly detection

- **Reports Dashboard**
  - Generate financial summaries with AI insights
  - View income vs. expenses with predictive analytics
  - Track fee collection status
  - Generate natural language custom reports

- **AI Assistant**
  - Natural language query interface for financial data
  - Intelligent financial forecasting
  - Chatbot for parent and staff inquiries
  - Automated financial insights

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **SMS Integration**: Twilio API
- **Charts**: Recharts
- **Form Validation**: React Hook Form with Zod
- **AI Integration**: OpenAI API (GPT-4)
- **Natural Language Processing**: LangChain
- **Vector Database**: Pinecone (for semantic search)
- **Data Visualization**: D3.js (for advanced AI-driven visualizations)

## Project Structure

```
schoolfinai/
├── prisma/                  # Database schema and migrations
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/             # API routes
│   │   │   ├── ai/          # AI-related API endpoints
│   │   │   │   ├── forecast/    # Financial forecasting API
│   │   │   │   ├── reports/     # AI report generation
│   │   │   │   ├── query/       # Natural language queries
│   │   │   │   └── chatbot/     # AI chatbot interface
│   │   ├── auth/            # Authentication pages
│   │   ├── dashboard/       # Dashboard and admin pages
│   │   ├── students/        # Student management
│   │   ├── fees/            # Fee management
│   │   ├── staff/           # Staff management
│   │   ├── expenses/        # Expense tracking
│   │   ├── reports/         # Reports and analytics
│   │   ├── settings/        # System settings
│   │   └── page.tsx         # Landing page
│   ├── components/          # Reusable UI components
│   │   ├── ai/              # AI-specific components
│   │   │   ├── QueryInterface.tsx    # Natural language query UI
│   │   │   ├── ChatbotWidget.tsx     # Chatbot interface
│   │   │   ├── PredictionChart.tsx   # AI prediction visualizations
│   │   │   └── SmartReportViewer.tsx # AI-enhanced report viewer
│   ├── lib/                 # Utility functions and shared logic
│   │   ├── ai/              # AI service layer
│   │   │   ├── financial-forecasting.ts # Financial predictions
│   │   │   ├── report-generator.ts      # AI report generation
│   │   │   ├── fee-prediction.ts        # Fee defaulter prediction
│   │   │   ├── communication-generator.ts # Smart messaging
│   │   │   ├── database-query.ts        # Natural language DB queries
│   │   │   ├── expense-analyzer.ts      # Expense categorization
│   │   │   ├── enrollment-analysis.ts   # Student enrollment analysis
│   │   │   └── index.ts                 # AI module exports
│   │   ├── auth.ts          # Authentication utilities
│   │   ├── db.ts            # Database client
│   │   └── sms.ts           # SMS integration
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Helper functions
├── .env.example             # Example environment variables
├── package.json             # Project dependencies
└── README.md                # Project documentation
```

## Development Plan

### Phase 1: Project Setup and Core Infrastructure
- Set up Next.js project with TypeScript
- Configure Prisma ORM with PostgreSQL
- Implement authentication system
- Create basic UI components and layouts

### Phase 2: Student and Fee Management
- Implement student registration and management
- Create fee categories and payment tracking
- Develop invoice generation
- Implement payment receipt system

### Phase 3: Staff and Expense Management
- Build staff management module
- Implement salary tracking system
- Create expense categories and tracking
- Develop receipt upload functionality

### Phase 4: Reporting and SMS Integration
- Build financial reporting dashboard
- Implement data visualization with charts
- Integrate SMS notification system
- Create automated reminders

### Phase 5: Testing, Documentation, and Deployment
- Conduct thorough testing
- Write comprehensive documentation
- Prepare deployment scripts
- Set up CI/CD pipeline

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Twilio account (for SMS functionality)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/school-finance-system.git
cd school-finance-system
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your database and Twilio credentials
```

4. Run database migrations
```bash
npx prisma migrate dev
```

5. Start the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

## Deployment Options

### Vercel (Recommended)
The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new).

### Self-hosted
You can also deploy the application on your own server:

1. Build the application
```bash
npm run build
```

2. Start the production server
```bash
npm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [NextAuth.js](https://next-auth.js.org)
- [Twilio](https://twilio.com)
- [Recharts](https://recharts.org)
