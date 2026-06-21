# Clean Code Notes For This Project

Source read: `C:\Users\Hp\Downloads\clean-code.pdf`.

These notes are a short project-level summary, not a reproduction of the book.

## Working Standard

- Leave the codebase cleaner than it was before the change.
- Prefer obvious code over clever code.
- Make behavior explicit at boundaries: forms, database calls, email delivery, images, and deployment config.
- Keep public pages fast and simple; move complexity into small server-side modules.
- Do not hide broken behavior behind vague fallbacks.

## Names

- Use names that describe intent, not implementation trivia.
- Avoid abbreviations unless they are already standard in the codebase.
- Use one word per concept. For example, do not mix `application`, `inquiry`, and `submission` for the same domain object unless they mean different things.
- Name functions after what they do: `submitInquiryAction`, `normalizeTrackLabel`, `resolveInquiryType`.
- Name booleans as clear states: `isSubmitting`, `hasError`, `isVisible`.

## Functions

- Keep functions small and focused on one job.
- Avoid flag arguments that make a function do multiple things.
- Keep each function at one level of abstraction.
- Extract validation, formatting, persistence, and notification logic into separate helpers.
- Prefer explicit inputs and return values over hidden mutation.

## Components

- Keep route pages mostly about layout and composition.
- Put reusable UI into components.
- Put domain rules into `src/lib/*` or server actions, not directly inside JSX.
- Push client components down to the smallest interactive surface.
- Avoid client-only behavior for content that should be visible on first load.

## Comments

- Use comments only when they explain intent, tradeoffs, or non-obvious constraints.
- Do not comment what the code already says.
- Remove commented-out code.
- Prefer clearer names and extracted functions over explanatory comments.

## Error Handling

- Surface failures clearly at user-facing boundaries.
- Add context when logging errors.
- Do not swallow database, email, or form errors silently.
- Avoid returning `null` for exceptional cases when a typed result or thrown error is clearer.
- Keep error handling focused; do not mix unrelated work inside catch blocks.

## Data And Boundaries

- Validate all form data on the server.
- Treat third-party services as boundaries: Resend, Neon, Turnstile, Sentry, and any future payment provider.
- Wrap third-party clients in small local modules.
- Keep database client initialization lazy so builds do not fail when environment variables are unavailable.
- Keep schema names aligned with the business language.

## Tests And Verification

- Run `npm run lint` and `npm run build` before deploy-related changes.
- Add focused tests when logic becomes non-trivial: validation, track normalization, inquiry type resolution, email payload building.
- Test boundary conditions near previous bugs.
- Keep tests readable and fast.

## Refactoring

- Make the code work first, then make it clear.
- Refactor in small steps with a passing build between risky changes.
- Remove duplication when it appears in real behavior, not just because two lines look similar.
- Avoid large rewrites when a precise fix solves the problem.

## Code Smells To Watch

- A route file doing validation, persistence, notification, and layout together.
- Components that only work after hydration when the content should be server-rendered.
- Generic names like `data`, `item`, `thing`, or `handleSubmit` in complex domains.
- Hidden dependency on runtime order.
- Magic strings repeated across forms, schema, and content.
- Broad catch blocks that return success-shaped responses.
- Inconsistent status names across database, UI, and email copy.

## Project-Specific Application

- For the Apply flow, keep server-backed inquiry capture separate from the visual form.
- For deployment, keep build steps reproducible and avoid external fetches where possible.
- For backend work, prefer a small schema and focused Server Actions before adding admin, payments, or booking logic.
- For UI work, preserve visible first render and avoid permanent loading states.
