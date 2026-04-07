# HERP HUB AU Marketing Dashboard - Environment Configuration

## Required Environment Variables

Create a `.env.local` file in the project root with the following variables:

### Meta API Configuration
```
VITE_META_APP_ID=your_meta_app_id_here
VITE_META_APP_SECRET=your_meta_app_secret_here
```

Get these from: https://developers.facebook.com/apps/

### WordPress API Configuration
```
VITE_WP_API_URL=https://herphub.au/wp-json/herphub/v1
```

This should point to your WordPress installation with the HERP HUB AU API endpoints.

### Environment Settings
```
VITE_ENVIRONMENT=production
VITE_ENABLE_DEBUG=false
```

## WordPress Backend Requirements

The following WordPress API endpoints must be implemented:

### Authentication Endpoints
- `POST /wp-json/herphub/v1/verify-collective-access` - Verify "The Collective" membership
- `POST /wp-json/herphub/v1/meta-auth-callback` - Handle Meta OAuth callback

### Data Endpoints
- `GET /wp-json/herphub/v1/meta-stats?range={dateRange}` - Meta ad account data
- `GET /wp-json/herphub/v1/meta-ad-accounts?range={dateRange}` - Ad account details
- `GET /wp-json/herphub/v1/meta-campaigns?range={dateRange}` - Campaign performance
- `GET /wp-json/herphub/v1/meta-creatives?range={dateRange}` - Creative performance
- `GET /wp-json/herphub/v1/meta-page-insights?page_id={id}&metrics={metrics}` - Page insights
- `GET /wp-json/herphub/v1/meta-audience-insights` - Audience demographics

### Security Implementation
- All endpoints should verify the user's "The Collective" membership status
- Meta tokens should be stored securely server-side
- Implement rate limiting and access controls
- Use WordPress nonce verification for additional security

## Meta App Setup

1. Create a Meta for Developers app at https://developers.facebook.com/apps/
2. Configure OAuth redirect URI: `https://your-domain.com/auth/meta/callback`
3. Request these permissions:
   - `pages_read_engagement`
   - `pages_show_list`
   - `ads_read`
   - `business_management`
   - `pages_read_user_content`

## Development Setup

1. Copy `.env.example` to `.env.local`
2. Fill in the required environment variables
3. Run `npm run dev` to start the development server

## Production Deployment

1. Set environment variables in your hosting environment
2. Ensure HTTPS is enabled (required for Meta OAuth)
3. Configure proper CORS headers on WordPress backend
4. Test the authentication flow end-to-end
