import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envFile = fs.readFileSync(path.resolve('.env.local'), 'utf8');
const env = Object.fromEntries(
  envFile
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const [key, ...rest] = line.split('=');
      return [key, rest.join('=')];
    })
);

const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const { data, error } = await supabase.rpc('generate_activation_codes', {
  p_plan: 'basic',
  p_count: 1,
  p_duration: '30 days',
});
console.log('RPC response:', JSON.stringify({ data, error }, null, 2));
