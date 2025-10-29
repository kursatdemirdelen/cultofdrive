import { promises as fs } from 'fs'
import path from 'path'

type JsonRecord = Record<string, any>

type LocalCar = {
  id: string
  model: string
  year?: number
  owner?: string
  imageUrl?: string
  description?: string
  specs?: any
  tags?: string[]
  created_at?: string
}

type LocalSocialPost = {
  id?: string
  username?: string
  content?: string
  imageUrl?: string
  image_url?: string
  like_count?: number
  url?: string
  timestamp?: string
  profilePic?: string
}

const ENABLE_LOCAL_FALLBACK =
  process.env.ENABLE_LOCAL_FALLBACK === 'true' ||
  process.env.NEXT_PUBLIC_ENABLE_LOCAL_FALLBACK === 'true'

const CARS_JSON_PATH = 'public/data/cars.json'
const SOCIAL_POSTS_JSON_PATH = 'public/data/social-posts.json'

export function isLocalFallbackEnabled(): boolean {
  return ENABLE_LOCAL_FALLBACK
}

async function readJson(relativePath: string): Promise<JsonRecord | JsonRecord[]> {
  const filePath = path.join(process.cwd(), relativePath)
  const raw = await fs.readFile(filePath, 'utf8')
  return JSON.parse(raw)
}

export async function getRawLocalCars(): Promise<LocalCar[]> {
  try {
    const data = await readJson(CARS_JSON_PATH)
    return Array.isArray(data) ? (data as LocalCar[]) : []
  } catch (err) {
    console.error('Failed to load local cars JSON', err)
    return []
  }
}

export async function getLocalCars(): Promise<LocalCar[]> {
  return getRawLocalCars()
}

export async function getLocalCarById(id: string): Promise<LocalCar | undefined> {
  if (!id) return undefined
  const cars = await getRawLocalCars()
  return cars.find((car) => car.id === id)
}

export async function getRawLocalSocialPosts(): Promise<LocalSocialPost[]> {
  try {
    const data = await readJson(SOCIAL_POSTS_JSON_PATH)
    if (Array.isArray(data)) return data as LocalSocialPost[]
    if (data && typeof data === 'object' && Array.isArray((data as JsonRecord).posts)) {
      return (data as JsonRecord).posts as LocalSocialPost[]
    }
    return []
  } catch (err) {
    console.error('Failed to load local social posts JSON', err)
    return []
  }
}

export async function getLocalSocialPosts(limit = 6): Promise<any[]> {
  const entries = await getRawLocalSocialPosts()
  return entries.slice(0, limit).map((post, index) => ({
    id: post.id || `local-${index}`,
    username: post.username || '@cultofdrive',
    content: post.content || '',
    imageUrl: post.imageUrl || post.image_url || '',
    like_count: post.like_count ?? 0,
    url: post.url || '',
    timestamp: post.timestamp || new Date().toISOString(),
    profilePic: post.profilePic || '/images/profile.png',
  }))
}

