# Wholesale Real Estate Lead CRM

A full-stack CRM application for managing wholesale real estate leads with two lead types: Diamond Leads and Dollar Leads. Built with Next.js 15, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Features

- Dashboard with real-time statistics
- Lead management (Create, Read, Update, Delete)
- CSV Import/Export functionality
- Lead filtering and search
- Activity timeline for each lead
- Support for Diamond and Dollar lead types
- Property valuation tracking (Estimate, MAO, Offer Price, Equity)
- Responsive design

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Forms & Validation**: Zod
- **CSV Processing**: PapaParse

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Neon recommended)
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables:
Create a `.env.local` file in the root directory with the following:

```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
```

Replace with your actual Neon PostgreSQL connection string.

3. Set up the database:
```bash
npx prisma db push
npx prisma generate
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup (Neon)

1. Go to [console.neon.tech](https://console.neon.tech)
2. Create a new project named "gambitaxtleads"
3. Copy the connection string
4. Add it to your `.env.local` file as `DATABASE_URL`
5. Run `npx prisma db push` to create the tables

## Deployment to Vercel

1. Install Vercel CLI (optional):
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add your `DATABASE_URL` environment variable in the Vercel dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add `DATABASE_URL` with your Neon connection string

4. Deploy to production:
```bash
vercel --prod
```

## Project Structure

```
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   │   ├── leads/         # Lead CRUD operations
│   │   │   ├── stats/         # Dashboard statistics
│   │   │   └── activities/    # Activity tracking
│   │   ├── leads/             # Lead pages
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Dashboard page
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── LeadTable.tsx     # Leads table
│   │   ├── LeadForm.tsx      # Lead form
│   │   ├── ImportWizard.tsx  # CSV import
│   │   └── ...
│   └── lib/                   # Utilities and types
│       ├── db.ts             # Prisma client
│       ├── utils.ts          # Helper functions
│       ├── validations.ts    # Zod schemas
│       └── types.ts          # TypeScript types
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static files
└── package.json
```

## CSV Import Format

### Diamond Leads CSV Headers:
```
Name, Phone, Email, Address, City, State, Zip Code, Notes, Call Recording, Estimate, MAO, Offer Price, Equity, Status
```

### Dollar Leads CSV Headers:
```
Name, Phone, Email, Address, City, State, Zip Code, Notes, Estimate, MAO, Offer Price, Equity, Status
```

## API Endpoints

- `GET /api/stats` - Dashboard statistics
- `GET /api/leads` - List all leads (with filters)
- `POST /api/leads` - Create new lead
- `GET /api/leads/[id]` - Get lead by ID
- `PATCH /api/leads/[id]` - Update lead
- `DELETE /api/leads/[id]` - Delete lead
- `POST /api/leads/import` - Import CSV
- `POST /api/leads/export` - Export to CSV
- `POST /api/activities` - Create activity
- `GET /api/activities?leadId=[id]` - Get activities for lead

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
