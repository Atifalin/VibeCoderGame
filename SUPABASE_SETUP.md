# Supabase Setup for Global Leaderboard

## 1. Create Supabase Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create leaderboard table
CREATE TABLE leaderboard (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  money INTEGER NOT NULL,
  day INTEGER NOT NULL,
  completed_requests INTEGER NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_leaderboard_money ON leaderboard(money DESC);
CREATE INDEX idx_leaderboard_timestamp ON leaderboard(timestamp DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read leaderboard
CREATE POLICY "Allow public read access" ON leaderboard
  FOR SELECT USING (true);

-- Allow anyone to insert their scores
CREATE POLICY "Allow public insert access" ON leaderboard
  FOR INSERT WITH CHECK (true);
```

## 2. Get Your Credentials

1. Go to your Supabase project: https://supabase.com/dashboard
2. Click on your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** (e.g., `https://xxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## 3. Add to Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add these variables:

```
VITE_SUPABASE_URL = https://mcoyipmqsvzecptlimck.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jb3lpcG1xc3Z6ZWNwdGxpbWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTI3NjksImV4cCI6MjA3Nzg2ODc2OX0.7D27yrMRFVgv6tj0lxNWqaU3_77PDF7GLr9AXxQl0oQ
```

4. Click **Save**
5. Redeploy your app (Vercel will auto-redeploy with new env vars)

## 4. Local Development

For local development, the `.env` file is already set up with your credentials.
The `.env` file is in `.gitignore` so it won't be pushed to GitHub.

## Security Notes

✅ **Safe to expose:**
- Supabase URL
- Anon/Public key (this is meant to be public)

✅ **Protected by Row Level Security (RLS):**
- Users can only read and insert to leaderboard
- No delete or update permissions
- Data is safe from malicious actors

❌ **Never expose:**
- Service role key (we don't use this)
- Database password

## Testing

1. Play the game and submit a score
2. Check your Supabase dashboard → Table Editor → leaderboard
3. You should see your entry!
4. The leaderboard will now show global scores from all players

## Fallback Behavior

If Supabase is not configured or fails:
- The game automatically falls back to localStorage
- Players can still play and see local leaderboard
- No errors or crashes
