This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

Development helper: to reset `product` table and seed 4 sample products (dev only), start the backend with `ALLOW_RESET_PRODUCTS=1` and POST to `/dev/reset-products`. The seeded products expect their images to be placed in `public/shopping/` with names (SVG placeholders already provided in this repo):
- `cat-bed.svg`
- `double-bowl.svg`
- `cat-sweater.svg`
- `cheese-house.svg`

If you want to seed the database using these images, start the backend with `ALLOW_RESET_PRODUCTS=1` and POST to `/dev/reset-products`.
- POST an empty JSON array `[]` → clears the `product` table (delete all rows).
- POST a non-empty array → replaces all rows with the provided list.
If you don't run the reset, the UI will show `public/shopping/placeholder.svg`.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
