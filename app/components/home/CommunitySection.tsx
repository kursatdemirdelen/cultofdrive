'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Avatar } from '@/app/components/ui/Avatar'

type Driver = {
  owner: string
  slug: string
  avatar_url?: string
  car_count: number
}

export function CommunitySection() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await fetch('/api/drivers/top')
        const data = await res.json()
        setDrivers(data.drivers || [])
      } catch (error) {
        console.error('Failed to fetch drivers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDrivers()
  }, [])

  if (loading) {
    return (
      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="mb-2 font-heading text-3xl tracking-[0.12em] text-white">
              TOP CONTRIBUTORS
            </h2>
            <p className="text-white/60">Drivers building the culture</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="mb-2 h-16 w-16 animate-pulse rounded-full bg-white/10" />
                <div className="mb-1 h-3 w-16 animate-pulse rounded bg-white/10" />
                <div className="h-2 w-12 animate-pulse rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (drivers.length === 0) return null

  return (
    <section className="px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="mb-2 font-heading text-3xl tracking-[0.12em] text-white">
            TOP CONTRIBUTORS
          </h2>
          <p className="text-white/60">Drivers building the culture</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {drivers.slice(0, 8).map((driver) => (
            <Link
              key={driver.owner}
              href={`/driver/${driver.slug}`}
              className="flex flex-col items-center transition-transform group hover:scale-105"
            >
              <Avatar
                src={driver.avatar_url}
                alt={driver.owner}
                size="lg"
                className="mb-2 transition-all ring-1 ring-white/10 group-hover:ring-2 group-hover:ring-white/20"
              />
              <h3 className="max-w-[80px] truncate text-xs font-medium text-white/90 transition-colors group-hover:text-white">
                {driver.owner}
              </h3>
              <p className="text-[10px] text-white/40">
                {driver.car_count} {driver.car_count === 1 ? 'build' : 'builds'}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
