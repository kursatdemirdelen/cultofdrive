export interface Car {
  id: string;
  model: string;
  year: number;
  owner: string;
  description: string;
  imageUrl: string;
  specs: string[];
  tags: string[];
  isFeatured?: boolean;
}
