# Improvements Guide

This document provides step-by-step instructions for implementing the remaining improvements from the project assessment.

## 📋 Overview

The first three improvement areas have been completed and **applied to serverless API routes**:

- ✅ Security Concerns (validation, rate limiting, environment variables)
- ✅ Error Handling (standardized errors, logging)
- ✅ Code Quality (types, constants, removed console.logs)

**All improvements are now in the serverless architecture** (`src/lib/server/` and `src/routes/api/`).

This guide covers the remaining improvements (4-10) that need configuration and manual setup.

---

## 4. Testing Infrastructure

### Setup Testing Framework

#### Install Dependencies

```bash
# Frontend tests
npm install -D vitest @testing-library/svelte @testing-library/jest-dom jsdom
npm install -D @testing-library/user-event happy-dom

# Backend tests
cd backend
npm install -D jest @types/jest ts-jest supertest @types/supertest
```

#### Frontend Test Configuration

Create `vitest.config.ts` in the root:

```typescript
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./src/test/setup.ts']
	},
	resolve: {
		alias: {
			$lib: path.resolve(__dirname, './src/lib')
		}
	}
});
```

Create `src/test/setup.ts`:

```typescript
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock environment variables
vi.mock('$env/static/public', () => ({
	PUBLIC_SUPABASE_URL: 'http://localhost:54321',
	PUBLIC_SUPABASE_ANON_KEY: 'test-key'
}));
```

#### Serverless API Test Configuration

Create `src/lib/server/__tests__/` directory and add tests for serverless utilities:

```javascript
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
```

Create `backend/jest.setup.js`:

```javascript
// Mock environment variables
process.env.SUPABASE_URL = 'http://localhost:54321';
process.env.SUPABASE_ANON_KEY = 'test-key';
process.env.TELEGRAM_BOT_TOKEN = 'test-token';
```

#### Add Test Scripts

In `package.json` (root):

```json
{
	"scripts": {
		"test": "vitest",
		"test:ui": "vitest --ui",
		"test:coverage": "vitest --coverage"
	}
}
```

In `backend/package.json`:

```json
{
	"scripts": {
		"test": "jest",
		"test:watch": "jest --watch",
		"test:coverage": "jest --coverage"
	}
}
```

#### Example Test Files

Create `src/lib/stores/__tests__/auth.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { isAuthenticated, authUser, logout, loginDemo } from '../auth';

describe('auth store', () => {
	beforeEach(() => {
		logout();
	});

	it('should set authenticated state', () => {
		loginDemo({ username: 'test' });
		expect(get(isAuthenticated)).toBe(true);
		expect(get(authUser)).toEqual({ username: 'test' });
	});

	it('should logout', () => {
		loginDemo({ username: 'test' });
		logout();
		expect(get(isAuthenticated)).toBe(false);
		expect(get(authUser)).toBe(null);
	});
});
```

Create `backend/routes/__tests__/exams.test.js`:

```javascript
const request = require('supertest');
const express = require('express');
const examRoutes = require('../exams');

const app = express();
app.use(express.json());
app.use('/exams', examRoutes);

describe('GET /exams', () => {
	it('should return 400 for invalid courseId', async () => {
		const res = await request(app).get('/exams').query({ courseId: 'invalid-uuid' });

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty('ok', false);
	});
});
```

---

## 5. Performance Optimization

### Bundle Size Optimization

#### Analyze Bundle

```bash
npm run build
npx vite-bundle-visualizer
```

#### Configure Code Splitting

Update `vite.config.ts`:

```typescript
export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					'pdf-viewer': ['@pdftron/pdfjs-express-viewer'],
					supabase: ['@supabase/supabase-js'],
					telegram: ['telegraf']
				}
			}
		}
	}
});
```

### Image Optimization

#### Install Image Optimization Tools

```bash
npm install -D @sveltejs/enhanced-img sharp
```

#### Use Optimized Images

Replace `<img>` with optimized components:

```svelte
<script>
	import { EnhancedImage } from '@sveltejs/enhanced-img';
</script>

<EnhancedImage
	src="/images/thumbnail.jpg"
	alt="Course thumbnail"
	width={400}
	height={300}
	loading="lazy"
/>
```

### Caching Strategy

#### Add Cache Headers

For serverless functions, add cache headers directly in API routes:

```javascript
export function cacheControl(maxAge = 3600) {
	return (req, res, next) => {
		res.set('Cache-Control', `public, max-age=${maxAge}, immutable`);
		next();
	};
}
```

Apply to static routes:

```javascript
router.get('/courses', cacheControl(3600), asyncHandler(handler));
```

---

## 6. Documentation

### API Documentation with OpenAPI

#### Install Swagger

```bash
cd backend
npm install swagger-jsdoc swagger-ui-express
npm install -D @types/swagger-jsdoc @types/swagger-ui-express
```

#### Create Swagger Configuration

Create `backend/config/swagger.js`:

```javascript
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'FreshHub API',
			version: '1.0.0',
			description: 'API documentation for FreshHub learning platform'
		},
		servers: [
			{
				url: 'http://localhost:4000',
				description: 'Development server'
			}
		]
	},
	apis: ['./routes/**/*.js', './index.js']
};

export const swaggerSpec = swaggerJsdoc(options);
```

#### Add Swagger UI

In `backend/index.js`:

```javascript
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

#### Document Routes

Example in `backend/routes/exams.js`:

```javascript
/**
 * @swagger
 * /api/exams:
 *   get:
 *     summary: Get exams by course ID
 *     tags: [Exams]
 *     parameters:
 *       - in: query
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of exams
 */
export const GET: RequestHandler = ...;
```

### Component Documentation

Add JSDoc comments to components:

```svelte
<!--
@component ResourceCard
@description Displays a resource card with thumbnail and metadata
@prop {Resource} resource - The resource data to display
@prop {Function} onSelect - Callback when resource is selected
-->
<script>
	export let resource;
	export let onSelect;
</script>
```

---

## 7. Architecture Improvements

### Add Middleware Layer

Create `backend/middleware/index.js`:

```javascript
export { authMiddleware } from './auth.js';
export { validateRequest } from './validation.js';
export { logRequest } from './logging.js';
```

### Separate Business Logic

Create `backend/services/` directory:

```
backend/
  services/
    courseService.js
    examService.js
    resourceService.js
```

Move business logic from controllers to services:

```javascript
// services/examService.js
export async function getExamsByCourse(courseId) {
	// Business logic here
}

// controllers/exams.js
import { getExamsByCourse } from '../services/examService.js';
export async function getExams(req, res) {
	const exams = await getExamsByCourse(req.query.courseId);
	res.json({ ok: true, data: exams });
}
```

---

## 8. Scalability

### Implement Redis Caching

#### Install Redis

```bash
cd backend
npm install redis
npm install -D @types/redis
```

#### Create Cache Service

Create `backend/services/cacheService.js`:

```javascript
import { createClient } from 'redis';

const client = createClient({
	url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => console.error('Redis Client Error', err));

await client.connect();

export async function getCached(key) {
	const value = await client.get(key);
	return value ? JSON.parse(value) : null;
}

export async function setCached(key, value, ttl = 3600) {
	await client.setEx(key, JSON.stringify(value), ttl);
}

export { client };
```

#### Use in Routes

```javascript
import { getCached, setCached } from '../services/cacheService.js';

const cacheKey = `courses:${courseId}`;
let courses = await getCached(cacheKey);
if (!courses) {
	courses = await fetchCourses(courseId);
	await setCached(cacheKey, courses, 3600);
}
```

### Database Indexing

Add indexes in Supabase SQL editor:

```sql
-- Index for course lookups
CREATE INDEX idx_resources_course_id ON resources(course_id);

-- Index for exam lookups
CREATE INDEX idx_exams_course_id ON exams(course_id);

-- Index for user lookups
CREATE INDEX idx_users_username ON users(username);
```

---

## 9. Accessibility

### Add ARIA Labels

Update components:

```svelte
<button aria-label="Close modal" aria-describedby="modal-description" on:click={close}>
	Close
</button>
```

### Keyboard Navigation

Add keyboard handlers:

```svelte
<script>
	function handleKeydown(event) {
		if (event.key === 'Escape') {
			close();
		}
	}
</script>

<div onkeydown={handleKeydown} tabindex="0">
	<!-- content -->
</div>
```

### Screen Reader Support

Add semantic HTML:

```svelte
<nav aria-label="Main navigation">
	<ul role="list">
		<li role="listitem">
			<a href="/courses">Courses</a>
		</li>
	</ul>
</nav>
```

### Install Accessibility Testing

```bash
npm install -D @axe-core/playwright eslint-plugin-jsx-a11y
```

---

## 10. Monitoring & Observability

### Error Tracking with Sentry

#### Install Sentry

```bash
# Frontend
npm install @sentry/sveltekit

# Backend
cd backend
npm install @sentry/node
```

#### Frontend Setup (already configured for serverless)

Create `src/lib/sentry.ts`:

```typescript
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
	dsn: import.meta.env.VITE_SENTRY_DSN,
	environment: import.meta.env.MODE,
	tracesSampleRate: 1.0
});
```

Update `src/hooks.client.ts`:

```typescript
import '../lib/sentry';
```

#### Serverless API Setup

For SvelteKit serverless functions, Sentry integrates differently. Add to `src/hooks.server.ts`:

```typescript
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
	dsn: import.meta.env.SENTRY_DSN,
	environment: import.meta.env.NODE_ENV,
	tracesSampleRate: 1.0
});

// Error handling is already in src/lib/server/errors.ts
// Sentry will capture errors automatically via hooks
```

### Analytics

#### Install Analytics Library

```bash
npm install posthog-js
```

#### Setup Analytics

```typescript
// src/lib/analytics.ts
import posthog from 'posthog-js';

if (typeof window !== 'undefined') {
	posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
		api_host: 'https://app.posthog.com'
	});
}

export { posthog };
```

### Logging Service

#### Use Winston for Backend

```bash
cd backend
npm install winston
```

Create `backend/utils/winston.js`:

```javascript
import winston from 'winston';

export const logger = winston.createLogger({
	level: process.env.LOG_LEVEL || 'info',
	format: winston.format.json(),
	transports: [
		new winston.transports.File({ filename: 'error.log', level: 'error' }),
		new winston.transports.File({ filename: 'combined.log' })
	]
});

if (process.env.NODE_ENV !== 'production') {
	logger.add(
		new winston.transports.Console({
			format: winston.format.simple()
		})
	);
}
```

---

## 🚀 Quick Start Checklist

- [ ] Install testing dependencies and create test files
- [ ] Configure bundle optimization
- [ ] Set up Swagger/OpenAPI documentation
- [ ] Implement Redis caching
- [ ] Add database indexes
- [ ] Improve accessibility (ARIA labels, keyboard nav)
- [ ] Set up Sentry for error tracking
- [ ] Configure analytics
- [ ] Set up Winston logging

---

## 📝 Environment Variables to Add

Add these to your `.env` files:

```env
# Error Tracking
SENTRY_DSN=your_sentry_dsn
VITE_SENTRY_DSN=your_frontend_sentry_dsn

# Analytics
VITE_POSTHOG_KEY=your_posthog_key

# Caching
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=INFO
```

---

_For detailed implementation of any section, refer to the specific tool documentation or ask for help with specific configurations._
