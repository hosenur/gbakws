# Agent Instructions

## Build/Lint/Test Commands

- `bun run build` - Build all packages/apps with Turbo
- `bun run lint` - Lint all packages/apps with Turbo
- `bun run check-types` - Type check all packages/apps with Turbo
- `bun run format` - Format code with Prettier

### Per-app commands:

Admin app:

- `bun run test` - Run tests with Vitest
- `bun run lint` - Lint with Biome
- `bun run check` - Check with Biome

Engine app:

- `bun run test` - Run tests with Bun test
- `bun run db:push` - Push database schema
- `bun run db:studio` - Open Prisma Studio
- `bun run db:generate` - Generate Prisma client

### Run a single test:

- `bun test path/to/test-file.test.ts` (for engine)
- `bun test --run path/to/test-file.test.ts` (for admin)

## Code Style Guidelines

- Use Bun as the runtime (not Node.js)
- Use Biome for formatting/linting in admin app, follows biome.json config
- Use tabs for indentation in admin app
- Use double quotes for strings
- Organize imports automatically with Biome
- Use TypeScript with strict typing
- Follow existing naming conventions (camelCase for variables/functions, PascalCase for components/types)
- Use Zod for validation schemas
- Use TanStack Form for forms
- Use TanStack Query with tRPC for data fetching
- Query syntax pattern: `const { data: causes } = useQuery(trpc.cause.all.queryOptions());`
- Mutation syntax pattern:

```
const create = useMutation(trpc.cause.create.mutationOptions());
const form = useForm({
  defaultValues: {
    title: cause?.title || "",
    slug: cause?.slug || "",
    description: cause?.description || "",
  },
  validationLogic: revalidateLogic(),
  validators: {
    onDynamic: causeSchema,
  },
  onSubmit: async ({ value }) => {
    console.log("Form submitted:", value);
    create.mutate(value);
  },
});
```

- Handle errors with try/catch and proper error messages
- Use absolute imports with @ aliases where configured
- Follow existing component patterns in ui package

## Important

- DO NOT run any dev servers (`bun run dev`, `bun --hot`, etc.)
- DO NOT make changes to database schema without explicit instruction
- DO NOT commit sensitive information
