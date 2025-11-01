# FreshHub

A modern learning platform designed specifically for freshmen students, providing access to course modules, educational resources, quizzes, exams, and video content. Built with SvelteKit and optimized for Telegram Web Apps.

## 🎯 Overview

FreshHub is a comprehensive educational platform that enables students to:

- Browse and access course materials
- View PDF modules and short notes
- Watch educational videos
- Take timed exams and quizzes
- Get personalized learning experiences through Telegram integration

## 🚀 Features

### Core Functionality

- **Course Management**: Browse and access multiple courses with organized modules
- **Resource Library**: Access PDFs, modules, and short notes per course
- **Video Learning**: Integrated YouTube video player for course content
- **Exam System**: Timed exams and quizzes with multiple-choice and fill-in-the-blank questions
- **PDF Viewer**: Built-in PDF viewer using PDF.js Express
- **Search**: Search functionality across courses and resources

### User Experience

- **Telegram Integration**: Seamless authentication and experience within Telegram Web App
- **Dark Mode**: Full dark mode support with system preference detection
- **Responsive Design**: Modern, mobile-first UI built with Tailwind CSS
- **Animations**: Smooth Lottie animations for enhanced UX
- **Theme Toggle**: Easy switching between light and dark themes

### Technical Features

- **Serverless Architecture**: All API routes are serverless functions (no separate backend deployment)
- **Real-time Authentication**: Telegram-based and credential-based authentication
- **State Management**: Efficient Svelte stores for global state
- **API Integration**: RESTful API via SvelteKit serverless endpoints
- **Database**: Supabase (PostgreSQL) for data persistence
- **AI Integration**: Google Gemini API for question extraction from PDFs
- **Security**: Input validation, rate limiting, and standardized error handling

## 🛠️ Tech Stack

### Frontend

- **Framework**: SvelteKit 2.x
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.x
- **PDF Viewer**: PDF.js Express 8.7.5
- **Video Player**: Svelte YouTube Lite
- **Animations**: Lottie Web
- **Icons**: Custom Lottie animations

### Serverless API (SvelteKit Endpoints)

- **Framework**: SvelteKit API Routes (serverless functions)
- **Runtime**: Node.js (via SvelteKit adapter)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Telegram Web App + Supabase Auth
- **Validation**: Zod schema validation
- **Rate Limiting**: In-memory rate limiting (configurable per endpoint)
- **AI**: Google Generative AI (Gemini)

### Development Tools

- **Build Tool**: Vite 7.x
- **Package Manager**: npm
- **Code Quality**: Prettier, Svelte Check
- **Deployment**: Vercel/Cloudflare (adapter-auto)

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js (v18 or higher)
- npm or yarn
- A Supabase account and project
- A Telegram Bot Token (for Telegram integration)
- Google Gemini API Key (for question extraction feature)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd FreshHub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# For serverless functions (private)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Telegram Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token

# Google Gemini API (Optional, for question extraction)
GEMINI_API_KEY=your_gemini_api_key

# Environment
NODE_ENV=development
```

### 5. Database Setup

Set up your Supabase database with the following tables:

- `courses` - Course information
- `resources` - PDFs, modules, and notes
- `videos` - Video resources
- `exams` - Exam metadata
- `exam_questions` - Questions for exams
- `users` - User accounts
- `feedback_messages` - User feedback

Refer to `implementation_guide_exam_quiz.txt` for detailed database schema.

## 🏃 Running the Application

### Development Mode

#### Start Frontend

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the port Vite assigns).

#### Start Backend

```bash
cd backend
npm run dev
```

The backend API will be available at `http://localhost:4000`.

### Production Build

#### Build Frontend

```bash
npm run build
npm run move-pdfjs  # Copies PDF.js assets to static folder
npm run preview     # Preview production build
```

## 📁 Project Structure

```
FreshHub/
├── src/
│   ├── api/               # API controllers and fetchers
│   │   └── controllers/  # Business logic controllers
│   ├── components/        # Svelte components
│   ├── config/            # Configuration files
│   │   └── supabase/     # Supabase client setup
│   ├── lib/               # Shared libraries
│   │   ├── server/       # Serverless utilities
│   │   │   ├── errors.ts          # Error handling
│   │   │   ├── validation.ts      # Input validation
│   │   │   ├── rateLimit.ts       # Rate limiting
│   │   │   ├── logger.ts          # Logging
│   │   │   └── verifyTelegram.ts  # Telegram verification
│   │   ├── actions/      # Svelte actions
│   │   └── stores/       # Svelte stores (state management)
│   ├── routes/            # SvelteKit routes
│   │   ├── api/          # Serverless API endpoints
│   │   │   ├── auth/    # Authentication endpoints
│   │   │   ├── courses/ # Course endpoints
│   │   │   ├── exams/   # Exam endpoints
│   │   │   ├── resources/ # Resource endpoints
│   │   │   └── videos/  # Video endpoints
│   │   ├── course/       # Course pages
│   │   └── courses/      # Courses listing
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── static/                # Static assets
│   ├── lottie/           # Lottie animation files
│   └── pdfjs-express/    # PDF.js Express assets
├── scripts/               # Utility scripts
│   └── SetWebHook.js     # Telegram webhook setup
└── package.json           # Project dependencies
```

## 🎨 Key Features Explained

### Dynamic Page Titles

The project uses a centralized UI store to manage page titles:

```typescript
import { onMount } from 'svelte';
import { setPageTitle } from '$lib/stores/uiStore';

onMount(() => setPageTitle('My Page Title'));
```

### Authentication

Two authentication methods are supported:

1. **Telegram Authentication**: Automatic authentication via Telegram Web App
2. **Credential Authentication**: Username/password authentication

The auth store (`src/lib/stores/auth.ts`) provides:

- `isAuthenticated` - Writable store for auth status
- `loginDemo()` - Demo login function
- `loginWithTelegramInit()` - Telegram-based login
- `loginWithBackend()` - Credential-based login
- `logout()` - Logout function

### State Management

Svelte stores are used for state management:

- `auth.ts` - Authentication state
- `coursesContext.ts` - Course data and caching
- `resourcesContext.ts` - Resource data
- `themeStore.ts` - Theme preferences
- `uiStore.ts` - UI state (page titles, etc.)
- `overlayLoader.ts` - Loading overlay state

### Telegram Integration

The app detects if it's running in a Telegram Web App and:

- Automatically authenticates users
- Syncs theme with Telegram's color scheme
- Expands to full screen
- Enables closing confirmation

## 🔌 API Endpoints

### Serverless API Routes (SvelteKit)

- `GET /api/courses` - Get all courses (rate limited)
- `GET /api/resources?courseId={uuid}&type={optional}` - Get resources by course (rate limited, validated)
- `GET /api/videos?courseId={uuid}` - Get videos by course (rate limited, validated)
- `GET /api/exams?courseId={uuid}` - Get exams by course (strict rate limit, validated)
- `GET /api/exams/all` - Get all exams (strict rate limit)
- `GET /api/questions?examId={uuid}` - Get questions for an exam (strict rate limit, validated)
- `POST /api/auth/login` - Telegram login (strict rate limit, validated)
- `POST /api/auth/signup` - Telegram signup (strict rate limit, validated)
- `POST /api/feedback` - Submit feedback (rate limited, validated)
- `POST /api/telegram` - Telegram webhook (for bot commands)
- `GET /api/users` - Get all users (rate limited)

All endpoints:

- Return standardized JSON responses with `{ ok: boolean, data?: T, error?: string, code?: string }`
- Include rate limit headers (`X-RateLimit-*`)
- Validate input using Zod schemas
- Handle errors consistently

## 🧪 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run check        # Type check with svelte-check
npm run check:watch  # Type check in watch mode
npm run format       # Format code with Prettier
npm run lint         # Lint code
npm run move-pdfjs   # Copy PDF.js assets
```

## 🌐 Deployment

### Vercel (Recommended)

The project includes a `vercel-build` script:

```bash
npm run vercel-build
```

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `TELEGRAM_BOT_TOKEN`
- `GEMINI_API_KEY` (if using AI features)

## 📝 Code Style

The project uses:

- **Prettier** for code formatting
- **TypeScript** for type safety
- **Svelte Check** for Svelte-specific validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🐛 Troubleshooting

### PDF.js Assets Not Loading

Run `npm run move-pdfjs` after installing dependencies or building.

### Telegram Authentication Issues

- Ensure `TELEGRAM_BOT_TOKEN` is set correctly
- Verify webhook is configured (use `scripts/SetWebHook.js`)
- Check that the app is running within Telegram Web App context

### Supabase Connection Issues

- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct
- Check Supabase project settings and API access
- Ensure database tables are created

### API Endpoint Issues

- Verify environment variables are set correctly
- Check that Supabase connection is working
- Review rate limit headers if getting 429 errors
- Check serverless function logs in your deployment platform

## 📚 Additional Resources

- [SvelteKit Documentation](https://kit.svelte.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PDF.js Express Documentation](https://www.pdftron.com/documentation/web/)

## 👥 Authors

FreshHub Development Team

---

**Note**: This project is designed to work primarily as a Telegram Web App but can also function as a standalone web application.
