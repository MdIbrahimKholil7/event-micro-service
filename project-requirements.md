# EventX — Scalable Ticketing & Live Streaming Platform

## Software Requirements Specification (SRS)

---

# 1. Project Overview

## 1.1 Project Name

EventX — Scalable Ticketing & Live Streaming Platform

---

## 1.2 Project Description

EventX is a cloud-native scalable platform that allows users to browse events, reserve seats, purchase tickets, and watch live or recorded event streams.

The platform must support:

* High traffic
* Distributed microservices
* Event-driven architecture
* Real-time communication
* CDN-based media delivery
* Production-grade monitoring and observability
* Kubernetes deployment

The platform should simulate real-world enterprise architecture similar to Ticketmaster, Netflix Live Events, and modern e-commerce systems.

---

# 2. Business Objectives

The primary goals of the platform are:

* Allow organizers to create and manage events
* Allow users to purchase event tickets securely
* Prevent double booking of seats
* Support large-scale concurrent users
* Enable live streaming access for paid users
* Deliver scalable media through CDN
* Provide monitoring and observability across all services
* Ensure high availability and fault tolerance

---

# 3. User Roles

## 3.1 Normal User

Capabilities:

* Register account
* Login/logout
* Browse events
* Reserve seats
* Purchase tickets
* Watch live streams
* Access purchased tickets
* Receive notifications
* View order history

---

## 3.2 Organizer

Capabilities:

* Create events
* Update event details
* Upload banners/media
* Configure seats
* Configure ticket pricing
* Start live streams
* View analytics dashboard
* Manage attendees

---

## 3.3 Admin

Capabilities:

* Manage all users
* Approve/reject organizers
* Block/unblock accounts
* Disable events
* Monitor platform metrics
* View logs and system health

---

# 4. System Architecture

## 4.1 Architecture Style

The platform must use:

* Microservices Architecture
* Event-Driven Architecture
* Distributed System Design
* API Gateway Pattern
* Saga Pattern for distributed transactions
* CQRS (optional bonus)

---

## 4.2 High-Level Architecture

Frontend → API Gateway → Microservices → Kafka → Databases

Services communicate asynchronously using Kafka events.

Each service owns its own database.

No shared databases are allowed.

---

# 5. Required Microservices

---

# 5.1 API Gateway Service

## Responsibilities

* Route frontend requests
* JWT validation
* Rate limiting
* Request logging
* Correlation ID generation
* API aggregation
* Request forwarding
* CORS handling

## Suggested Technologies

* NestJS
* Express Gateway
* Kong
* NGINX

---

# 5.2 Auth Service

## Responsibilities

* User registration
* Login
* Refresh token handling
* Logout
* Password reset
* Role management
* JWT generation

## Database

PostgreSQL

## APIs

* POST /auth/register
* POST /auth/login
* POST /auth/refresh
* POST /auth/logout
* POST /auth/forgot-password

---

# 5.3 User Service

## Responsibilities

* User profile management
* Organizer profile management
* User status management
* Avatar upload
* Account settings

## Database

PostgreSQL

---

# 5.4 Event Service

## Responsibilities

* Create event
* Update event
* Delete event
* Publish/unpublish event
* Event search
* Event filtering
* Upload event banner
* Event category management

## Database

MongoDB or PostgreSQL

## APIs

* POST /events
* GET /events
* GET /events/:id
* PATCH /events/:id
* DELETE /events/:id

---

# 5.5 Inventory / Seat Service

## Responsibilities

* Create seat map
* Lock seats temporarily
* Release expired locks
* Confirm booked seats
* Prevent double booking
* Seat availability updates

## Database

Redis + PostgreSQL

## Business Rules

* Seat lock expires after 5 minutes
* Only one user can lock a seat at a time
* Payment failure must release seat lock

---

# 5.6 Order Service

## Responsibilities

* Create pending orders
* Confirm orders
* Cancel orders
* Manage order lifecycle
* Handle Saga orchestration
* Maintain order history

## Database

PostgreSQL

## Order Status

* PENDING
* PROCESSING
* CONFIRMED
* FAILED
* CANCELLED

---

# 5.7 Payment Service

## Responsibilities

* Payment intent creation
* Payment processing
* Payment webhook handling
* Refund processing
* Idempotency support
* Payment status updates

## Database

PostgreSQL

## Requirements

* Integrate Stripe sandbox or mock provider
* Support webhook signature verification
* Payment retries must be idempotent

---

# 5.8 Ticket Service

## Responsibilities

* Generate tickets
* Generate QR codes
* Validate tickets
* Ticket cancellation
* Ticket scanning support

## Database

PostgreSQL

## Ticket Status

* ACTIVE
* USED
* CANCELLED

---

# 5.9 Streaming Service

## Responsibilities

* Upload video files
* Generate HLS streams
* Generate video chunks
* Stream access authorization
* Store media in S3-compatible storage
* Integrate CDN

## Requirements

* Only paid users can access streams
* Videos must be delivered through CDN
* Support recorded and live streaming

---

# 5.10 Notification Service

## Responsibilities

* Email notifications
* SMS notifications
* Real-time notifications
* Ticket confirmation emails
* Payment confirmation emails
* Event reminders

## Requirements

* Consume Kafka events asynchronously
* Retry failed notifications

---

# 5.11 Analytics Service

## Responsibilities

* Revenue tracking
* Ticket sales analytics
* User activity tracking
* Streaming watch time tracking
* Organizer dashboard statistics

## Requirements

* Real-time dashboard updates
* Aggregated metrics

---

# 6. Frontend Requirements

## Technology

* Next.js
* React
* TypeScript

---

## Required Pages

### Public Pages

* Home page
* Event listing page
* Event details page
* Login page
* Register page

### User Pages

* Seat selection page
* Checkout page
* Payment result page
* My tickets page
* Watch stream page
* User profile page

### Organizer Pages

* Organizer dashboard
* Event management page
* Analytics dashboard

### Admin Pages

* Admin dashboard
* User management page
* Event moderation page

---

## Frontend Features

* Responsive design
* Protected routes
* Real-time seat updates
* Real-time notifications
* Loading/error states
* Skeleton loaders
* Video streaming player
* CDN asset loading

---

# 7. Real-Time Features

The platform must use WebSocket or Socket.IO for:

* Live seat availability
* Booking updates
* Payment status updates
* Live stream chat
* Real-time notifications

---

# 8. Event-Driven Architecture

Kafka must be used for asynchronous communication.

---

## Required Kafka Events

* USER_REGISTERED
* EVENT_CREATED
* EVENT_UPDATED
* SEAT_LOCKED
* SEAT_LOCK_FAILED
* SEAT_RELEASED
* PAYMENT_INITIATED
* PAYMENT_SUCCESS
* PAYMENT_FAILED
* ORDER_CREATED
* ORDER_CONFIRMED
* ORDER_CANCELLED
* TICKET_GENERATED
* NOTIFICATION_REQUESTED
* STREAM_ACCESS_GRANTED

---

# 9. Booking Workflow

## Ticket Booking Flow

1. User selects event
2. User selects seat
3. Seat Service locks seat
4. Order Service creates pending order
5. Payment Service processes payment
6. Kafka emits PAYMENT_SUCCESS or PAYMENT_FAILED
7. If successful:

   * Order confirmed
   * Seat confirmed
   * Ticket generated
   * Notification sent
8. If failed:

   * Order cancelled
   * Seat released

The system must use Saga Pattern.

---

# 10. CDN Requirements

CDN must be used for:

* Frontend static assets
* Event images
* Recorded videos
* HLS video chunks

## Suggested CDN

* AWS CloudFront
* Cloudflare

## Media Flow

Browser → CDN → S3 / Object Storage

Backend should not directly stream large media files.

---

# 11. Database Requirements

## Service Databases

| Service         | Database              |
| --------------- | --------------------- |
| Auth Service    | PostgreSQL            |
| User Service    | PostgreSQL            |
| Event Service   | MongoDB/PostgreSQL    |
| Order Service   | PostgreSQL            |
| Payment Service | PostgreSQL            |
| Ticket Service  | PostgreSQL            |
| Seat Locking    | Redis                 |
| Analytics       | ClickHouse/PostgreSQL |
| Media Storage   | S3/MinIO              |

Each service must own its own database.

Direct database sharing between services is prohibited.

---

# 12. Observability Requirements

---

## 12.1 Logging

Requirements:

* Structured JSON logs
* Correlation IDs
* Centralized log storage

Suggested Stack:

* ELK Stack
* Loki

---

## 12.2 Metrics

Metrics to track:

* API latency
* Error rate
* Payment failure rate
* Kafka consumer lag
* CPU/memory usage
* Request throughput
* Order success/failure rate

Suggested Stack:

* Prometheus
* Grafana

---

## 12.3 Distributed Tracing

Requirements:

Trace full request lifecycle across services.

Example:

Frontend → API Gateway → Order Service → Payment Service → Kafka → Ticket Service

Suggested Stack:

* OpenTelemetry
* Jaeger
* Tempo

---

# 13. Deployment Requirements

## Containerization

All services must be containerized using Docker.

---

## Kubernetes Requirements

Each service must have:

* Deployment
* Service
* ConfigMap
* Secret
* Horizontal Pod Autoscaler
* Liveness probe
* Readiness probe
* Resource limits

---

## Infrastructure

Recommended AWS Services:

| Requirement    | AWS Service        |
| -------------- | ------------------ |
| Kubernetes     | EKS                |
| Database       | RDS                |
| Kafka          | MSK                |
| Redis          | ElastiCache        |
| Object Storage | S3                 |
| CDN            | CloudFront         |
| Monitoring     | CloudWatch/Grafana |

---

## Local Development

Local development environment must use Docker Compose.

Required local services:

* Kafka
* Zookeeper
* Redis
* PostgreSQL
* MongoDB
* MinIO

---

# 14. Security Requirements

The system must implement:

* JWT authentication
* Refresh token rotation
* Password hashing
* API rate limiting
* Input validation
* Role-based access control
* HTTPS
* Signed CDN URLs
* Secure payment webhook validation
* CORS protection

---

# 15. Non-Functional Requirements

| Requirement      | Value                |
| ---------------- | -------------------- |
| Concurrent Users | 10,000+              |
| Ticket Purchases | 1,000/minute         |
| Availability     | 99.9%                |
| API Latency      | <300ms               |
| Scalability      | Horizontal           |
| Fault Tolerance  | Required             |
| Consistency      | Eventual consistency |

---

# 16. CI/CD Requirements

The system must support automated CI/CD pipelines.

## Pipeline Stages

1. Code checkout
2. Dependency installation
3. Unit tests
4. Integration tests
5. Docker image build
6. Security scanning
7. Push image to registry
8. Kubernetes deployment
9. Smoke tests

## Suggested Tools

* GitHub Actions
* GitLab CI
* ArgoCD

---

# 17. Acceptance Criteria

The project will be considered complete when:

* User registration/login works
* Users can browse and book tickets
* Double booking is impossible
* Seat locking works correctly
* Failed payments release seats
* Successful payments generate tickets
* Ticket QR validation works
* Paid users can watch streams
* Unpaid users cannot access streams
* Kafka events work correctly
* Services communicate asynchronously
* CDN delivers media assets
* Monitoring dashboards are functional
* Logs and traces are visible
* System deploys successfully on Kubernetes

---

# 18. Final Deliverables

The engineer must provide:

1. Full source code
2. Docker Compose setup
3. Kubernetes manifests or Helm charts
4. API documentation
5. Kafka topic/event documentation
6. Database schemas
7. Architecture diagrams
8. Deployment guide
9. Monitoring dashboards
10. README documentation
11. Environment configuration guide
12. CI/CD pipeline configuration

---

# 19. Suggested Technology Stack

| Layer            | Technology             |
| ---------------- | ---------------------- |
| Frontend         | Next.js + TypeScript   |
| API Gateway      | NestJS / Kong          |
| Backend          | NestJS / Node.js       |
| Messaging        | Kafka                  |
| Database         | PostgreSQL + MongoDB   |
| Cache            | Redis                  |
| Storage          | AWS S3 / MinIO         |
| CDN              | CloudFront             |
| Containerization | Docker                 |
| Orchestration    | Kubernetes             |
| Monitoring       | Prometheus + Grafana   |
| Logging          | ELK Stack              |
| Tracing          | OpenTelemetry + Jaeger |

---

# 20. Future Enhancements

Optional future features:

* AI event recommendations
* Multi-region deployment
* Multi-currency support
* Multi-language support
* Fraud detection
* Recommendation engine
* Mobile application
* Offline ticket scanning
* Feature flags
* A/B testing

---

# END OF DOCUMENT
