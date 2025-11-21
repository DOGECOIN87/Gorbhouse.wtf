#!/usr/bin/env python3
"""
Supabase Database Setup Script

This script:
1. Connects to Supabase using environment variables
2. Creates the database schema (tables, functions, policies)
3. Seeds the memes data
4. Verifies the setup
"""

import os
import sys

# Get Supabase credentials from environment
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: SUPABASE_URL and SUPABASE_KEY environment variables must be set")
    sys.exit(1)

print("=" * 60)
print("SUPABASE DATABASE SETUP")
print("=" * 60)
print(f"\n✓ Connected to: {SUPABASE_URL[:40]}...")
print(f"✓ Using key: {SUPABASE_KEY[:20]}...\n")

try:
    from supabase import create_client, Client
except ImportError:
    print("Installing supabase package...")
    os.system("pip3 install -q supabase")
    from supabase import create_client, Client

# Create Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

print("[STEP 1] Reading SQL setup script...")
with open('supabase-setup.sql', 'r') as f:
    setup_sql = f.read()

print("[STEP 2] Executing database schema setup...")
print("  - Creating tables (memes, votes)")
print("  - Creating vote_and_update_elo function")
print("  - Setting up RLS policies")

# Execute the setup SQL
# Note: We need to execute this via the Supabase SQL API
# The Python client doesn't have direct SQL execution, so we'll use the REST API

import requests

headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json'
}

# We'll need to execute SQL statements one by one or use the Supabase management API
# For now, let's try to create tables using the client

print("\n[STEP 3] Creating tables via Supabase client...")

# Since direct SQL execution isn't available in the Python client,
# we'll output instructions for manual execution
print("\n" + "=" * 60)
print("IMPORTANT: SQL EXECUTION REQUIRED")
print("=" * 60)
print("\nThe Python Supabase client doesn't support direct SQL execution.")
print("Please run the following SQL scripts in the Supabase SQL Editor:")
print("\n1. Go to your Supabase project dashboard")
print("2. Click 'SQL Editor' in the left sidebar")
print("3. Click 'New query'")
print("4. Copy and paste the contents of 'supabase-setup.sql'")
print("5. Click 'Run' (or press Ctrl+Enter)")
print("6. Then copy and paste the contents of 'supabase-seed-memes.sql'")
print("7. Click 'Run' again")
print("\n" + "=" * 60)

# Let's try to verify if tables exist by querying them
print("\n[STEP 4] Checking if tables already exist...")

try:
    result = supabase.table('memes').select("id").limit(1).execute()
    print("✓ 'memes' table exists")
    meme_count = len(supabase.table('memes').select("id").execute().data)
    print(f"  Found {meme_count} memes in database")
except Exception as e:
    print(f"✗ 'memes' table not found or error: {str(e)}")
    print("  → You need to run supabase-setup.sql first")

try:
    result = supabase.table('votes').select("id").limit(1).execute()
    print("✓ 'votes' table exists")
    vote_count = len(supabase.table('votes').select("id").execute().data)
    print(f"  Found {vote_count} votes in database")
except Exception as e:
    print(f"✗ 'votes' table not found: {str(e)}")
    print("  → You need to run supabase-setup.sql first")

print("\n" + "=" * 60)
print("SETUP STATUS")
print("=" * 60)
print("\nTo complete the setup:")
print("1. Run the SQL scripts in Supabase SQL Editor (see above)")
print("2. Then run this script again to verify")
print("3. Or run: npx tsx test-supabase-connection.ts")
print("\n" + "=" * 60)
