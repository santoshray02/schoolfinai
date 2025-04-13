<div align="center">

# 🏫 SchoolFinAI

### AI-Powered School Finance Management System

[![GitHub license](https://img.shields.io/github/license/santoshray02/schoolfinai)](https://github.com/santoshray02/schoolfinai/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/santoshray02/schoolfinai)](https://github.com/santoshray02/schoolfinai/issues)
[![GitHub stars](https://img.shields.io/github/stars/santoshray02/schoolfinai)](https://github.com/santoshray02/schoolfinai/stargazers)

</div>

## 📋 Overview

SchoolFinAI is an open-source, AI-powered platform that revolutionizes how educational institutions manage their finances. By combining traditional financial management with cutting-edge artificial intelligence, SchoolFinAI delivers:

- 🤖 **Intelligent Insights**: Predictive analytics for financial planning
- 📊 **Automated Reporting**: AI-generated financial summaries and trends
- 💰 **Smart Fee Management**: Defaulter prediction and personalized payment plans
- 📱 **Mobile Responsive**: Access from any device, anywhere
- 🔐 **Secure & Reliable**: Built with security best practices

## ✨ Key Features

<table>
  <tr>
    <td width="33%" align="center">
      <h3>👨‍🎓 Student Management</h3>
      <ul>
        <li>Register and manage student records</li>
        <li>Track enrollment status</li>
        <li>AI-powered enrollment trend analysis</li>
      </ul>
    </td>
    <td width="33%" align="center">
      <h3>💵 Fee Management</h3>
      <ul>
        <li>Create fee categories and invoices</li>
        <li>Track payments and receipts</li>
        <li>AI-driven fee defaulter prediction</li>
      </ul>
    </td>
    <td width="33%" align="center">
      <h3>📱 SMS Alerts</h3>
      <ul>
        <li>Payment reminders and confirmations</li>
        <li>Due date notifications</li>
        <li>AI-generated personalized messages</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="33%" align="center">
      <h3>👩‍💼 Staff Salary</h3>
      <ul>
        <li>Manage staff records</li>
        <li>Track salary payments</li>
        <li>Intelligent salary forecasting</li>
      </ul>
    </td>
    <td width="33%" align="center">
      <h3>📝 Expense Tracking</h3>
      <ul>
        <li>Categorize expenses</li>
        <li>Upload receipts</li>
        <li>AI-powered anomaly detection</li>
      </ul>
    </td>
    <td width="33%" align="center">
      <h3>📊 Reports</h3>
      <ul>
        <li>Financial summaries with AI insights</li>
        <li>Predictive analytics</li>
        <li>Natural language custom reports</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td colspan="3" align="center">
      <h3>🤖 AI Assistant</h3>
      <ul>
        <li>Natural language query interface for financial data</li>
        <li>Intelligent financial forecasting</li>
        <li>Chatbot for parent and staff inquiries</li>
      </ul>
    </td>
  </tr>
</table>

## 🛠️ Technology Stack

<div align="center">

| Category | Technologies |
|---------|-------------|
| **Frontend** | ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) |
| **Backend** | ![Next.js API](https://img.shields.io/badge/Next.js_API-000000?style=for-the-badge&logo=next.js&logoColor=white) |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white) |
| **Authentication** | ![NextAuth.js](https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=next.js&logoColor=white) |
| **AI & ML** | ![OpenAI](https://img.shields.io/badge/OpenAI_GPT--4-412991?style=for-the-badge&logo=openai&logoColor=white) ![LangChain](https://img.shields.io/badge/LangChain-3178C6?style=for-the-badge) ![Pinecone](https://img.shields.io/badge/Pinecone-4255FF?style=for-the-badge) |
| **Visualization** | ![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge) ![D3.js](https://img.shields.io/badge/D3.js-F9A03C?style=for-the-badge&logo=d3.js&logoColor=white) |
| **Integrations** | ![Twilio](https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=twilio&logoColor=white) |

</div>

## 📂 Project Structure

<details>
<summary>Click to expand the project structure</summary>

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
</details>

## 🚀 Development Roadmap

<div align="center">

| Phase | Focus | Status |
|-------|-------|--------|
| **1** | **Core Infrastructure** <br>Next.js setup, Prisma ORM, Authentication | ✅ |
| **2** | **Student & Fee Management** <br>Registration, fee tracking, invoices | 🔄 |
| **3** | **Staff & Expense Management** <br>Staff records, salary tracking, expenses | 📅 |
| **4** | **AI Integration & Reporting** <br>Dashboards, forecasting, natural language | 📅 |
| **5** | **Testing & Deployment** <br>Testing, documentation, CI/CD pipeline | 📅 |

</div>

**Legend**: ✅ Completed &nbsp;|&nbsp; 🔄 In Progress &nbsp;|&nbsp; 📅 Planned

## 🚦 Getting Started

### Prerequisites

<table>
  <tr>
    <td><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="40" height="40"/></td>
    <td>Node.js v18+</td>
  </tr>
  <tr>
    <td><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="40" height="40"/></td>
    <td>PostgreSQL database</td>
  </tr>
  <tr>
    <td><img src="https://www.vectorlogo.zone/logos/twilio/twilio-icon.svg" width="40" height="40"/></td>
    <td>Twilio account (for SMS)</td>
  </tr>
  <tr>
    <td><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openai/openai-original.svg" width="40" height="40"/></td>
    <td>OpenAI API key</td>
  </tr>
</table>

### Quick Start

```bash
# Clone the repository
git clone https://github.com/santoshray02/schoolfinai.git
cd schoolfinai

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Edit .env.local with your credentials

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application

## 🌐 Deployment

<table>
  <tr>
    <td width="50%">
      <h3>☁️ Vercel (Recommended)</h3>
      <p>One-click deployment with the Vercel platform:</p>
      <a href="https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fsantoshray02%2Fschoolfinai">
        <img src="https://vercel.com/button" alt="Deploy with Vercel" />
      </a>
    </td>
    <td width="50%">
      <h3>🖥️ Self-hosted</h3>
      <p>Deploy on your own server:</p>
      <pre>npm run build
npm start</pre>
      <p>Or use Docker:</p>
      <pre>docker-compose up -d</pre>
    </td>
  </tr>
</table>

## 👥 Contributing

<div align="center">

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/santoshray02/schoolfinai/pulls)

</div>

We welcome contributions from the community! Here's how you can help:

1. 🍴 **Fork** the repository
2. 🌿 Create a **feature branch**: `git checkout -b feature/amazing-feature`
3. 💾 **Commit** your changes: `git commit -m 'Add some amazing feature'`
4. 📤 **Push** to the branch: `git push origin feature/amazing-feature`
5. 🔄 Open a **Pull Request** [here](https://github.com/santoshray02/schoolfinai/pulls)

Check out our [Contributing Guide](CONTRIBUTING.md) for more details.

## 📄 License

<div align="center">

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

</div>

## 🙏 Acknowledgements

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com)

</div>
