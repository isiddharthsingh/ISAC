# ISAC - International Student Advocacy Committee

A comprehensive Next.js and Node.js application connecting international students with mentors, educational webinars, and community support through the International Student Advocacy Committee platform.

## 🌟 Features

### 🏠 Landing Page
- **Hero Section**: Compelling introduction with interactive globe visualization
- **Features Overview**: How ISAC supports international students
- **Statistics**: Impact metrics and community growth indicators
- **Call-to-Action**: Easy paths to join mentorship programs and webinars

### 👩‍🎓 Mentor Connection System
- **Browse Mentors**: Filter by specialty, language, university, and location
- **Detailed Profiles**: Mentor credentials, experience, and community ratings
- **Mentor Application**: Complete application system for aspiring mentors
- **Specialties**: International Student Support, Alumni Guidance, Academic Mentorship
- **Rating System**: Community-driven mentor ratings and reviews
- **Advanced Search**: Full-text search across mentor profiles

### 📚 Educational Webinars (Full Implementation)
- **Registration System**: Complete .edu email validation and registration
- **Email Confirmations**: Professional HTML emails with ISAC branding
- **Database Integration**: PostgreSQL backend with registration tracking
- **Multi-tab Interface**: Organized by status (upcoming/live/past)
- **Admin Dashboard**: View registrations and webinar statistics
- **SMTP Integration**: Automated email delivery via SMTP2GO

### 💬 Community Support
- **WhatsApp Groups**: University-specific group access with identity verification
- **Testimonials**: Real experiences from international students
- **About Section**: ISAC mission and team information

### 🎨 Design & UX
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Responsive Design**: Mobile-first approach across all devices
- **Interactive Elements**: 3D globe, smooth animations, and hover effects
- **Professional Aesthetic**: Academic-appropriate color scheme
- **Accessibility**: WCAG guidelines compliance

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **3D Graphics**: Three.js for interactive globe
- **State Management**: React hooks with local storage integration

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with connection pooling
- **Email Service**: Nodemailer with SMTP2GO
- **Security**: Helmet, CORS, rate limiting
- **Validation**: Input sanitization and .edu email verification
- **Error Handling**: Comprehensive logging and error responses

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn
- SMTP2GO account (for email functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd isac-platform
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Set up environment variables**
   Create `backend/.env`:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=isac_db
   DB_USER=postgres
   DB_PASSWORD=your_password

   # SMTP Configuration (SMTP2GO)
   SMTP2GO_USERNAME=your_smtp_username
   SMTP2GO_PASSWORD=your_smtp_password
   SMTP2GO_FROM_EMAIL=noreply@yourdomain.com

   # Server Configuration
   PORT=5001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

5. **Set up the database**
   ```sql
   -- Create database and tables for mentors and webinars
   -- See backend/config/ for schema details
   ```

6. **Start the development servers**
   
   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   # Server runs on http://localhost:5001
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   npm run dev
   # App runs on http://localhost:3000
   ```

### Build for Production

**Frontend:**
```bash
npm run build
npm start
```

**Backend:**
```bash
cd backend
npm start
```

## 📁 Project Structure

```
isac-platform/
├── src/                        # Frontend source
│   ├── app/                    # Next.js app router pages
│   │   ├── layout.tsx         # Root layout with navigation
│   │   ├── page.tsx           # Landing page with globe
│   │   ├── volunteers/        # Mentor browsing page
│   │   ├── webinars/          # Educational webinars with registration
│   │   ├── testimonials/      # Community stories
│   │   ├── about/             # ISAC information
│   │   └── whatsapp-groups/   # University group access
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── navigation.tsx     # Main navigation
│   │   └── interactive-globe.tsx # 3D globe component
│   └── lib/
│       ├── utils.ts           # Utility functions
│       └── api.ts             # API client functions
├── backend/                    # Backend API
│   ├── config/
│   │   └── database.js        # PostgreSQL connection
│   ├── controllers/
│   │   ├── mentorController.js    # Mentor CRUD operations
│   │   └── webinarController.js   # Webinar registration logic
│   ├── routes/
│   │   ├── mentors.js         # Mentor API routes
│   │   └── webinars.js        # Webinar API routes
│   ├── utils/
│   │   ├── emailService.js    # SMTP2GO email integration
│   │   └── helpers.js         # Validation utilities
│   ├── middleware/
│   │   ├── errorHandler.js    # Error handling
│   │   └── rateLimiter.js     # Rate limiting
│   └── server.js              # Express server setup
├── public/                     # Static assets
│   ├── assets/
│   │   └── globe/             # Globe textures
│   └── isac_logo.png         # ISAC branding
└── components.json            # shadcn/ui configuration
```

## 🔌 API Endpoints

### Mentors
- `GET /api/mentors` - Get all mentors with filtering and pagination
- `GET /api/mentors/:id` - Get specific mentor details
- `GET /api/mentors/stats` - Get mentor statistics
- `GET /api/mentors/filter-options` - Get available filter options
- `POST /api/mentors/apply` - Submit mentor application

### Webinars
- `GET /api/webinars` - Get all webinars with filtering
- `GET /api/webinars/:id` - Get specific webinar details
- `POST /api/webinars/register` - Register for webinar (requires .edu email)
- `GET /api/webinars/:id/registrations` - Admin view of registrations
- `GET /api/webinars/stats` - Registration statistics

## ✉️ Email System

The platform includes a complete email system for webinar registrations:

- **SMTP2GO Integration**: Professional email delivery service
- **HTML Templates**: Responsive email design with ISAC branding
- **Email Validation**: Strict .edu domain verification
- **Confirmation Emails**: Automated registration confirmations
- **Error Handling**: Comprehensive email delivery monitoring

## 🔒 Security Features

- **Input Validation**: All forms include proper validation and sanitization
- **Rate Limiting**: API abuse prevention (100 requests/15 minutes)
- **CORS Protection**: Configured for specific frontend domain
- **Email Domain Validation**: Only .edu emails accepted for webinar registration
- **Error Handling**: Sensitive information protection in production
- **Type Safety**: Full TypeScript implementation

## 🗃️ Database Schema

### Mentors Table
- Complete mentor profiles with specialties, universities, and ratings
- Support for multiple languages and social media links
- Application tracking and approval workflow

### Webinars Table
- Comprehensive webinar management with scheduling
- Presenter information and capacity management
- Registration tracking and attendance monitoring

### Webinar Registrations Table
- User registration details with education background
- Email delivery status and registration timestamps
- Duplicate prevention and capacity enforcement

## 🌐 Deployment

### Frontend (Vercel Recommended)
1. Push to GitHub repository
2. Import project in Vercel dashboard
3. Set environment variables
4. Deploy with automatic builds

### Backend Options
- **Railway**: Simple PostgreSQL + Node.js deployment
- **Heroku**: Add-on PostgreSQL support
- **AWS/DigitalOcean**: Full control with Docker containers
- **Render**: Database + web service combo

### Database
- **Railway**: Managed PostgreSQL
- **Heroku Postgres**: Add-on service
- **AWS RDS**: Production-grade PostgreSQL
- **Supabase**: PostgreSQL with additional features

## 📋 Future Enhancements

- **Authentication System**: User accounts and dashboard
- **Video Integration**: Direct webinar hosting
- **Mobile App**: React Native companion
- **Advanced Analytics**: Registration and engagement metrics
- **Internationalization**: Multi-language support
- **Notification System**: SMS and push notifications
- **Payment Integration**: Premium webinar access
- **AI Matching**: Smart mentor-student pairing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the ISAC development team
- Check the API documentation

## 🎯 Mission

The International Student Advocacy Committee (ISAC) believes that every international student deserves access to guidance, community, and educational resources. Our platform connects students with experienced mentors and provides valuable educational content to help navigate the complexities of studying abroad.

---

**Built with ❤️ by the ISAC Development Team**

