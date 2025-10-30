# Vercel Environment Variables Setup

Vercel Dashboard → Settings → Environment Variables

## Required Variables (Production, Preview, Development)

```
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
NEXT_PUBLIC_SITE_URL=<your_domain>
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true
```

## After Adding

1. Redeploy without cache
2. Check `/api/health` endpoint
3. Test the site

## Debug 500 Errors

Visit: `https://your-domain.com/api/health`

Should return:
```json
{
  "status": "ok",
  "environment": {
    "hasSupabaseUrl": true,
    "hasSupabaseKey": true,
    "hasServiceKey": true,
    "hasSiteUrl": true
  }
}
```

If any value is `false`, that environment variable is missing.
