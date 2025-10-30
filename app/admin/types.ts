export type AdminCar = {
  id: string;
  model: string;
  year: number | null;
  owner: string | null;
  image_url: string | null;
  description: string | null;
  specs: any[] | null;
  tags: string[] | null;
  created_at: string;
  is_featured?: boolean | null;
};

export type CarFormState = {
  id?: string;
  model: string;
  year: string;
  owner: string;
  description: string;
  tags: string;
  specs: string;
  imageUrl: string;
  isFeatured: boolean;
};
