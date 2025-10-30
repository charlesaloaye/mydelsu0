# Course Summaries API Implementation Guide

This document outlines the backend API endpoints needed for the Course Summaries feature.

## Required Endpoints

### 1. GET /api/course-summaries

**Purpose:** List course summaries with filtering
**Query Parameters:**

- `type` (optional): Filter by type (notes, study-guide, quick-reference)
- `subject` (optional): Filter by subject
- `level` (optional): Filter by academic level
- `search` (optional): Search in title, description, or tags

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Calculus Fundamentals",
      "subject": "Mathematics",
      "level": "100 Level",
      "type": "notes",
      "description": "Complete guide to differential and integral calculus",
      "author": "user@email.com",
      "uploadDate": "2024-01-15T00:00:00Z",
      "downloads": 245,
      "rating": 4.8,
      "tags": ["calculus", "derivatives", "integrals"],
      "fileSize": "2.3 MB",
      "fileType": "PDF",
      "filename": "calculus-fundamentals.pdf",
      "filePath": "/uploads/course-summaries/calculus-fundamentals.pdf"
    }
  ]
}
```

### 2. GET /api/course-summaries/:id

**Purpose:** Get single course summary details
**Response:** Same as above but single object

### 3. POST /api/course-summaries

**Purpose:** Upload new course summary
**Content-Type:** multipart/form-data
**Form Data:**

- `title` (string): Title of the course summary
- `subject` (string): Subject name
- `level` (string): Academic level
- `type` (string): Type (notes, study-guide, quick-reference)
- `description` (string): Description
- `file` (file): The uploaded file

**Response:**

```json
{
  "success": true,
  "message": "Course summary uploaded successfully",
  "data": {
    "id": 1,
    "title": "Calculus Fundamentals"
    // ... other fields
  }
}
```

### 4. PUT /api/course-summaries/:id

**Purpose:** Update existing course summary
**Content-Type:** multipart/form-data
**Form Data:** Same as POST (all fields optional)

### 5. DELETE /api/course-summaries/:id

**Purpose:** Delete course summary
**Response:**

```json
{
  "success": true,
  "message": "Course summary deleted successfully"
}
```

### 6. GET /api/course-summaries/:id/download

**Purpose:** Download course summary file
**Response:** File download with appropriate headers

### 7. GET /api/course-summaries/stats

**Purpose:** Get statistics about course summaries
**Response:**

```json
{
  "success": true,
  "data": {
    "totalSummaries": 150,
    "totalDownloads": 2500,
    "byType": {
      "notes": 80,
      "study-guide": 45,
      "quick-reference": 25
    },
    "bySubject": {
      "Mathematics": 30,
      "Physics": 25,
      "Chemistry": 20
    }
  }
}
```

### 8. POST /api/course-summaries/search

**Purpose:** Advanced search functionality
**Body:**

```json
{
  "query": "calculus",
  "filters": {
    "type": "notes",
    "subject": "Mathematics",
    "level": "100 Level"
  }
}
```

## Database Schema

### CourseSummaries Table

```sql
CREATE TABLE course_summaries (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    level VARCHAR(50) NOT NULL,
    type ENUM('notes', 'study-guide', 'quick-reference') NOT NULL,
    description TEXT,
    author VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size VARCHAR(20),
    file_type VARCHAR(10),
    downloads INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_subject (subject),
    INDEX idx_level (level),
    INDEX idx_author (author),
    FULLTEXT idx_search (title, description, tags)
);
```

## File Storage

- Store uploaded files in `storage/app/public/course-summaries/`
- Generate unique filenames to prevent conflicts
- Support file types: PDF, DOC, DOCX, TXT
- Maximum file size: 10MB

## Authentication & Authorization

- All endpoints require authentication
- Users can only delete their own uploads
- Consider adding admin role for moderation

## Implementation Notes

1. **File Validation:** Validate file type and size before processing
2. **Search:** Use MySQL FULLTEXT search for better performance
3. **Pagination:** Add pagination for large result sets
4. **Rate Limiting:** Implement rate limiting for uploads
5. **Caching:** Cache frequently accessed data
6. **Error Handling:** Provide detailed error messages
7. **Logging:** Log all file operations for security

## Frontend Integration

The frontend is already configured to work with these endpoints. Once the backend is implemented, the Course Summaries page will automatically switch from sample data to real API data.

## Testing

Use the following test data to verify the implementation:

1. Upload a PDF file with all required fields
2. Search for uploaded content
3. Filter by type, subject, and level
4. Download the uploaded file
5. Update the course summary
6. Delete the course summary
7. Verify statistics endpoint

## Security Considerations

1. **File Upload Security:** Scan uploaded files for malware
2. **Access Control:** Ensure users can only access appropriate content
3. **Input Validation:** Sanitize all user inputs
4. **SQL Injection:** Use prepared statements
5. **XSS Prevention:** Escape output data
6. **CSRF Protection:** Implement CSRF tokens for state-changing operations
