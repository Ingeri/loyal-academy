# Loyal Academy - Online Learning Platform

A comprehensive, full-stack online learning platform built with Next.js 16, TypeScript, Supabase, and Stripe integration.

## Features

### Public Pages
- **Homepage**: Hero section, featured courses, stats, and CTAs
- **Courses Browse**: Searchable course catalog with filtering by category and level
- **Course Details**: Detailed course information, instructor details, and enrollment
- **About**: Company mission, values, and why choose us
- **Blog**: Article listing and individual blog post pages
- **Contact**: Contact form for inquiries

### Student Features
- **Authentication**: Email/password signup and login with Supabase Auth
- **Dashboard**: Overview of enrolled courses, progress tracking, and certificates
- **Learning Path**: Course content with progress tracking
- **Profile**: User profile and settings management
- **Enrollment**: Course enrollment with payment integration
- **Progress Tracking**: Track completion of course lessons
- **Certificates**: Download certificates upon course completion

### Admin Features
- **Admin Dashboard**: Platform overview with key metrics
- **Course Management**: Create, edit, and manage courses
- **User Management**: Manage user accounts and roles
- **Analytics**: View platform analytics and performance metrics
- **Payment Management**: Track payments and revenue

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Database**: Supabase (PostgreSQL with RLS)
- **Authentication**: Supabase Auth (Email/Password)
- **File Storage**: Supabase Storage (for images, videos, certificates)
- **Payments**: Stripe integration (with webhook support)
- **Deployment**: Vercel

## Database Schema

### Tables
- **users**: User profiles with roles (student, instructor, admin)
- **courses**: Course information and metadata
- **course_content**: Lessons, modules, quizzes for courses
- **enrollments**: Student course enrollments and progress
- **progress**: Lesson/module completion tracking
- **certificates**: Issued course completion certificates
- **payments**: Payment transaction records
- **blog_posts**: Blog articles
- **blog_comments**: Comments on blog posts
- **contact_messages**: Contact form submissions

### Security
- Row Level Security (RLS) enabled on all tables
- Policies enforce user-level data isolation
- Authentication required for protected routes

## Project Structure

```
app/
├── layout.tsx                 # Root layout with metadata
├── page.tsx                   # Homepage
├── globals.css               # Global styles and design tokens
├── auth/
│   ├── login/               # Login page
│   ├── signup/              # Signup and success pages
│   └── error/               # Auth error page
├── courses/
│   ├── page.tsx             # Courses catalog
│   └── [id]/page.tsx        # Course details
├── blog/
│   ├── page.tsx             # Blog listing
│   └── [slug]/page.tsx      # Blog post detail
├── about/page.tsx           # About page
├── contact/page.tsx         # Contact page
├── dashboard/page.tsx       # Student dashboard
├── learn/[id]/page.tsx      # Course learning interface
├── enroll/[id]/page.tsx     # Enrollment/checkout page
├── checkout/[id]/page.tsx   # Payment checkout
├── profile/page.tsx         # User profile settings
└── admin/
    ├── page.tsx             # Admin dashboard
    ├── courses/page.tsx     # Course management
    └── users/page.tsx       # User management

lib/
├── supabase/
│   ├── client.ts            # Supabase client (browser)
│   ├── server.ts            # Supabase client (server)
│   └── proxy.ts             # Session management middleware

components/
├── navigation.tsx           # Main navigation component
└── footer.tsx              # Footer component

scripts/
├── 01-create-tables.sql    # Database table creation
└── 02-rls-policies.sql     # RLS security policies
```

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Supabase account
- Stripe account (for payments)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd loyal-academy
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. **Initialize the database**
```bash
# Run SQL scripts in Supabase SQL Editor
# 1. Execute: scripts/01-create-tables.sql
# 2. Execute: scripts/02-rls-policies.sql
```

5. **Start the development server**
```bash
pnpm dev
```

Navigate to `http://localhost:3000`

## Configuration

### Supabase Setup
1. Create tables using SQL scripts in `/scripts`
2. Enable RLS on all tables
3. Create storage buckets for course materials
4. Set up auth configuration

### Stripe Setup
1. Add Stripe keys to environment variables
2. Configure webhook endpoints for payment events
3. Test with Stripe test credentials

### Course Creation
- Admin users can create courses in the admin dashboard
- Courses can be set as draft or published
- Add course content (lessons, quizzes, assignments)
- Set pricing and enrollment limits

## Features Implementation Status

### Completed
- ✅ Full authentication system with Supabase
- ✅ Course browsing and catalog
- ✅ Student dashboard and learning interface
- ✅ Profile management
- ✅ Admin dashboard
- ✅ Blog system
- ✅ Contact form
- ✅ Responsive design
- ✅ Database schema with RLS

### In Progress
- 🔄 Stripe payment integration (UI ready, needs API keys)
- 🔄 Webhook handling for payments
- 🔄 Progress tracking completion
- 🔄 Certificate generation

### Future Enhancements
- Live video support
- Discussion forums
- Peer reviews
- Advanced analytics
- Email notifications
- Mobile app
- API for third-party integrations

## Deployment

### Vercel Deployment
```bash
# Push to GitHub
git push origin main

# Deploy via Vercel dashboard
# or use Vercel CLI
vercel deploy
```

### Environment Variables
Set these in Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## API Routes

### Available Endpoints (to be implemented)
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/courses` - Get courses list
- `POST /api/enrollments` - Enroll in course
- `POST /api/payments/webhook` - Stripe webhook
- `POST /api/progress` - Update course progress

## Security Considerations

- All routes requiring authentication redirect to login
- RLS policies enforce data isolation
- Sensitive data stored server-side only
- Stripe API keys kept secure
- CSRF protection enabled
- Input validation on all forms

## Support & Documentation

For detailed setup guides and API documentation, refer to:
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Stripe Docs](https://stripe.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)

## License

MIT License - feel free to use this project as a template for your own learning platform.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
