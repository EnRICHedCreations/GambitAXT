# Wholesale Real Estate Lead CRM - One-Shot Build Plan

## Project Overview
Build a full-stack React/Node.js CRM application for managing wholesale real estate leads with two lead types: Diamond Leads and Dollar Leads. Deploy to Vercel with Neon PostgreSQL database.

## Tech Stack
- **Frontend**: React 18+ with TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Next.js 14+ App Router (API routes)
- **Database**: Neon PostgreSQL (Vercel-compatible serverless)
- **ORM**: Prisma
- **Deployment**: Vercel
- **Authentication**: NextAuth.js (optional for MVP, but recommended)

## Database Schema

### Leads Table
```prisma
model Lead {
  id              String    @id @default(cuid())
  leadType        String    // "Diamond" or "Dollar"
  name            String
  phone           String?
  address         String?
  city            String?
  state           String?
  zipCode         String?
  email           String?
  notes           String?   @db.Text
  callRecording   String?   // URL (Diamond only)
  estimate        Decimal?  @db.Decimal(12, 2)
  mao             Decimal?  @db.Decimal(12, 2) // Maximum Allowable Offer
  offerPrice      Decimal?  @db.Decimal(12, 2)
  equity          Decimal?  @db.Decimal(10, 2)
  status          String    @default("New") // New, Contacted, Qualified, Follow-up, Contracted, Closed, Dead
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  importedAt      DateTime? // Track when CSV was imported
  
  @@index([leadType])
  @@index([status])
  @@index([createdAt])
}
```

### Activities Table (for tracking interactions)
```prisma
model Activity {
  id          String   @id @default(cuid())
  leadId      String
  activityType String  // "call", "email", "note", "status_change"
  description String   @db.Text
  createdAt   DateTime @default(now())
  
  @@index([leadId])
  @@index([createdAt])
}
```

## Core Features

### 1. Dashboard (Home Page)
- **Stats Cards**: 
  - Total leads by type (Diamond/Dollar)
  - Leads by status (visual breakdown)
  - Recent activity summary
  - Conversion rates
- **Quick Actions**: 
  - Import CSV
  - Add new lead manually
  - View all leads

### 2. Lead List View (Main CRM Table)
- **Features**:
  - Filterable by: Lead Type, Status, Date Range, Location (State/City)
  - Searchable by: Name, Phone, Address
  - Sortable by: Name, Date Added, Estimate, MAO, Status
  - Bulk actions: Update status, Delete, Export
  - Pagination (50 leads per page)
- **Columns**:
  - Checkbox for bulk selection
  - Lead Type badge (Diamond/Dollar with colors)
  - Name (clickable to detail view)
  - Phone (clickable to call)
  - Address (City, State)
  - Estimate, MAO, Offer Price (formatted currency)
  - Equity (with color coding: green >70%, yellow 40-70%, red <40%)
  - Status (dropdown for quick update)
  - Actions (View, Edit, Delete)

### 3. Lead Detail View
- **Header Section**:
  - Lead type badge
  - Name, contact info (phone/email with click-to-call/email)
  - Status dropdown (with timestamp of last status change)
- **Property Details Card**:
  - Full address with Google Maps link
  - Estimate, MAO, Offer Price, Equity
- **Notes Section**:
  - Large text area for notes
  - Call recording link (Diamond leads only)
  - Save button
- **Activity Timeline**:
  - Chronological list of all activities
  - Status changes, notes added, etc.
- **Quick Actions**:
  - Add activity (call, email, note)
  - Update status
  - Delete lead

### 4. CSV Import
- **Import Page**:
  - Drag-and-drop or file picker
  - Lead type selector (Diamond/Dollar)
  - Preview table showing first 10 rows
  - Validation errors display
  - Confirm import button
- **CSV Mapping** (auto-detect from headers):
  - Diamond: Name, Phone, Address, City, State, Zip Code, Email, Notes, Call Recording, Estimate, MAO, Offer Price, Equity, Status
  - Dollar: Name, Phone, Address, City, State, Zip Code, Email, Notes, Estimate, MAO, Offer Price, Equity, Status (no Call Recording)
- **Import Logic**:
  - Skip duplicate phone numbers (optional: update existing)
  - Set default status to "New" if Status column empty
  - Parse currency values (remove $ and commas)
  - Set importedAt timestamp

### 5. Lead Form (Add/Edit)
- **Form Fields**:
  - Lead Type (radio: Diamond/Dollar)
  - Name* (required)
  - Phone
  - Email
  - Address, City, State, Zip Code
  - Estimate, MAO, Offer Price, Equity
  - Notes (textarea)
  - Call Recording URL (Diamond only)
  - Status (dropdown)
- **Validation**:
  - Required fields marked
  - Phone format validation (US)
  - Email format validation
  - Currency fields (positive numbers)
- **Actions**: Save, Save & Add Another, Cancel

### 6. Export Functionality
- Export filtered/selected leads to CSV
- Include all fields
- Filename: `leads_export_YYYY-MM-DD.csv`

## API Routes (Next.js App Router)

### `/api/leads`
- **GET**: List leads with filters, search, pagination
  - Query params: `type`, `status`, `search`, `page`, `limit`, `sortBy`, `sortOrder`
- **POST**: Create new lead

### `/api/leads/[id]`
- **GET**: Get single lead with activities
- **PATCH**: Update lead
- **DELETE**: Delete lead

### `/api/leads/import`
- **POST**: Import CSV file
  - Body: `file` (multipart), `leadType` (Diamond/Dollar)
  - Returns: Import summary (success count, errors)

### `/api/leads/export`
- **POST**: Export leads to CSV
  - Body: `filters` (JSON)
  - Returns: CSV file download

### `/api/activities`
- **POST**: Create activity for a lead

### `/api/stats`
- **GET**: Dashboard statistics

## UI/UX Requirements

### Design System
- **Colors**:
  - Diamond Leads: Blue theme (#3B82F6)
  - Dollar Leads: Green theme (#10B981)
  - Status colors:
    - New: Gray
    - Contacted: Blue
    - Qualified: Purple
    - Follow-up: Yellow
    - Contracted: Orange
    - Closed: Green
    - Dead: Red
- **Typography**: Clear, professional, easy to read
- **Responsive**: Mobile-friendly (priority on desktop but usable on mobile)

### Components to Build
1. **LeadTable**: Main data table with filters
2. **LeadCard**: Individual lead card for detail view
3. **StatusDropdown**: Quick status update component
4. **ImportWizard**: Multi-step CSV import
5. **StatsCard**: Dashboard statistics card
6. **ActivityTimeline**: Activity history component
7. **LeadForm**: Add/Edit lead form
8. **FilterPanel**: Advanced filtering sidebar
9. **SearchBar**: Global search component

## File Structure
```
/
├── app/
│   ├── api/
│   │   ├── leads/
│   │   │   ├── route.ts
│   │   │   ├── [id]/route.ts
│   │   │   ├── import/route.ts
│   │   │   └── export/route.ts
│   │   ├── activities/route.ts
│   │   └── stats/route.ts
│   ├── leads/
│   │   ├── page.tsx (list view)
│   │   ├── [id]/page.tsx (detail view)
│   │   ├── new/page.tsx (add lead)
│   │   └── import/page.tsx (import CSV)
│   ├── dashboard/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx (redirect to dashboard)
├── components/
│   ├── ui/ (shadcn components)
│   ├── LeadTable.tsx
│   ├── LeadCard.tsx
│   ├── StatusDropdown.tsx
│   ├── ImportWizard.tsx
│   ├── StatsCard.tsx
│   ├── ActivityTimeline.tsx
│   ├── LeadForm.tsx
│   ├── FilterPanel.tsx
│   └── SearchBar.tsx
├── lib/
│   ├── db.ts (Prisma client)
│   ├── utils.ts (helpers)
│   └── validations.ts (Zod schemas)
├── prisma/
│   └── schema.prisma
├── public/
├── .env.local (DATABASE_URL)
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Environment Variables
```
DATABASE_URL="postgresql://..."  # Neon database URL
NEXTAUTH_SECRET="..."            # For auth (if implemented)
NEXTAUTH_URL="http://localhost:3000"
```

## Setup Instructions

### 1. Initialize Project
```bash
npx create-next-app@latest real-estate-crm --typescript --tailwind --app
cd real-estate-crm
npm install prisma @prisma/client
npm install zod date-fns papaparse
npm install -D @types/papaparse
npx shadcn-ui@latest init
```

### 2. Install shadcn components
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add toast
```

### 3. Setup Prisma
```bash
npx prisma init
# Update schema.prisma with the schema above
npx prisma generate
npx prisma db push
```

### 4. Create Neon Database
- Go to console.neon.tech
- Create new project: "real-estate-crm"
- Copy connection string to .env.local

### 5. Run Development Server
```bash
npm run dev
```

### 6. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel

# Add DATABASE_URL environment variable in Vercel dashboard
# Redeploy
vercel --prod
```

## Key Implementation Notes

### CSV Parsing
- Use `papaparse` library for CSV parsing
- Handle comma-in-quotes for notes field
- Validate phone numbers and emails
- Parse currency strings (remove $, commas)

### Status Management
- Use TypeScript enum for status values
- Track status change history in activities table
- Show last updated timestamp

### Performance
- Implement cursor-based pagination for large datasets
- Index frequently queried fields (status, leadType, createdAt)
- Use React.memo for expensive components

### Error Handling
- Toast notifications for success/error messages
- Validation errors inline on forms
- API error responses with helpful messages

### Data Display
- Format phone numbers: (XXX) XXX-XXXX
- Format currency: $XXX,XXX.XX
- Format dates: MMM DD, YYYY at HH:MM AM/PM
- Truncate long notes with "read more"

## Testing Checklist
- [ ] Import Diamond Leads CSV
- [ ] Import Dollar Leads CSV
- [ ] Search leads by name, phone
- [ ] Filter by status, lead type
- [ ] Update lead status
- [ ] Add manual lead
- [ ] Edit existing lead
- [ ] Delete lead
- [ ] Export filtered leads
- [ ] Add activity/note to lead
- [ ] View activity timeline
- [ ] Dashboard stats update correctly
- [ ] Mobile responsive layout
- [ ] Call recording link works (Diamond)

## Future Enhancements (Not MVP)
- User authentication
- Multi-user support with permissions
- Email integration
- SMS integration
- Task/reminder system
- Document uploads
- Advanced analytics
- Email templates
- Automated follow-up sequences
- Integration with MLS

## Success Criteria
- Can import both CSV types without errors
- All CRUD operations work smoothly
- UI is clean, professional, and intuitive
- Fast load times (<2s for list view)
- No data loss on import/export
- Responsive on desktop and mobile
- Successfully deployed to Vercel with Neon DB

---

## Build Command for Claude Code

Create this entire application following the specifications above. The app should be production-ready, well-structured, and fully functional. Include all necessary files, components, API routes, and database schema. Make sure to implement proper error handling, validation, and a polished UI using Tailwind CSS and shadcn/ui components.