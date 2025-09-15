# API Auth with Prisma, Auth.js and Express

<p>This is a robust authentication API that enables secure user authentication through multiple providers including Google, GitHub, and traditional email & password credentials. The API provides a seamless authentication flow for initializing user sessions across different authentication methods.</p>

  <div style="display: flex; justify-content: center; align-items: center;">
  <img src="https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=fff&style=flat-square" alt="Express.js">
  <img src="https://img.shields.io/badge/Auth.js-blue?style=flat-square&logo=Auth.js" alt="Auth.js">
  <img src="https://img.shields.io/badge/Prisma-6.13.0-2D3748?style=flat-square&logo=prisma" alt="Prisma">
  </div>

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/dante2182/api-auth.git
cd api-auth

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Environment Setup

Create a `.env` file in the root directory:

```bash
# PORT

PORT=4000

# DATABASE_URL

DATABASE_URL="file:./dev.db"

# AUTH_SECRET

AUTH_SECRET=

# GOOGLE_CLIENT_ID

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# GITHUB_CLIENT_ID

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# AUTH_SECRET

NODE_ENV=development
```

### Development

```bash
# Start development server
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm start

# Run linting
pnpm run lint
```

### Routes

#### Auth Routes

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/signin` - Login a user
- `POST /api/auth/signout` - Sign out a user

#### Note Routes

- `POST /api/notes` - Create a new note
- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get a note by id
- `PUT /api/notes/:id` - Update a note by id
- `DELETE /api/notes/:id` - Delete a note by id
