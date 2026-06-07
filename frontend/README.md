# Solander 38 website UI

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

- [Next.js Documentation](https://nextjs.org/docs)
- [the Next.js GitHub repository](https://github.com/vercel/next.js)

## Local development

### Add .env file
Copy `.env.example` to `.env` and fill in the values. Project ID: [sanity.io/manage](https://sanity.io/manage) → Rising Tide Research Foundation. Read token: Sanity → API → Tokens.

### Install dependencies and run locally
```bash
yarn install
```

```bash
npm run dev
```

This will serve the project from [http://localhost:3000](http://localhost:3000).

### Dev notes
`page.tsx` is a reserved filename used in routing, e.g. `anatomy/[slug]/page.tsx`.
