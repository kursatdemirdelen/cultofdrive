export interface SocialPost {
  id: string;
  username: string;
  content: string;
  imageUrl?: string;
  timestamp: string;
  like_count: number;
  url: string;
  profilePic?: string;
}