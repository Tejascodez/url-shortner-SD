# URL Shortener

A full-stack URL shortener built with Spring Boot, React, PostgreSQL, Redis, and Docker.

## Features

- Shorten long URLs to clean, shareable links
- Instant redirect via short codes
- Click analytics tracking per link
- Redis caching for fast redirects
- Automatic URL expiration (30-day default)

## Tech Stack

**Backend**
- Java + Spring Boot
- Spring Data JPA
- PostgreSQL
- Redis
- Docker

**Frontend**
- React + Vite
- Tailwind CSS
- Axios

## Architecture

```
React Frontend
      ↓
Spring Boot REST API
      ↓
Redis Cache Layer
      ↓
PostgreSQL Database
```

On every redirect, the backend checks Redis first. On a cache miss it reads from PostgreSQL, increments the click count, and caches the result for 24 hours.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/url/shorten` | Shorten a URL |
| `GET` | `/{shortCode}` | Redirect to original URL |
| `GET` | `/api/url/{shortCode}/analytics` | Get click analytics |

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- Docker

### Run with Docker

```bash
docker-compose up
```

### Run locally

**Backend**
```bash
./mvnw spring-boot:run
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and the API on `http://localhost:8080`.

## Author

**Tejas Patil**
