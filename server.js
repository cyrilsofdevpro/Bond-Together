import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()
import http from 'http'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*'
const PORT = process.env.PORT || 8080
const ADMIN_API_SECRET = process.env.ADMIN_API_SECRET || ''

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

function parsePostgresInterval(interval) {
  if (!interval) return 0
  const match = /(?:(\d+)\s+years?)?\s*(?:(\d+)\s+mons?)?\s*(?:(\d+)\s+days?)?\s*(?:(\d+):(\d+):(\d+(?:\.\d+)?))?/.exec(interval)
  if (!match) return 0

  const [, years, months, days, hours, minutes, seconds] = match
  return (
    (Number(years) || 0) * 365 * 24 * 60 * 60 * 1000 +
    (Number(months) || 0) * 30 * 24 * 60 * 60 * 1000 +
    (Number(days) || 0) * 24 * 60 * 60 * 1000 +
    (Number(hours) || 0) * 60 * 60 * 1000 +
    (Number(minutes) || 0) * 60 * 1000 +
    (Number(seconds) || 0) * 1000
  )
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': CLIENT_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  })
  res.end(JSON.stringify(payload))
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': CLIENT_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    })
    return res.end()
  }

  if (req.method !== 'POST' || req.url !== '/activate-code') {
    // simple admin endpoint for fetching users/profiles/memberships
    if (req.method === 'GET' && req.url === '/admin/data') {
      const auth = req.headers.authorization || ''
      if (!ADMIN_API_SECRET || auth !== `Bearer ${ADMIN_API_SECRET}`) {
        return sendJson(res, 401, { error: 'unauthorized' })
      }

      try {
        // list users using service role
        const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
        if (usersError) {
          return sendJson(res, 500, { error: 'failed_list_users', details: usersError.message })
        }

        const { data: profiles, error: profilesError } = await supabase.from('profiles').select('*')
        if (profilesError) {
          return sendJson(res, 500, { error: 'failed_fetch_profiles', details: profilesError.message })
        }

        const { data: memberships, error: membershipsError } = await supabase.from('user_memberships').select('*')
        if (membershipsError) {
          return sendJson(res, 500, { error: 'failed_fetch_memberships', details: membershipsError.message })
        }

        return sendJson(res, 200, { users: users?.users || users, profiles, memberships })
      } catch (err) {
        return sendJson(res, 500, { error: 'server_error', details: err?.message || String(err) })
      }
    }

    return sendJson(res, 404, { error: 'Not found' })
  }

  try {
    const body = await parseBody(req)
    const code = String(body.code || '').trim().toUpperCase()
    if (!code) {
      return sendJson(res, 400, { error: 'activation_code_required' })
    }

    const authHeader = req.headers.authorization || ''
    if (!authHeader.startsWith('Bearer ')) {
      return sendJson(res, 401, { error: 'missing_auth_token' })
    }

    const accessToken = authHeader.split(' ')[1]
    const { data: userData, error: userError } = await supabase.auth.getUser(accessToken)
    if (userError || !userData?.user) {
      return sendJson(res, 401, { error: 'invalid_auth_token' })
    }

    const userId = userData.user.id

    const { data: codeRow, error: codeError } = await supabase
      .from('activation_codes')
      .select('*')
      .eq('code', code)
      .single()

    if (codeError || !codeRow) {
      return sendJson(res, 400, { error: 'invalid_activation_code' })
    }

    if (codeRow.used) {
      return sendJson(res, 400, { error: 'activation_code_already_used' })
    }

    const durationMs = parsePostgresInterval(codeRow.duration)
    if (!durationMs) {
      return sendJson(res, 500, { error: 'invalid_code_duration' })
    }

    const expiresAt = new Date(Date.now() + durationMs).toISOString()

    const { data: membership, error: membershipError } = await supabase
      .from('user_memberships')
      .insert([{ user_id: userId, plan_key: codeRow.plan_key, activation_code_id: codeRow.id, activated_at: new Date().toISOString(), expires_at: expiresAt }])
      .select('id,plan_key,activated_at,expires_at')
      .single()

    if (membershipError) {
      return sendJson(res, 500, { error: 'membership_insert_failed', details: membershipError.message })
    }

    const { error: updateError } = await supabase
      .from('activation_codes')
      .update({ used: true, used_by: userId, used_at: new Date().toISOString() })
      .eq('id', codeRow.id)

    if (updateError) {
      return sendJson(res, 500, { error: 'activation_code_update_failed', details: updateError.message })
    }

    return sendJson(res, 200, { membership })
  } catch (error) {
    console.error(error)
    return sendJson(res, 500, { error: 'server_error', details: error?.message || String(error) })
  }
})

server.listen(PORT, () => {
  console.log(`Activation API listening at http://localhost:${PORT}`)
})
