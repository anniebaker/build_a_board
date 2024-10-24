interface Recipe {
  id: string;
  recipe?: string;
  method?: string[];
  made?: boolean;
  genre?: string;
  original_url?: string;
  url?: string;
  faves?: string[];
  meal_type?: string[];
  last_made?: Date;
  tags?: string[];
}

export type { Recipe as Recipe };

interface ApiResponse<T> {
  data: T;
  error?: string;
}
export type { ApiResponse as ApiResponse };

interface Selected {
  selected_id: string;
  id: string;
  recipe?: string;
  method?: string[];
  made?: boolean;
  genre?: string;
  original_url?: string;
  url?: string;
  faves?: string[];
  meal_type?: string[];
  last_made?: Date;
  tags?: string[];
}

export type { Selected as Selected };
