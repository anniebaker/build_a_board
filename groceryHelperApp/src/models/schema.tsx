export interface Recipe {
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
	//ingredients?:
}

//export type { Recipe as Recipe };

export interface ApiResponse<T> {
	data: T;
	error?: string;
}
//export type { ApiResponse as ApiResponse };

export interface Selected {
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

export interface Ingredient {
	name: string;
	id: string;
	recipe_id: string;
	recipe_name: string;
	staple?: boolean;
	grocery_location?: GroceryLocation;
	optional?: boolean;
}

export enum GroceryLocation {
	Produce = "Produce",
	BakedGoods = "Baked Goods",
	Refrigerated = "Refrigerated",
	VegetariansCorner = "Vegetarian's Corner",
	Dairy = "Dairy",
	Pantry = "Pantry",
	Frozen = "Frozen",
	Spices = "Spices",
	Bulk = "Bulk Section",
	Specialty = "Specialty Store",
	Other = "Other",
	DIY = "DIY",
}

export interface Shop {
	item: string;
	ingredient_id?: string;
	recipe_id?: string;
	recipe_name?: string;
	staple?: boolean;
	grocery_location?: GroceryLocation;
	optional?: boolean;
	quantity?: number;
}
//export type { Selected as Selected };
export interface RecipeIngredient {
	faves: string[];
	genre: string;
	id: string;
	last_made: Date;
	made: boolean;
	meal_type: string[];
	method: string;
	name: string;
	recipe: string;
	recipe_ingredient_name: string;
	tags: string[];
}
