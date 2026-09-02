---
applyTo: "src/**/*.ts"
description: "Instructions for backend API TypeScript files"
---

## General Backend Principles
- Use async/await for asynchronous operations
- Follow RESTful API design principles
- Ensure proper error handling and logging
- Never log secrets or sensitive information
- Validate all incoming request data

## Express.js Best Practices

### Middleware
- Use `express.json()` for parsing JSON request bodies
- Apply middleware in the correct order (error handlers last)
- Create reusable middleware for common functionality (auth, validation, logging)
- Use `next()` to pass control to the next middleware
- Implement centralized error handling middleware
- Keep middleware functions focused and single-purpose

### Routing
- Organize routes by resource/feature in separate files
- Use Express Router for modular route handlers
- Group related routes under common prefixes (e.g., `/api/v1`)
- Use route parameters for dynamic segments (`:id`)
- Implement proper HTTP status codes (200, 201, 400, 404, 500, etc.)
- Return consistent JSON response formats

### Error Handling
- Wrap async controllers with `asyncHandler` so rejected promises reach the global error handler.
- Do not use try/catch to swallow errors in controllers — let them bubble.
- Implement global error handling middleware
- Return meaningful error messages (without exposing internals)
- Log errors with appropriate severity levels
- Handle unhandled promise rejections and uncaught exceptions

### Request Validation
- Validate request body, params, and query parameters
- Use early returns for validation failures
- Provide clear validation error messages
- Sanitize user input to prevent injection attacks
- Validate data types, required fields, and constraints
- Use Zod schemas (`src/schemas/`) for request validation — not Joi or express-validator

### Response Handling
- Use appropriate HTTP status codes for all responses
- Return consistent JSON structure across endpoints
- Include metadata in list responses (pagination, counts)
- Use `res.json()` for JSON responses
- Set proper response headers (Content-Type, Cache-Control)
- Avoid sending sensitive data in responses

### Security
- Use helmet.js for security headers
- Implement rate limiting to prevent abuse
- Use CORS appropriately (don't use `*` in production)
- Sanitize and validate all user input
- Implement proper authentication and authorization
- Store secrets in environment variables
- Use HTTPS in production

### Performance
- Use compression middleware for response compression
- Cache responses where appropriate
- Avoid blocking the event loop
- Use streaming for large data transfers
- Implement pagination for large datasets

### Code Organization
- Separate concerns: routes, controllers, services, models
- Keep route handlers thin (delegate to services)
- Use dependency injection for testability
- Create reusable utility functions
- Follow consistent naming conventions
- Document complex business logic

### Environment & Configuration
- Use environment variables for configuration
- Never commit secrets or API keys
- Provide default values for optional config
- Validate required environment variables on startup
- Use different configs for dev/test/production
- Store configuration in `.env` files (gitignored)

### Testing
- Write unit tests for business logic
- Write integration tests for API endpoints
- Mock external dependencies in tests
- Test error scenarios and edge cases
- Use descriptive test names
- Maintain high test coverage

### Logging
- Use structured logging (JSON format)
- Log at appropriate levels (error, warn, info, debug)
- Include request IDs for tracing
- Log request/response for debugging (excluding sensitive data)
- Use logging libraries (winston, pino, bunyan)
- Implement log rotation and retention policies