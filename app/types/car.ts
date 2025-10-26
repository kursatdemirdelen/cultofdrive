export interface Spec {
  key: string;
  value: string;
}

export interface Car {
  id?: string;  
  model: string;
  year?: number;  
  owner: string;
  imageUrl: string;  
  description: string;
  specs: Spec[];
  tags: string[];
  created_at?: string;  
}