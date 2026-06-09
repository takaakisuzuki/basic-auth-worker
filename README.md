# basic-auth-worker

A lightweight **Basic authentication proxy** that runs on Cloudflare Workers.
It requires Basic auth for requests bound to a route and proxies only authenticated requests to the origin. Useful when you want to quickly add access control to a static origin or an internal site without changing its code.

## Features

- Runs on Cloudflare Workers (no extra server required)
- Validates the `Authorization: Basic` header and returns `401 + WWW-Authenticate` when unauthenticated
- Credentials are managed via Wrangler Secrets (never committed to the repo)
- Handles passwords that contain `:`

## How it works

It decodes the request's `Authorization` header and compares it against `BASIC_AUTH_USER` / `BASIC_AUTH_PASS`.

- On success: proxies straight to the origin via `fetch(request)`
- On failure / missing header: returns `401 Unauthorized`

See `src/index.ts` for the implementation.

## Requirements

- Node.js / npm
- A Cloudflare account and [Wrangler](https://developers.cloudflare.com/workers/wrangler/)
- A target zone (adjust `routes` in `wrangler.jsonc` to your environment)

## Setup

```bash
npm install
```

Prepare local environment variables (copy `.dev.vars.example`).

```bash
cp .dev.vars.example .dev.vars
# Edit .dev.vars to set your credentials
```

## Local development

```bash
npm run dev
```

## Deploy

1. Update `account_id` and `routes` in `wrangler.jsonc` to match your environment.

2. Set production secrets (`.dev.vars` is not applied to production).

   ```bash
   npx wrangler secret put BASIC_AUTH_USER
   npx wrangler secret put BASIC_AUTH_PASS
   ```

3. Deploy.

   ```bash
   npm run deploy
   ```

## Configuration

| Variable | Description |
| --- | --- |
| `BASIC_AUTH_USER` | Basic auth username |
| `BASIC_AUTH_PASS` | Basic auth password |

In `wrangler.jsonc`, use `routes` to specify the pattern the Worker is bound to (e.g. `example.com/*`).

## Generating types

To generate/synchronize types based on your Worker configuration:

```bash
npm run cf-typegen
```
