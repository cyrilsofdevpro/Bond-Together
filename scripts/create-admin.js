import process from 'process'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SRK = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SRK) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.')
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running this script.')
  process.exit(1)
}

const adminEmail = 'boundtogetherteam@gmail.com'
const adminPassword = 'Boundteam123'

async function createAdmin() {
  try {
    console.log('Creating admin user...')

    const createResp = await fetch(`${SUPABASE_URL.replace(/\/+$/,'')}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SRK,
        Authorization: `Bearer ${SRK}`,
      },
      body: JSON.stringify({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        app_metadata: { role: 'admin' },
      }),
    })

    if (!createResp.ok) {
      const text = await createResp.text()
      console.error('Failed to create admin user:', createResp.status, text)
      process.exit(2)
    }

    const created = await createResp.json()
    const userId = created?.id || created?.user?.id
    if (!userId) {
      console.error('Unexpected response creating user:', JSON.stringify(created))
      process.exit(3)
    }

    console.log('Admin user created with id:', userId)

    // Insert a profile row using the service role key
    console.log('Creating profile row...')
    const profileResp = await fetch(`${SUPABASE_URL.replace(/\/+$/,'')}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SRK,
        Authorization: `Bearer ${SRK}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        user_id: userId,
        full_name: 'Bound Together Team',
        username: 'boundtogetherteam',
        bio: '',
        is_admin: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    })

    if (!profileResp.ok) {
      const text = await profileResp.text()
      console.error('Failed to create profile row:', profileResp.status, text)
      process.exit(4)
    }

    const profile = await profileResp.json()
    console.log('Profile created:', JSON.stringify(profile))
    console.log('Admin setup complete. Do NOT commit your service role key to source control.')
  } catch (err) {
    console.error('Error creating admin:', err)
    process.exit(10)
  }
}

createAdmin()
