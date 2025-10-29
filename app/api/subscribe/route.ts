import { NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  // More robust email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  // Check if email already exists
  const { data: existing } = await supabase
    .from('E-mail')
    .select('id')
    .eq('e_mail', email)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'This email is already registered.' }, { status: 409 })
  }

  // Insert new subscription
  const { error } = await supabase.from('E-mail').insert([{ e_mail: email }])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: 'Subscription successful!' })
}

