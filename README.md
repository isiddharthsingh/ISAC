# KimberHealth - Connecting Care Through Community

A comprehensive Next.js application that connects people in need with healthcare volunteers for free consultations, educational webinars, and community support.

## 🌟 Features

### 🏠 Landing Page
- **Hero Section**: Compelling introduction with clear value proposition
- **Features Overview**: How KimberHealth works in simple steps
- **Statistics**: Impact metrics and trust indicators
- **Testimonials Preview**: Real stories from community members
- **Trust & Security**: HIPAA compliance and verification information
- **Call-to-Action**: Easy paths to get started

### 👩‍⚕️ Volunteer Booking System
- **Browse Volunteers**: Filter by specialty, language, and availability
- **Detailed Profiles**: Volunteer credentials, experience, and ratings
- **Booking Modal**: Complete booking form with date/time selection
- **Specialties**: Family Medicine, Mental Health, Pediatrics, Cardiology, Women's Health, Dermatology
- **Rating System**: Community-driven volunteer ratings and reviews

### 📚 Educational Webinars
- **Upcoming Webinars**: Browse and register for future sessions
- **Live Webinars**: Join ongoing sessions with live indicators
- **Past Webinars**: Access recordings and ratings
- **Registration System**: Easy signup with agenda preview
- **Multi-tab Interface**: Organized by status (upcoming/live/past)

### 💬 Testimonials & Stories
- **Patient Stories**: Real experiences categorized by medical specialty
- **Volunteer Experiences**: Healthcare professional perspectives
- **Webinar Feedback**: Community reviews of educational content
- **Filtering**: Browse by category and experience type
- **Interactive Elements**: Helpful votes and rating displays

### 🎨 Design & UX
- **Modern UI**: Built with shadcn/ui components
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG guidelines compliance
- **Smooth Animations**: Hover effects and transitions
- **Professional Aesthetic**: Healthcare-appropriate color scheme

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **State Management**: React useState hooks

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kimber-health
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
kimber-health/
├── src/
│   ├── app/                     # Next.js app router pages
│   │   ├── layout.tsx          # Root layout with navigation
│   │   ├── page.tsx            # Landing page
│   │   ├── volunteers/         # Volunteer booking page
│   │   ├── webinars/           # Educational webinars page
│   │   └── testimonials/       # Community stories page
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   └── navigation.tsx      # Main navigation component
│   └── lib/
│       └── utils.ts            # Utility functions
├── public/                     # Static assets
├── components.json             # shadcn/ui configuration
└── tailwind.config.js          # Tailwind CSS configuration
```

## 🎨 UI Components Used

- **Button**: Primary and secondary actions
- **Card**: Content containers with headers and descriptions
- **Dialog**: Modal windows for forms and detailed views
- **Badge**: Labels and categories
- **Avatar**: User profile images
- **Tabs**: Organized content sections
- **Input/Textarea**: Form controls
- **Select**: Dropdown selections
- **Calendar**: Date picking functionality

## 🔧 Customization

### Adding New Specialties
1. Update the volunteers data array in `/src/app/volunteers/page.tsx`
2. Add the new specialty to the filter options
3. Update testimonials categories if needed

### Styling Changes
- Modify `tailwind.config.js` for theme changes
- Update component styles in individual page files
- Customize shadcn/ui theme in `src/app/globals.css`

### Adding New Pages
1. Create new directory in `src/app/`
2. Add `page.tsx` file with your component
3. Update navigation in `src/components/navigation.tsx`

## 🌐 Deployment

### Vercel (Recommended)
1. Push to GitHub repository
2. Import project in Vercel dashboard
3. Deploy with default settings

### Other Platforms
- **Netlify**: Compatible with static export
- **Docker**: Dockerfile can be added for containerization
- **Traditional hosting**: Build and serve the `out/` directory

## 🔒 Security Features

- **Input Validation**: All forms include proper validation
- **Type Safety**: Full TypeScript implementation
- **Sanitized Data**: No direct HTML rendering of user input
- **Secure Headers**: Next.js default security headers

## 📋 Future Enhancements

- **Backend Integration**: Connect to real database and API
- **Authentication**: User accounts and profiles
- **Payment Processing**: Optional donation system
- **Video Calling**: Integrated consultation platform
- **Mobile App**: React Native companion app
- **Advanced Filtering**: More granular search options
- **Notification System**: Email and SMS reminders
- **Multi-language Support**: Internationalization

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
- Contact the development team
- Check the documentation wiki

## 🎯 Mission

KimberHealth believes that quality healthcare guidance should be accessible to everyone, regardless of their financial situation. Our platform connects caring healthcare professionals with people in need, fostering a community of support, education, and healing.

---

