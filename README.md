# Kairos Project

A modern web application built with Next.js and Tailwind CSS.

## Project Structure

```
kairos/
├── app/                  # Next.js App Router
│   ├── globals.css       # Global styles with Tailwind directives
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Home page component
├── components/           # Reusable React components
│   └── Button.tsx        # Example button component with Tailwind styles
├── public/               # Static assets
├── styles/               # Additional style files (if needed)
├── next.config.js        # Next.js configuration

## Getting Started

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Not required for basic functionality
```

## Project Structure

```bash
/
├── app/                # Next.js app directory
│   ├── api/            # API routes
│   ├── marketplace/    # Marketplace page
│   ├── signin/         # Waitlist page
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # Reusable components
├── public/             # Static assets
│   └── images/         # Image files
└── styles/             # Global styles
```

## Theme System

Kairos includes a custom theme system that supports:

- Light and dark mode
- System preference detection
- Theme persistence with localStorage
- Smooth theme transitions

## Responsive Design

The UI is optimized for:

- Mobile devices (< 640px)
- Tablets (640px - 1024px)
- Desktops (> 1024px)

## Waitlist System

The waitlist system collects user information and stores it in a JSON file at `/data/waitlist.json`. In a production environment, you might want to connect this to a database or email service.

## Deployment

This project is configured for deployment on Netlify:

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
