# Kairos - Student Productivity Platform

![Kairos Logo](public/images/DAYKAIROS.svg)

A comprehensive, modern web application for student productivity tools with a dynamic marketplace, responsive design, and waitlist system. Built with Next.js 14 and Tailwind CSS.

## 🚀 Live Demo

Visit [Kairos Platform](https://kairos-student.netlify.app) to see the live application.

## ✨ Features

### 📱 Modern UI/UX

- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Theme System**: Light/dark mode with system preference detection
- **Smooth Animations**: Powered by Framer Motion
- **Accessibility**: Built with a11y best practices

### 🛍️ Dynamic Marketplace

- **App Showcase**: Browse student productivity tools
- **Category Filtering**: Find apps by category
- **Theme-Aware Cards**: Dynamic styling based on app category
- **Varied Layouts**: Different card designs for visual interest

### 📝 Waitlist System

- **Simple Registration**: Collect user emails without complex authentication
- **Local Storage**: Data saved to JSON file (ready for future database integration)
- **Validation**: Client-side form validation
- **Confirmation UI**: Immediate feedback on submission

## 🛠️ Technology Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Deployment**: Netlify
- **State Management**: React Context API
- **Form Handling**: Native React forms with validation

## 📋 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/basilionelle/Kairos.git
cd Kairos

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3004](http://localhost:3004) with your browser to see the result.

## 📁 Project Structure

```bash
/
├── app/                # Next.js app directory
│   ├── api/            # API routes
│   │   └── waitlist/   # Waitlist registration endpoint
│   ├── marketplace/    # Marketplace page
│   ├── signin/         # Waitlist registration page
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page with hero section
├── components/         # Reusable components
│   ├── Header.tsx      # Navigation header
│   ├── Hero.tsx        # Landing page hero section
│   ├── ThemeProvider.tsx # Theme management system
│   └── ThemeToggle.tsx # Light/dark mode toggle
├── public/             # Static assets
│   └── images/         # SVG illustrations and logos
├── data/               # Local data storage
│   └── waitlist.json   # Waitlist entries
├── netlify.toml        # Netlify configuration
└── next.config.js      # Next.js configuration
```

## 🎨 Theme System

Kairos includes a custom theme system that supports:

- **Light and Dark Mode**: Complete UI adaptation
- **System Preference Detection**: Automatically matches OS settings
- **LocalStorage Persistence**: Remembers user preference
- **Smooth Transitions**: Elegant theme switching
- **Theme-Aware Components**: Cards and UI elements adapt to theme

## 📱 Responsive Design

The UI is optimized for all device sizes:

- **Mobile Devices** (< 640px): Stacked layouts, optimized navigation
- **Tablets** (640px - 1024px): Adaptive grid layouts
- **Desktops** (> 1024px): Multi-column layouts, enhanced visuals

## 📮 Waitlist System

The waitlist system replaces traditional authentication:

- **Simple Collection**: Gathers name and email
- **Local Storage**: Saves to `/data/waitlist.json`
- **Duplicate Prevention**: Checks for existing emails
- **Success Feedback**: Confirms submission to users
- **Future-Ready**: Designed for easy integration with email services

## 🌐 Deployment

This project is configured for seamless deployment on Netlify:

1. **GitHub Integration**: Push code to trigger automatic deployments
2. **Netlify Configuration**: Pre-configured with `netlify.toml`
3. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. **GitHub Actions**: Automated deployment workflow included

### Deployment Troubleshooting

If you encounter Prisma Client initialization errors on Netlify:

- The project includes custom scripts to handle Prisma generation during build
- Dependency caching is disabled to prevent initialization errors
- See `netlify/plugins/prisma-fix` for the custom fix

## 🔍 Future Enhancements

- **Authentication System**: Replace waitlist with full authentication
- **Database Integration**: Connect to a proper database
- **Email Service**: Send confirmations to waitlist registrants
- **Analytics**: Track user engagement
- **User Profiles**: Allow personalization
- **App Submissions**: Let developers submit productivity tools

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Netlify](https://www.netlify.com/)

---

Developed with ❤️ for students
