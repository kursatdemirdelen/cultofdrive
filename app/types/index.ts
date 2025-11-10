// Unified type definitions for the entire app

export interface Car {
  id: string;
  model: string;
  year?: number;
  owner: string; // Car owner name (from driver profile)
  driverSlug?: string; // Driver profile slug for linking
  imageUrl: string;
  description: string;
  specs: string[];
  tags: string[];
  isFeatured?: boolean;
  created_at: string;
  view_count?: number;
}

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  slug: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface SocialPost {
  id: string;
  media_url?: string;
  imageUrl?: string;
  caption?: string;
  content?: string;
  permalink?: string;
  url?: string;
  timestamp?: string;
  username?: string;
  profilePic?: string;
  like_count?: number;
}
