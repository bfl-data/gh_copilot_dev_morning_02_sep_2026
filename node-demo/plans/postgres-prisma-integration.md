# PostgreSQL and Prisma Integration Plan

Replace the demo-only in-memory auth and profile maps with a single PostgreSQL-backed Prisma `User` model. Add a repository and services so controllers remain HTTP-focused, preserve existing profile route behavior, and intentionally extend registration to require `displayName`.

## Progress

- Completed: added `@prisma/client@^7.10.0` to runtime dependencies and `prisma@^7.10.0` to development dependencies.
- Pending: Prisma scripts, configuration, schema, migrations, client setup, application refactor, tests, and documentation.

## Steps

1. Establish the persistence contract. Add `prisma/schema.prisma` with PostgreSQL as the datasource and a single `User` model: UUID `id`, unique `email`, required `displayName`, `passwordHash`, `createdAt`, and `updatedAt`. Keep UUID generation to preserve the public parameter format accepted by `userIdParamSchema`. Generate and commit the initial Prisma migration under `prisma/migrations/`.
2. Add dependencies and configuration. Completed: `@prisma/client@^7.10.0` and `prisma@^7.10.0` are installed. Pending: add scripts for client generation, development migration, production deployment migration, and Prisma Studio. Update `src/config.ts` as the only `process.env` reader with a required `databaseUrl`; document `DATABASE_URL` in `.env.example`, while keeping real credentials out of version control.
3. Introduce Prisma infrastructure. Create `src/lib/prisma.ts` exporting the shared `PrismaClient` configured from `config.databaseUrl`; ensure the generated client is available before build, development, and test workflows. Add clean shutdown handling in `src/index.ts` that disconnects the client after application shutdown, without creating per-request client instances.
4. Define persistence boundaries. Create `src/repositories/user-repository.ts` with explicit methods for `create`, `findById`, `findByEmail`, `update`, `deleteById`, and `list`. Map Prisma `Date` values to the existing API's ISO timestamp string shape at this boundary or in services. The repository owns Prisma queries only and does not interact with Express responses.
5. Move business workflows into services. Create `src/services/user-service.ts` for profile CRUD and `src/services/auth-service.ts` for registration/login. The auth service uses `hashPassword` and `verifyPassword`, and the user repository, never exposing `passwordHash`. A registration creates a fully populated canonical user. Enforce duplicate email checks and handle Prisma's unique-constraint failure so concurrent registrations still produce a conflict outcome.
6. Refactor request validation and controllers. Extend `src/schemas/user-schema.ts` with a registration schema requiring valid `email`, secure password constraints agreed by the project, and trimmed `displayName`. Refactor `src/controllers/auth-controller.ts` to parse that schema and delegate to `authService`; refactor `src/controllers/user-controller.ts` to delegate to `userService`. Remove both module-level Maps. Retain profile endpoint statuses and envelopes; update auth errors to the standard structured error envelope only if API compatibility is explicitly accepted, otherwise preserve their present `{ error: string }` shape.
7. Add centralized persistence error mapping. Add an error type or error middleware mapping for expected conditions: invalid Zod input to existing `400 VALIDATION_FAILED`, duplicate email to `409`, missing user to existing `404 USER_NOT_FOUND`, bad login credentials to generic `401`, and unexpected Prisma failures to the existing generic `500` response. Do not leak connection strings, SQL, password hashes, or Prisma internals.
8. Update unit tests in parallel with the refactor. Add `src/repositories/user-repository.test.ts` by mocking `src/lib/prisma.ts`, covering each query mapping and expected database behavior. Update `src/controllers/user-controller.test.ts` to mock the user service or repository rather than depend on a process-level store. Add `src/controllers/auth-controller.test.ts` and service tests, mocking the repository and password service to cover successful registration/login, duplicate registration, missing fields, invalid data, unknown emails, and bad passwords. Follow the project's deterministic Vitest rule: no real database or network calls in automated tests.
9. Document local operations. Update `README.md` with PostgreSQL prerequisite/setup instructions for an existing local install, environment configuration, `prisma migrate dev`, Prisma client generation, migration deployment, Studio usage, and how to run checks. State clearly that migrations are the schema source of truth and that database state replaces the old process-local demo state.

## Relevant Files

- `package.json`: Prisma dependencies and lifecycle scripts.
- `prisma/schema.prisma`: PostgreSQL datasource, generator, and canonical `User` model.
- `prisma/migrations/`: generated initial migration.
- `.env.example`: non-secret database URL template.
- `src/config.ts`: controlled `DATABASE_URL` access.
- `src/lib/prisma.ts`: shared Prisma client.
- `src/repositories/user-repository.ts`: dedicated data access layer.
- `src/services/user-service.ts` and `src/services/auth-service.ts`: business workflows.
- `src/controllers/auth-controller.ts` and `src/controllers/user-controller.ts`: thin HTTP orchestration after removal of Maps.
- `src/schemas/user-schema.ts`: registration validation.
- `src/index.ts`: global error mapping and clean Prisma shutdown.
- `src/**/*.test.ts`: updated and new mocked Vitest coverage.
- `README.md`: local installation and migration documentation.

## Verification

1. Configure a non-production local `DATABASE_URL`, run Prisma client generation, run the initial migration, and inspect the schema with Prisma Studio.
2. Run `npm test` to verify mocked repository, service, and controller paths, including validation, duplicate email, missing user, and generic authentication failure responses.
3. Run `npm run typecheck` and `npm run build` to validate generated Prisma types and ESM imports.
4. Start the service using `npm run dev`, register a user with `email`, `password`, and `displayName`, then restart it and confirm the same user remains available through `GET /users/:id` and can log in.
5. Verify output bodies never contain `passwordHash`; inspect logs and errors to ensure connection details and credentials are not exposed.

## Decisions

- Use PostgreSQL through Prisma, targeting an existing local PostgreSQL installation; no Docker Compose work is included.
- Consolidate the separate auth and profile maps into one canonical `User` model.
- Change `POST /auth/register` to require `displayName`; this is an intentional request-contract change and requires documentation and tests.
- Unit tests mock Prisma. Real-database integration tests are deliberately excluded to comply with the repository's deterministic, no-real-database test instructions.
- No data migration is necessary because present data is process-local and is discarded on restart.

## Scope Boundaries

- Included: user/auth persistence, schema/migrations, configuration, error handling, unit tests, and documentation.
- Excluded: Docker provisioning, managed PostgreSQL deployment, user sessions/JWTs, authorization, production secret management infrastructure, and backfilling existing data.