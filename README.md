# Tarkhine Node.js Backend

A production-ready Node.js backend with Express.js, PostgreSQL, Prisma ORM, Scalar API documentation, JWT authentication, and comprehensive security features.

## Features

- **Framework**: Express.js with MVC architecture
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with httpOnly cookies
- **API Documentation**: Scalar (OpenAPI/Swagger)
- **Response Format**: JSend standard
- **Security**:
  - Helmet for security headers
  - Rate limiting (DoS protection)
  - Input sanitization (XSS prevention)
  - CSRF protection
  - Brute force protection
  - SQL injection prevention (via Prisma)
- **Query Features**:
  - Pagination
  - Filtering
  - Sorting
  - Full-text search
- **File Upload**: Multer with validation
- **Logging**: Morgan
- **Containerization**: Docker & docker-compose

## Quick Start

### Using Docker (Recommended)

```bash
# Start PostgreSQL and the app
docker-compose up -d

# The app will automatically run migrations and seed the database on startup
```

## Docker Commands

### Starting the Application
```bash
docker-compose up -d
```
Starts all containers (app + postgres) with automatic migrations and seeding.

### Stopping the Application
```bash
docker-compose down
```
Stops and removes all containers but keeps database data.

### Complete Cleanup
```bash
docker-compose down -v
```
Stops containers and removes volumes (completely wipes database data).

### Running Migrations Alone
```bash
docker-compose exec app npx prisma migrate deploy
```
Applies pending database migrations without restarting containers.

### Running Seeder Alone
```bash
docker-compose exec app npm run seed
```
Populates database with dummy data without restarting containers.

### Viewing Logs
```bash
docker-compose logs -f app
```
View real-time application logs.

### Manual Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

## Environment Variables

See [.env.example](.env.example) for all available environment variables.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT tokens
- `COOKIE_SECRET` - Secret for cookie signing
- `PORT` - Server port (default: 3000)

## API Documentation

Once the server is running, visit:
- **Scalar Docs**: http://localhost:3000/docs
- **Health Check**: http://localhost:3000/health

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account (username + password + confirm password)
- `POST /api/auth/signin` - Sign in to existing account (username + password)
- `POST /api/auth/signout` - Sign out and delete authentication cookie
- `GET /api/auth/me` - Get current authenticated user

#### Authentication Examples

**Signup (201 Created)**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe123"
    },
    "message": "Account created successfully"
  }
}
```

**Signin (200 OK)**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe123"
    },
    "message": "Signed in successfully"
  }
}
```
*Note: Sets httpOnly cookie for authentication*

**Signout (200 OK)**
```json
{
  "status": "success",
  "data": {
    "message": "Signed out successfully"
  }
}
```
*Note: Clears authentication cookie*

**Error Responses**

Username already taken (409 Conflict):
```json
{
  "status": "error",
  "message": "This username is already taken. Please choose another.",
  "code": "USERNAME_TAKEN"
}
```

Invalid credentials (401 Unauthorized):
```json
{
  "status": "error",
  "message": "Invalid username or password",
  "code": "INVALID_CREDENTIALS"
}
```

### Resources (Example CRUD)
- `GET /api/resources` - Get all resources (with pagination, filtering, sorting)
- `GET /api/resources/:id` - Get resource by ID
- `POST /api/resources` - Create new resource (requires auth)
- `PUT /api/resources/:id` - Update resource (requires auth)
- `DELETE /api/resources/:id` - Delete resource (requires auth)

### File Upload
- `POST /api/upload/single` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files
- `DELETE /api/uploads/:filename` - Delete file
- `GET /api/uploads/:filename/info` - Get file info

## Query Parameters

### Pagination & Sorting
```
GET /api/resources?page=1&limit=10&sort=name:asc
```

| Parameter | Description | Example |
|-----------|-------------|---------|
| `page` | Page number (starts at 1) | `page=2` |
| `limit` | Items per page (max: 100) | `limit=25` |
| `sort` | Sort field and direction | `sort=name:asc` |

### Filtering
```
GET /api/resources?status=active&category=electronics
```

Any field can be used as a filter. Example filters:
- `status=active`
- `category=electronics`
- `search=test` (full-text search)

## NPM Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate    # Create and run migrations
npm run prisma:studio     # Open Prisma Studio
npm run prisma:deploy     # Deploy migrations (production)
```

## Project Structure

```
tarkhine-nodejs/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Database migrations
├── src/
│   ├── config/            # Configuration files
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   ├── controllers/       # Business logic
│   ├── services/          # Database interaction
│   ├── utils/             # Utility functions
│   ├── validators/        # Request validation
│   └── app.js             # Express app setup
├── uploads/               # Uploaded files
├── Dockerfile             # Docker image
├── docker-compose.yml     # Docker services
└── server.js              # Entry point
```

## Security Features

- **XSS Protection**: Input sanitization and Helmet headers
- **SQL Injection**: Prisma ORM with parameterized queries
- **CSRF**: Token validation on state-changing routes
- **Rate Limiting**: Multiple tiers (global, auth, strict)
- **Brute Force**: Rate limiting on auth routes
- **DoS**: Rate limiting and request size limits
- **Session Hijacking**: httpOnly cookies with secure flags

## License

ISC
