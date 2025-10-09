# Sentry Next.js Integration Demo

A complete demonstration of Sentry error tracking and performance monitoring integration with Next.js 15.

## 🚀 Features

- **Error Tracking**: Automatic error capturing for client, server, and edge runtime
- **Performance Monitoring**: 100% trace sample rate with detailed performance insights
- **Session Replay**: Privacy-focused session recording with user interaction tracking
- **Environment Variables**: Team-friendly configuration with secure credential management
- **Test UI**: Interactive testing interface for Sentry features
- **Multiple Environments**: Configured for client-side, server-side, and edge runtime

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Sentry account (create at [sentry.io](https://sentry.io))

## 🛠️ Setup

### 1. Clone the Repository

```bash
git clone https://github.com/dingcodingco/sentry-nextjs-test.git
cd sentry-nextjs-test
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Sentry credentials:

```env
# Sentry DSN (Required for error tracking)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
SENTRY_DSN=your_sentry_dsn_here

# Build Configuration (Only required for production builds)
SENTRY_AUTH_TOKEN=your_sentry_auth_token_here
SENTRY_ORG=your_org_slug_here
SENTRY_PROJECT=your_project_slug_here
```

### 4. Get Your Sentry Credentials

1. **Create a Sentry Account**: Visit [sentry.io](https://sentry.io) and sign up
2. **Create a Project**: Choose "Next.js" as the platform
3. **Get Your DSN**:
   - Go to **Settings** → **Projects** → [Your Project] → **Client Keys (DSN)**
   - Copy the DSN URL
4. **Create Auth Token**:
   - Go to **Settings** → **Account** → **API** → **Auth Tokens**
   - Create a new token with `project:releases` and `org:read` scopes
5. **Find Organization Slug**: Check your Sentry dashboard URL (`https://[org-slug].sentry.io`)

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🧪 Testing Sentry Integration

The application includes a comprehensive testing interface at the home page:

### Error Testing
- **Test Caught Error**: Demonstrates error boundary and `Sentry.captureException()`
- **Test Uncaught Error**: Triggers an uncaught error to test automatic error reporting

### Custom Features
- **Send Message**: Test custom message logging with `Sentry.captureMessage()`
- **Add Breadcrumb**: Add debugging breadcrumbs for error context
- **Set Custom Context**: Add user context and custom tags

### Additional Test Pages
- **Todo App** (`/todo`): Client-side state management example
- **Server Component** (`/server-page`): Server-side rendering with error handling
- **API Routes**:
  - `/api/test-error`: Test server-side error capture
  - `/api/test-performance`: Test performance monitoring

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── test-error/         # Server-side error testing
│   │   └── test-performance/   # Performance monitoring testing
│   ├── server-page/            # Server component example
│   ├── todo/                   # Client-side app example
│   ├── layout.tsx              # Root layout with Sentry
│   └── page.tsx                # Main testing interface
├── instrumentation.ts          # Next.js instrumentation entry
├── instrumentation-client.ts   # Client-side Sentry config
├── sentry.server.config.ts     # Server-side Sentry config
├── sentry.edge.config.ts       # Edge runtime Sentry config
├── next.config.ts              # Next.js + Sentry build config
└── .env.example                # Environment variables template
```

## 🔧 Configuration

### Sentry Configuration Files

- **`instrumentation-client.ts`**: Client-side configuration with session replay
- **`sentry.server.config.ts`**: Server-side Node.js runtime configuration
- **`sentry.edge.config.ts`**: Edge runtime configuration (middleware, API routes at edge)
- **`next.config.ts`**: Build-time configuration for source map upload

### Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `NEXT_PUBLIC_SENTRY_DSN` | Client-side (browser) error reporting | **Yes** |
| `SENTRY_DSN` | Server-side and edge error reporting | **Yes** |
| `SENTRY_AUTH_TOKEN` | Build-time source map upload authentication | Only for `npm run build` |
| `SENTRY_ORG` | Organization identifier for source map upload | Only for `npm run build` |
| `SENTRY_PROJECT` | Project identifier for source map upload | Only for `npm run build` |

**Note**: For local development (`npm run dev`), you only need the two DSN variables. The AUTH_TOKEN and build config are only required when building for production.

## 🚢 Deployment

### Vercel Deployment

1. **Connect to Vercel**:
   ```bash
   vercel
   ```

2. **Add Environment Variables** in Vercel Dashboard:
   - Go to **Settings** → **Environment Variables**
   - Add all variables from `.env.local`

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Other Platforms

For other platforms (Netlify, AWS, etc.), ensure you:
1. Set all environment variables in your hosting platform
2. Run `npm run build` to generate production build
3. Source maps will be automatically uploaded to Sentry during build

## 📊 Monitoring

After deployment, monitor your application in Sentry:

1. **Issues**: View all errors and exceptions at `https://sentry.io/organizations/[org]/issues/`
2. **Performance**: Check performance metrics and traces
3. **Releases**: Track deployments and associate errors with specific releases
4. **Alerts**: Configure alerts for critical errors or performance degradation

## 🔗 GitHub Integration

To automatically resolve Sentry issues from commits:

1. Go to **Sentry Settings** → **Integrations** → **GitHub**
2. Install the GitHub integration
3. Connect your repository
4. Use commit messages like:
   ```
   git commit -m "Fix login bug - Fixes SENTRY-123"
   ```

## 🛡️ Security

- Never commit `.env.local` or any files containing real credentials
- DSN values can be public (they're designed to be client-facing)
- Keep `SENTRY_AUTH_TOKEN` private (used for source map uploads)
- Use environment-specific projects in Sentry (dev, staging, prod)

## 📚 Learn More

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry JavaScript SDK](https://docs.sentry.io/platforms/javascript/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Session Replay](https://docs.sentry.io/product/session-replay/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Credits

Built with:
- [Next.js 15](https://nextjs.org/) with Turbopack
- [@sentry/nextjs](https://www.npmjs.com/package/@sentry/nextjs)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Generated with [Claude Code](https://claude.com/claude-code)**
