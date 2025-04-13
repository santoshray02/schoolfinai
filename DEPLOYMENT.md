# Deployment Guide for School Finance Management System

This document provides instructions for deploying the School Finance Management System to various environments.

## Prerequisites

Before deploying, ensure you have:

1. Node.js (v18 or higher) installed
2. Access to a PostgreSQL database
3. Twilio account (for SMS functionality)
4. Git installed

## Deployment Options

### 1. Vercel (Recommended)

Vercel is the easiest platform for deploying Next.js applications.

#### Steps:

1. **Push your code to GitHub, GitLab, or Bitbucket**

2. **Connect to Vercel**
   - Create an account on [Vercel](https://vercel.com)
   - Click "New Project" and import your repository
   - Configure the project:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: `npm run build`
     - Output Directory: .next

3. **Configure Environment Variables**
   - Add all variables from your `.env.local` file to Vercel's environment variables
   - Make sure to add:
     - `DATABASE_URL`
     - `NEXTAUTH_URL` (set to your production URL)
     - `NEXTAUTH_SECRET`
     - Twilio credentials if using SMS functionality

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application

5. **Set up Database**
   - Run migrations on your production database:
     ```
     npx prisma migrate deploy
     ```

### 2. Self-Hosted Server

#### Steps:

1. **Prepare the Server**
   - Set up a server with Node.js installed
   - Install PM2 for process management: `npm install -g pm2`

2. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/school-finance-system.git
   cd school-finance-system
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Set Environment Variables**
   - Create a `.env` file with all required variables
   - Make sure `NEXTAUTH_URL` points to your production URL

5. **Build the Application**
   ```bash
   npm run build
   ```

6. **Run Database Migrations**
   ```bash
   npx prisma migrate deploy
   ```

7. **Start the Application with PM2**
   ```bash
   pm2 start npm --name "school-finance" -- start
   ```

8. **Set Up Reverse Proxy (Nginx Example)**
   ```nginx
   server {
     listen 80;
     server_name your-domain.com;

     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

9. **Set Up SSL with Let's Encrypt**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

### 3. Docker Deployment

#### Steps:

1. **Create a Dockerfile**
   - A Dockerfile is already included in the project

2. **Build the Docker Image**
   ```bash
   docker build -t school-finance-system .
   ```

3. **Run the Container**
   ```bash
   docker run -p 3000:3000 --env-file .env school-finance-system
   ```

4. **Docker Compose (Optional)**
   - Use the included docker-compose.yml file to set up both the app and database:
   ```bash
   docker-compose up -d
   ```

## Continuous Deployment

### GitHub Actions

A GitHub Actions workflow file is included in the project at `.github/workflows/deploy.yml`. This will automatically deploy your application to Vercel when changes are pushed to the main branch.

### Manual Updates

To update a deployed application:

1. Pull the latest changes:
   ```bash
   git pull origin main
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the application:
   ```bash
   npm run build
   ```

4. Run migrations if schema has changed:
   ```bash
   npx prisma migrate deploy
   ```

5. Restart the application:
   ```bash
   pm2 restart school-finance
   ```

## Database Backups

It's important to regularly back up your database:

```bash
# PostgreSQL backup
pg_dump -U username -d school_finance > backup_$(date +%Y%m%d).sql
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check that your `DATABASE_URL` is correct
   - Ensure the database server is running
   - Verify network connectivity and firewall settings

2. **Authentication Issues**
   - Verify `NEXTAUTH_SECRET` is set correctly
   - Check that `NEXTAUTH_URL` matches your actual deployment URL

3. **Build Failures**
   - Check for TypeScript errors
   - Ensure all dependencies are installed

4. **SMS Not Working**
   - Verify Twilio credentials are correct
   - Check Twilio account balance and status

## Monitoring

Consider setting up monitoring for your production deployment:

1. **Application Monitoring**
   - Use Vercel Analytics if deployed on Vercel
   - Consider New Relic, Datadog, or similar services

2. **Error Tracking**
   - Implement Sentry for error tracking

3. **Performance Monitoring**
   - Use Lighthouse for performance audits
   - Consider implementing Core Web Vitals monitoring

## Security Considerations

1. Always use HTTPS in production
2. Keep dependencies updated
3. Implement rate limiting for API endpoints
4. Use secure HTTP headers
5. Regularly audit user permissions
6. Keep database credentials secure
