# EventScale - Event Aggregation Platform

A full-stack event aggregation platform that scrapes events from public websites, allows admin curation, and serves approved events to end users through a marketplace.

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph Scraper["🕷️ Scraper Service"]
        CRON[Cron Scheduler] --> PLAYWRIGHT[Playwright Browser]
        PLAYWRIGHT --> PARSER[Data Parser]
    end
    
    subgraph Database["🗄️ Database Layer"]
        PRISMA[Prisma ORM] --> NEONDB[(NeonDB PostgreSQL)]
    end
    
    subgraph Backend["⚙️ Backend API"]
        EXPRESS[Express.js Server]
        AUTH[Google OAuth]
        JWT[JWT Auth]
    end
    
    subgraph Frontend["🌐 Frontend"]
        MARKETPLACE[Event Marketplace]
        ADMIN[Admin Dashboard]
    end
    
    PARSER --> PRISMA
    EXPRESS --> PRISMA
    AUTH --> JWT
    ADMIN --> EXPRESS
    MARKETPLACE --> EXPRESS
```

---

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Express.js (Node.js) with TypeScript |
| **Database** | PostgreSQL (NeonDB - Serverless) |
| **ORM** | Prisma 7 with PostgreSQL adapter |
| **Scraper** | Playwright (Chromium headless browser) |
| **Scheduler** | node-cron |
| **Authentication** | Google OAuth 2.0 + JWT |
| **Monorepo** | Turborepo + pnpm workspaces |
| **Deployment** | Render (Backend), Vercel (Frontend) |

---

## 📁 Project Structure

```
eventscale/
├── apps/
│   ├── backend/          # Express.js API server
│   │   └── src/
│   │       └── index.ts  # Main API with routes
│   └── scraper/          # Event scraping service
│       └── src/
│           ├── index.ts          # Cron scheduler
│           └── scraper/
│               └── eventbrite.ts # Eventbrite scraper
├── packages/
│   └── db/               # Shared database package
│       ├── prisma/
│       │   └── schema.prisma
│       └── src/
│           └── index.ts  # DB connection utilities
├── Dockerfile            # Docker configuration
├── render.yaml           # Render deployment config
└── turbo.json            # Turborepo config
```

---

## 🔄 Data Flow

```mermaid
sequenceDiagram
    participant Cron as ⏰ Cron Scheduler
    participant Scraper as 🕷️ Playwright Scraper
    participant Eventbrite as 🌐 Eventbrite
    participant DB as 🗄️ PostgreSQL
    participant API as ⚙️ Backend API
    participant Admin as 👤 Admin Dashboard
    participant User as 👥 End Users

    Cron->>Scraper: Trigger hourly job
    Scraper->>Eventbrite: Fetch event listings
    Eventbrite-->>Scraper: HTML pages
    Scraper->>Scraper: Parse & normalize data
    Scraper->>DB: Upsert events (status: new/updated)
    
    Admin->>API: Login via Google OAuth
    API-->>Admin: JWT token
    Admin->>API: GET /admin/events
    API-->>Admin: Unapproved events list
    Admin->>API: POST /admin/event/:id
    API->>DB: Update (isApproved: true)
    
    User->>API: GET /events
    API->>DB: Query approved events
    DB-->>API: Event list
    API-->>User: Approved events JSON
    User->>API: POST /events/:id/lead
    API->>DB: Save lead email
```

### Flow Summary

1. **Scraping**: The scraper periodically visits public event websites (Eventbrite) and extracts event information using Playwright
2. **Storage**: Scraped data is normalized and stored in PostgreSQL using Prisma ORM
3. **Lifecycle**: Events are tagged based on their status (`new`, `updated`, `inactive`, `imported`)
4. **API**: The backend API exposes endpoints to fetch event data and manage admin actions
5. **Frontend**: The marketplace consumes these APIs to render events for end users
6. **Admin Auth**: Admin users authenticate via Google OAuth to access protected features

---

## 🗄️ Database Schema

### Models

#### Admin
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| name | String | Admin display name |
| email | String | Unique email address |
| avatar | String? | Profile picture URL |
| provider | Enum | Auth provider (`google`, `email`) |
| providerId | String? | OAuth provider ID |

#### Event
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| title | String | Event title |
| description | Text | Full description |
| summary | String | Short summary (max 500 chars) |
| venueName | String | Location name |
| venueAddress | String | Full address |
| city | String | City (default: Sydney) |
| category | String | Event category |
| dateTimeStart | DateTime | Event start time |
| dateTimeEnd | DateTime | Event end time |
| imageUrl | String? | Event image |
| sourceWebsite | String | Source (e.g., "Eventbrite") |
| originalUrl | String | Original event URL |
| status | Enum | `new`, `updated`, `inactive`, `imported` |
| isApproved | Boolean | Admin approval status |
| hash | String | Content hash for change detection |

#### EventLead
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| email | String | User's email |
| eventId | UUID | Related event |
| consent | Boolean | Marketing consent |
| originalEventUrl | String | Redirect URL |

---

## 🛣️ API Routes

### Public Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/events` | Get all approved, active events |
| `POST` | `/events/:id/lead` | Capture lead email before redirect |

### Authentication

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/auth/google` | Login with Google OAuth |
| `GET` | `/auth/verify` | Verify JWT token |

### Admin (Protected - Requires JWT)

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/admin/events` | Get unapproved events |
| `GET` | `/admin/imported/events` | Get imported events |
| `POST` | `/admin/event/:id` | Approve/import an event |

---

## 🕷️ Scraper Details

The scraper uses **Playwright** with headless Chromium to scrape events from Eventbrite.

### Features
- **Hourly execution** via node-cron (`0 * * * *`)
- **Deduplication** using content hashing
- **Upsert logic**: Creates new events or updates existing ones
- **Inactive marking**: Events no longer found are marked `inactive`
- **Multiple extraction strategies**: JSON-LD, data attributes, DOM parsing

### Event Lifecycle States

```mermaid
stateDiagram-v2
    [*] --> new: Scraped for first time
    new --> imported: Admin approves
    new --> updated: Content changed
    updated --> imported: Admin approves
    new --> inactive: No longer found
    updated --> inactive: No longer found
    imported --> inactive: No longer found
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm 8+
- PostgreSQL database (or NeonDB account)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd eventscale

# Install dependencies
pnpm install

# Set up environment variables
cp apps/backend/.env.example apps/backend/.env
cp apps/scraper/.env.example apps/scraper/.env
```

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@host/db
GOOGLE_CLIENT_ID=your-google-client-id
JWT_SECRET=your-jwt-secret
PORT=5000
```

#### Scraper (.env)
```env
DATABASE_URL=postgresql://user:pass@host/db
```

### Database Setup

```bash
# Generate Prisma client
cd packages/db
pnpm prisma generate

# Run migrations
pnpm prisma migrate deploy
```

### Running Locally

```bash
# Start backend API
cd apps/backend
pnpm dev

# Start scraper (in another terminal)
cd apps/scraper
pnpm dev
```

---

## 🐳 Docker Deployment

```bash
# Build the image
docker build -t eventscale-backend .

# Run the container
docker run -p 5000:5000 --env-file .env eventscale-backend
```

---

## 📡 Deployment

### Backend (Render)
- Deployed as a Docker web service
- Auto-deploys on push to main branch
- Uses `render.yaml` for configuration

### Frontend (Vercel)
- Deployed at: `https://event-task-frontend.vercel.app`
- CORS configured to allow requests from frontend

---

## 🔐 Authentication Flow

```mermaid
sequenceDiagram
    participant User as Admin User
    participant Frontend as Frontend
    participant Google as Google OAuth
    participant Backend as Backend API
    participant DB as Database

    User->>Frontend: Click "Login with Google"
    Frontend->>Google: Redirect to Google login
    Google-->>Frontend: Credential token
    Frontend->>Backend: POST /auth/google {credential}
    Backend->>Google: Verify token
    Google-->>Backend: User info
    Backend->>DB: Find or create admin
    Backend-->>Frontend: JWT token + admin info
    Frontend->>Frontend: Store token in localStorage
```

---

## 📝 License

MIT License
