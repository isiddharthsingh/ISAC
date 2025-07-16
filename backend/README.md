# ISAC Backend API

Backend API for the International Student Advocacy Committee (ISAC) platform.

## Features

- **Mentor Management**: Complete CRUD operations for mentors
- **Advanced Filtering**: Search by specialty, language, location, university
- **Pagination**: Efficient data loading with pagination support
- **Rate Limiting**: Protection against API abuse
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **Security**: CORS, Helmet, and input validation
- **Database**: PostgreSQL with connection pooling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials and configuration.

4. Set up the database:
   - Create a PostgreSQL database
   - Run the SQL scripts to create tables and insert sample data

5. Start the server:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Mentors

#### Get All Mentors
```
GET /api/mentors
```

**Query Parameters:**
- `specialty` - Filter by specialty (e.g., "International Student", "Alumni", "Professor")
- `language` - Filter by language (e.g., "English", "Spanish")
- `location` - Filter by location (e.g., "New York, USA")
- `university` - Filter by university name
- `search` - Search in name, specialty, university, or bio
- `sortBy` - Sort field (full_name, specialty, university, created_at)
- `sortOrder` - Sort order (ASC, DESC)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Example:**
```
GET /api/mentors?specialty=International%20Student&language=English&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "mentors": [
      {
        "id": 1,
        "name": "Soham Moghe",
        "specialty": "International Student",
        "university": "New York University",
        "degree": "MS in Computer Science",
        "location": "New York, USA",
        "languages": ["English", "Hindi", "Marathi"],
        "bio": "I'm an international student...",
        "image": "/api/placeholder/150/150",
        "social": {
          "instagram": "@_sohammmm",
          "linkedin": "https://www.linkedin.com/in/soham-moghe/",
          "whatsapp": "Find me in NYU groups"
        },
        "rating": 0.00,
        "totalReviews": 0,
        "experienceYears": null,
        "createdAt": "2024-01-01T12:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 6,
      "itemsPerPage": 10,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

#### Get Mentor by ID
```
GET /api/mentors/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Soham Moghe",
    "specialty": "International Student",
    // ... other mentor fields
  }
}
```

#### Get Mentor Statistics
```
GET /api/mentors/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_mentors": "6",
      "total_specialties": "3",
      "total_universities": "6",
      "total_locations": "5",
      "average_rating": "0.00"
    },
    "specialtyBreakdown": [
      {
        "specialty": "International Student",
        "count": "3"
      },
      {
        "specialty": "Professor",
        "count": "2"
      },
      {
        "specialty": "Alumni",
        "count": "1"
      }
    ]
  }
}
```

#### Get Filter Options
```
GET /api/mentors/filter-options
```

**Response:**
```json
{
  "success": true,
  "data": {
    "specialties": ["International Student", "Alumni", "Professor"],
    "languages": ["English", "French", "Hindi", "Korean", "Marathi", "Spanish"],
    "locations": ["California, USA", "New Haven, USA", "New York, USA", "Palo Alto, USA", "Toronto, Canada"],
    "universities": ["New York University", "Stanford Business School", "UC San Diego", "University of Toronto", "Yale Law School"]
  }
}
```

#### Submit Mentor Application
```
POST /api/mentors/apply
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-0123",
  "currentUniversity": "Harvard University",
  "degree": "MS Computer Science",
  "graduationYear": "2023",
  "specialization": "Graduate School Applications",
  "experienceYears": "3",
  "languages": "English, Spanish",
  "linkedinUrl": "https://linkedin.com/in/johndoe",
  "motivation": "I want to help students...",
  "availability": "Weekday evenings",
  "sampleAdvice": "I would help them by..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mentor application submitted successfully",
  "data": {
    "applicationId": 1,
    "submittedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

## Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting

- **General endpoints**: 100 requests per 15 minutes
- **Application endpoints**: 10 requests per 15 minutes
- **Authentication endpoints**: 5 requests per 15 minutes

## Security Features

- **CORS**: Configured for frontend domain
- **Helmet**: Security headers
- **Input validation**: All inputs are validated and sanitized
- **Rate limiting**: Prevents API abuse
- **Error handling**: Sensitive information is not exposed in production

## Development

### Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (not implemented yet)

### Environment Variables

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_password

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Database Schema

The API uses PostgreSQL with the following main tables:

- `mentors` - Approved mentors
- `mentor_applications` - Pending mentor applications

See the database setup SQL files for complete schema details.

## Health Check

```
GET /health
```

Returns server status and basic information. 