import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  console.warn('⚠️ Supabase credentials missing! Please add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to your .env.local file.')
}

export { supabase }

/**
 * Check if a user is currently logged in (returns the session)
 */
export async function getSession() {
  if (!supabase) return null
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    console.error('Error getting session:', error.message)
    return null
  }
  return data.session
}

/**
 * Sign in with email and password
 */
export async function login(email, password) {
  if (!supabase) return { error: { message: 'Supabase not configured' } }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

/**
 * Register a new user
 */
export async function register(email, password, name) {
  if (!supabase) return { error: { message: 'Supabase not configured' } }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      }
    }
  })
  return { data, error }
}

/**
 * Sign out the current user
 */
export async function logout() {
  if (!supabase) return
  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Listen for auth state changes
 */
export function onAuthStateChange(callback) {
  if (!supabase) return () => {}
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
  return data.subscription.unsubscribe
}

/**
 * Update current user profile or password
 * updates: { data: { full_name: 'Name' } } or { password: 'new_password' }
 */
export async function updateProfile(updates) {
  if (!supabase) return { error: { message: 'Supabase not configured' } }
  const { data, error } = await supabase.auth.updateUser(updates)
  return { data, error }
}

/**
 * Log an action to the audit log table
 */
export async function logAudit(action, description) {
  if (!supabase) return
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    // Only proceed if we have a session (we only track authenticated users, or gracefully fall back to System if needed)
    const user_id = session?.user?.id || null
    const user_email = session?.user?.email || 'System'

    const { error } = await supabase
      .from('audit_logs')
      .insert([
        { 
          user_id, 
          user_email, 
          action, 
          description 
        }
      ])
      
    if (error) {
      console.warn('Failed to insert audit log:', error)
    }
  } catch (err) {
    console.error('Audit log error:', err)
  }
}
