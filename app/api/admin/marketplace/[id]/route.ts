import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ error: 'Marketplace feature temporarily disabled' }, { status: 503 })
}

export async function PATCH() {
  return NextResponse.json({ error: 'Marketplace feature temporarily disabled' }, { status: 503 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Marketplace feature temporarily disabled' }, { status: 503 })
}