# HireLens AI - Database Schema Documentation

## Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Job : "creates (recruiter)"
    User ||--o{ Application : "submits (candidate)"
    User ||--o{ Application : "reviews (recruiter)"
    User ||--o{ Interview : "participates (candidate)"
    User ||--o{ Interview : "conducts (recruiter)"
    User ||--o{ Feedback : "provides (interviewer)"
    User ||--o{ Assessment : "takes (candidate)"
    User ||--o{ Assessment : "assigns (recruiter)"
    User ||--o{ Offer : "receives (candidate)"
    User ||--o{ Offer : "extends (recruiter)"
    User ||--o{ Notification : "receives"
    User ||--o{ AuditLog : "performs"
    
    Company ||--o{ User : "employs"
    Company ||--o{ Job : "posts"
    Company ||--o{ Offer : "extends"
    
    Job ||--o{ Application : "receives"
    Job ||--o{ Interview : "schedules"
    Job ||--o{ Assessment : "requires"
    Job ||--o{ Offer : "associated with"
    
    Application ||--o| Interview : "has"
    Application ||--o| Feedback : "receives"
    Application ||--o| Assessment : "requires"
    Application ||--o| Offer : "leads to"
    
    Interview ||--o| Feedback : "receives"
    
    User {
        string _id PK
        string name
        string email UK
        string password
        string role
        string companyId FK
        object profile
        string avatar
        boolean isActive
        date lastLogin
        date createdAt
        date updatedAt
    }
    
    Company {
        string _id PK
        string name
        string slug UK
        string description
        string website
        string logo
        string industry
        string size
        string location
        number foundedYear
        object socialLinks
        object settings
        boolean isActive
        date createdAt
        date updatedAt
    }
    
    Job {
        string _id PK
        string title
        string slug UK
        string companyId FK
        string recruiterId FK
        string description
        string[] requirements
        string[] responsibilities
        string[] benefits
        string location
        string type
        string workMode
        object salary
        string department
        string experienceLevel
        string[] skills
        string status
        date publishedAt
        date expiresAt
        number applicationCount
        number viewCount
        object settings
        date createdAt
        date updatedAt
    }
    
    Application {
        string _id PK
        string jobId FK
        string candidateId FK
        string recruiterId FK
        string candidateName
        string candidateEmail
        object resume
        string resumeText
        string coverLetter
        object aiAnalysis
        string status
        string notes
        string source
        date appliedAt
        object[] statusHistory
        date createdAt
        date updatedAt
    }
    
    Interview {
        string _id PK
        string applicationId FK
        string jobId FK
        string candidateId FK
        string recruiterId FK
        string type
        string status
        date scheduledDate
        number duration
        string location
        string meetingLink
        string meetingId
        string meetingPassword
        object[] interviewers
        string notes
        string feedbackId FK
        boolean reminderSent
        date createdAt
        date updatedAt
    }
    
    Feedback {
        string _id PK
        string applicationId FK
        string interviewId FK
        string candidateId FK
        string interviewerId FK
        string type
        object rating
        string[] strengths
        string[] weaknesses
        string[] recommendations
        string notes
        boolean isHireRecommended
        boolean wouldProceed
        date createdAt
        date updatedAt
    }
    
    Assessment {
        string _id PK
        string applicationId FK
        string jobId FK
        string candidateId FK
        string recruiterId FK
        string type
        string title
        string description
        string instructions
        number timeLimit
        date deadline
        string status
        number score
        number maxScore
        number passingScore
        object[] questions
        object[] answers
        string submissionUrl
        string notes
        date startedAt
        date completedAt
        date createdAt
        date updatedAt
    }
    
    Offer {
        string _id PK
        string applicationId FK UK
        string jobId FK
        string candidateId FK
        string recruiterId FK
        string companyId FK
        string status
        object details
        object terms
        date expiryDate
        date sentAt
        date respondedAt
        string rejectionReason
        string notes
        string documentUrl
        date createdAt
        date updatedAt
    }
    
    Notification {
        string _id PK
        string userId FK
        string type
        string title
        string message
        string status
        string actionUrl
        object relatedId
        string priority
        object metadata
        date expiresAt
        date readAt
        date createdAt
        date updatedAt
    }
    
    AuditLog {
        string _id PK
        string userId FK
        string action
        string entity
        string entityId FK
        object details
        date timestamp
    }
```

## Model Descriptions

### User
Represents both candidates and recruiters in the system. Contains authentication credentials, profile information, and role-based access control.

**Key Features:**
- Password hashing with bcrypt
- Role-based access (candidate, recruiter, admin)
- Comprehensive profile with experience, education, and skills
- Company association for recruiters

**Indexes:**
- Email (unique)
- Role
- Company ID
- Created date (descending)

### Company
Represents organizations that post jobs and employ recruiters.

**Key Features:**
- Unique slug for URL-friendly identifiers
- Company size and industry classification
- Social media links
- Customizable settings for job posting

**Indexes:**
- Slug (unique)
- Name
- Industry
- Active status
- Created date (descending)

### Job
Represents job postings created by recruiters.

**Key Features:**
- Comprehensive job details (salary, location, type)
- Requirements, responsibilities, and benefits
- Skills matching for AI analysis
- Application and view tracking
- Status management (Open, Closed, Draft, Paused)

**Indexes:**
- Slug (unique)
- Company ID
- Recruiter ID
- Status
- Type and work mode
- Skills (for matching)
- Text search on title, description, location

### Application
Represents job applications submitted by candidates.

**Key Features:**
- Resume upload and text extraction
- AI-powered analysis with scoring
- Status tracking through hiring pipeline
- Status history for audit trail
- Cover letter support

**Indexes:**
- Job ID
- Candidate ID
- Recruiter ID
- Status
- AI score (descending)
- Applied date (descending)
- Composite unique index on Job ID + Candidate ID

### Interview
Represents scheduled interviews between candidates and recruiters.

**Key Features:**
- Multiple interview types (Phone, Video, On-site, Technical, Panel)
- Meeting link integration
- Multiple interviewers support
- Duration and location management
- Reminder tracking

**Indexes:**
- Application ID
- Job ID
- Candidate ID
- Recruiter ID
- Status
- Scheduled date

### Feedback
Represents feedback provided by interviewers after interviews.

**Key Features:**
- Multi-dimensional rating system
- Strengths and weaknesses tracking
- Hire recommendation
- Proceed decision tracking

**Indexes:**
- Application ID
- Interview ID
- Candidate ID
- Interviewer ID
- Feedback type
- Created date (descending)

### Assessment
Represents skills assessments assigned to candidates.

**Key Features:**
- Multiple assessment types (coding, quiz, personality, take-home, video)
- Time limits and deadlines
- Question and answer tracking
- Score calculation
- Submission URL for take-home assignments

**Indexes:**
- Application ID
- Job ID
- Candidate ID
- Recruiter ID
- Status
- Deadline
- Assessment type

### Offer
Represents job offers extended to candidates.

**Key Features:**
- Comprehensive offer details (salary, benefits, terms)
- Equity and bonus support
- Expiry date tracking
- Status management (Draft, Sent, Accepted, Rejected, Expired)
- Document attachment support

**Indexes:**
- Application ID (unique)
- Job ID
- Candidate ID
- Recruiter ID
- Company ID
- Status
- Expiry date

### Notification
Represents notifications sent to users about various events.

**Key Features:**
- Multiple notification types
- Priority levels
- Action URLs for deep linking
- Related entity tracking
- Auto-expiration with TTL index
- Read/unread status

**Indexes:**
- User ID
- Status
- Type
- Priority
- Created date (descending)
- Expiry date (TTL index - auto-delete after expiry)

### AuditLog
Represents audit trail for all system actions.

**Key Features:**
- Action tracking (create, read, update, delete, login, logout, export, import)
- Entity-level tracking
- IP and user agent logging
- Change tracking for updates
- Auto-expiration after 1 year

**Indexes:**
- User ID
- Action
- Entity
- Entity ID
- Timestamp (descending)
- Composite index on Entity + Entity ID + Action
- TTL index (auto-delete after 1 year)

## Relationships

### Primary Relationships
1. **User → Job**: One-to-many (recruiter creates multiple jobs)
2. **User → Application**: One-to-many (candidate submits multiple applications, recruiter reviews multiple applications)
3. **Company → Job**: One-to-many (company posts multiple jobs)
4. **Job → Application**: One-to-many (job receives multiple applications)
5. **Application → Interview**: One-to-one (application has one interview at a time)
6. **Application → Offer**: One-to-one (application leads to one offer)
7. **Interview → Feedback**: One-to-many (interview can have multiple feedback from different interviewers)

### Secondary Relationships
1. **User → Company**: Many-to-one (multiple users can belong to one company)
2. **Job → Interview**: One-to-many (job can have multiple interviews)
3. **Job → Assessment**: One-to-many (job can require multiple assessments)
4. **User → Notification**: One-to-many (user receives multiple notifications)
5. **User → AuditLog**: One-to-many (user performs multiple actions)

## Data Flow

### Candidate Flow
1. User registers as candidate
2. User browses jobs
3. User submits application with resume
4. AI analyzes resume against job requirements
5. Application moves through pipeline (Applied → Shortlisted → Interview → Offer → Hired/Rejected)
6. Interviews scheduled and feedback collected
7. Assessments assigned and completed
8. Offer extended if successful

### Recruiter Flow
1. User registers as recruiter (associated with company)
2. Recruiter creates job postings
3. Recruiter reviews applications
4. Recruiter schedules interviews
5. Recruiter collects feedback
6. Recruiter assigns assessments
7. Recruiter extends offers
8. All actions logged in audit trail

## Validation Rules

### User
- Email: Valid email format, unique
- Password: Minimum 6 characters
- Name: Maximum 100 characters
- Role: Must be one of [candidate, recruiter, admin]

### Company
- Name: Required, maximum 100 characters
- Slug: Required, unique, lowercase, alphanumeric with hyphens
- Website: Valid URL format
- Founded year: Between 1800 and current year

### Job
- Title: Required, maximum 100 characters
- Description: Required, 50-5000 characters
- Requirements: Required, at least one item
- Salary: Positive values for min/max
- Status: Must be one of [Open, Closed, Draft, Paused]

### Application
- One application per job per candidate (enforced by unique index)
- Resume: Required, maximum 10MB
- AI Score: Between 0-100
- Status: Must be one of valid pipeline stages

### Interview
- Duration: 15-480 minutes
- Scheduled date: Required
- Status: Must be one of [Scheduled, Completed, Cancelled, No-show]

### Assessment
- Time limit: 5-1440 minutes
- Score: 0-100 range
- Deadline: Required
- Status: Auto-updates to Expired if past deadline

### Offer
- Salary amount: Positive value
- Expiry date: Required
- Status: Auto-updates to Expired if past expiry date
- One offer per application (enforced by unique index)

## Security Considerations

1. **Password Hashing**: All passwords hashed with bcrypt (10 rounds)
2. **JWT Authentication**: Token-based authentication with 7-day expiry
3. **Role-Based Access**: API endpoints check user roles
4. **Audit Trail**: All critical actions logged with IP and user agent
5. **Data Isolation**: Users can only access their own data (candidates) or their assigned data (recruiters)
6. **Auto-Expiration**: Sensitive data (notifications, audit logs) auto-expires

## Performance Optimizations

1. **Indexing Strategy**: Comprehensive indexes on frequently queried fields
2. **TTL Indexes**: Auto-deletion of expired notifications and old audit logs
3. **Connection Pooling**: MongoDB connection caching via mongoose
4. **Population**: Efficient document population for related data
5. **Text Search**: Full-text search on job titles and descriptions
6. **Compound Indexes**: Optimized for common query patterns

## Environment Variables

Required environment variables:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `OPENAI_API_KEY`: OpenAI API key for AI analysis (optional, falls back to heuristic)

## Seed Data

The seed script creates:
- 3 companies (Northstar Labs, Runway Cloud, Metric Forge)
- 3 users (1 candidate, 1 recruiter, 1 admin)
- 3 jobs (Senior Product Designer, Senior Frontend Engineer, Revenue Operations Manager)
- 1 sample application with AI analysis
- 1 scheduled interview
- 1 feedback entry
- 1 assessment
- 2 notifications
- 2 audit log entries

Run seed script: `npm run seed`
