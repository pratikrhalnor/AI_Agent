# 🤖 AgentHub - AI Agent SaaS Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![WorkOS](https://img.shields.io/badge/WorkOS-AuthKit-blue?style=flat-square)](https://workos.com/)
[![Nango](https://img.shields.io/badge/Nango-OAuth-green?style=flat-square)](https://nango.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square)](https://www.typescriptlang.org/)

**AgentHub** is a full-featured SaaS application for AI agent interactions with enterprise-grade authentication, real-time integrations, and comprehensive audit logging.

## ✨ Features

- 🔐 **Enterprise Authentication** - Powered by WorkOS AuthKit
- 🔌 **Real-time Integrations** - Connect GitHub, Slack, Gmail, Google Calendar via Nango
- 🤖 **AI Agent Chat** - Interactive chat interface with file upload support
- 📊 **Dashboard** - Real-time analytics and activity monitoring
- 📝 **Audit Logs** - Comprehensive user activity tracking with WorkOS
- 🎨 **Modern UI** - Clean, minimalistic design with Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm or yarn
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/saas-agent-app.git
cd saas-agent-app
```

### 2. Set Up Nango (Self-Hosted)

Nango handles OAuth connections for integrations.

```bash
# Clone Nango repository
git clone https://github.com/NangoHQ/nango.git
cd nango

# Create .env file with required variables
cat > .env << 'EOF'
NANGO_ENCRYPTION_KEY=abcdefghijklmnopqrstuvwxyz123456
NANGO_DB_USER=nango
NANGO_DB_PASSWORD=nango
NANGO_DB_NAME=nango
NANGO_DB_HOST=nango-db
NANGO_DB_SSL=false
NANGO_DB_PORT=5432
NANGO_SERVER_URL=http://localhost:3003
NANGO_PUBLIC_SERVER_URL=http://localhost:3003
SERVER_PORT=8080
CONNECT_UI_PORT=3009
NANGO_DASHBOARD_USERNAME=admin
NANGO_DASHBOARD_PASSWORD=admin123
FLAG_SERVE_CONNECT_UI=true
NANGO_LOGS_ENABLED=false
LOG_LEVEL=info
EOF

# Start Nango with Docker Compose
docker-compose up -d

# Wait for Nango to initialize (30 seconds)
sleep 30

# Verify Nango is running
curl http://localhost:3003/health
# Should return: {"status":"ok"}
```

#### Nango Dashboard Access

Open your browser and go to: `http://localhost:3003`

Login with:
- **Username:** admin
- **Password:** admin123
  
#### If it is not working then try to signup using mail id.

> **Note:** Since there's no SMTP server configured, the email verification link will appear in your terminal logs when you sign up.

### 3. Configure Nango Integrations

1. Go to **Integrations** in Nango Dashboard
2. Click **"Add Integration"**
3. Select a provider (GitHub, Slack, Gmail, Google Calendar)
4. Get OAuth credentials from the provider's developer portal:
   - **GitHub:** GitHub Developer Settings → OAuth Apps
   - **Slack:** Slack API → Your App → OAuth & Permissions
   - **Gmail:** Google Cloud Console → APIs & Services → Credentials
   - **Google Calendar:** Same as Gmail
5. Enter Client ID and Client Secret
6. Configure required scopes
7. Save the integration

### 4. Set Up WorkOS

1. Go to [WorkOS Dashboard](https://dashboard.workos.com)
2. Sign up/Login to your account
3. Navigate to **Authentication → Connections**
4. Enable **Email + Password** authentication
5. Go to **Authentication → Redirects**
6. Add: `http://localhost:3000/api/auth/callback`

#### Get WorkOS Credentials

1. Go to **API Keys** in WorkOS Dashboard
2. Copy:
   - **Client ID** (starts with `client_`)
   - **Secret Key** (starts with `sk_test_`)

### 5. Configure Environment Variables

Create `.env.local` in the project root:

```env
# WorkOS Configuration
WORKOS_CLIENT_ID="client_xxxxxxxxxxxx"
WORKOS_API_KEY="sk_test_xxxxxxxxxxxx"
WORKOS_COOKIE_PASSWORD="your-32-character-password"
WORKOS_REDIRECT_URI="http://localhost:3000/api/auth/callback"
WORKOS_COOKIE_MAX_AGE="86400"
WORKOS_ORG_ID="org_xxxxxxxxxxxx"

NEXT_PUBLIC_WORKOS_CLIENT_ID="client_xxxxxxxxxxxx"
NEXT_PUBLIC_WORKOS_REDIRECT_URI="http://localhost:3000/api/auth/callback"

# Nango Configuration
NANGO_HOSTED_URL="http://localhost:3003"
NANGO_SECRET_KEY="your-nango-api-key"
NEXT_PUBLIC_NANGO_PUBLIC_KEY="your-nango-api-key"
```

#### Generate 32-Byte Encryption Key

```bash
openssl rand -base64 32
# Example output: 8xYz3mXgQ3pFh5vN8wK7mR4tE2uJ6oP9=
```

### 6. Install Dependencies and Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open `http://localhost:3000` in your browser.

### 7. Set Up Audit Logs (Optional)

1. Go to **WorkOS Dashboard → Audit Logs**
2. Click **"Create an event"** for each action:

| Action | Target Types |
|--------|--------------|
| user.signed_in | team |
| user.signed_out | team |
| integration.connected | team, integration |
| integration.disconnected | team, integration |
| agent.message_sent | team |

## 🏗️ Project Structure

```
saas-agent-app/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   └── login/
│   ├── (dashboard)/         # Dashboard pages
│   │   ├── agent/          # AI Agent chat
│   │   ├── dashboard/      # Dashboard overview
│   │   ├── integrations/   # Nango integrations
│   │   └── setting/        # Settings page
│   ├── api/                 # API routes
│   │   ├── auth/           # WorkOS auth endpoints
│   │   └── nango/          # Nango integration endpoints
│   └── layout.tsx          # Root layout
├── components/
│   ├── layout/             # Layout components
│   └── ui/                 # UI components
├── config/                 # Configuration files
├── services/               # Service layer
│   ├── auditLog.ts        # Audit logging service
│   └── nango.ts           # Nango integration service
└── types/                  # TypeScript types
```

## 🔧 Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 16 | React framework with App Router |
| TypeScript | Type-safe JavaScript |
| Tailwind CSS | Styling |
| WorkOS AuthKit | Enterprise authentication |
| Nango | OAuth integration management |
| Lucide React | Icons |

## 🔒 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| WORKOS_CLIENT_ID | WorkOS Client ID | Yes |
| WORKOS_API_KEY | WorkOS API Key | Yes |
| WORKOS_COOKIE_PASSWORD | 32-byte encryption key | Yes |
| WORKOS_REDIRECT_URI | Auth callback URL | Yes |
| WORKOS_ORG_ID | Organization ID | For Audit Logs |
| NANGO_HOSTED_URL | Nango server URL | Yes |
| NANGO_SECRET_KEY | Nango API key | Yes |

## 🚨 Troubleshooting

### Port Conflicts

If port 3000 is in use:

```bash
npm run dev -- -p 3001
```

### Nango Port Conflicts

If port 3003 is in use, update `.env`:

```env
NANGO_SERVER_URL=http://localhost:3004
```

And update docker-compose port mapping:

```yaml
ports:
  - '3004:8080'
```

### WorkOS Auth Issues

- Check `WORKOS_REDIRECT_URI` matches WorkOS Dashboard
- Verify `WORKOS_COOKIE_PASSWORD` is 32 bytes
- Ensure connections are enabled in WorkOS Dashboard

### Nango Connection Issues

- Verify Nango is running: `curl http://localhost:3003/health`
- Check API keys are correct
- Ensure OAuth credentials are properly configured

## 📝 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [WorkOS](https://workos.com/) for enterprise authentication
- [Nango](https://nango.dev/) for OAuth integrations
- [Lucide](https://lucide.dev/) for beautiful icons

---

Made with ❤️ by Pratik
