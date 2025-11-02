export type AdminCar = {
  id: string;
  model: string;
  year: number | null;
  user_id: string | null;
  owner: string | null;
  image_url: string | null;
  description: string | null;
  specs: string[];
  tags: string[];
  created_at: string;
  is_featured?: boolean | null;
};

export type CarFormState = {
  id?: string;
  model: string;
  year: string;
  description: string;
  tags: string;
  specs: string;
  imageUrl: string;
  isFeatured: boolean;
};

export type UserStats = {
  total_cars: number;
  total_views: number;
  total_favorites: number;
  total_comments: number;
};
