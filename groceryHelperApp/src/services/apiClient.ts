import { Recipe, ApiResponse, Selected, Ingredient } from "../models/schema";

const baseURL = "http://localhost:3001";

export async function fetchRecipes(): Promise<Recipe[] | undefined> {
	try {
		const response = await fetch(baseURL);
		async function test() {
			console.log("Testing!");
		}
		return response.json();
	} catch (e) {
		console.log(e);
	}
}

export async function fetchSelected(): Promise<Selected[]> {
	const response = await fetch(baseURL + "/recipes", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	console.log(response);
	return response.json();
}
export async function deleteRecipe(id: string) {
	const response = await fetch("http://localhost:3001/recipes/" + id, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ id }),
	});
	const updatedSelected = fetchRecipes();
	return updatedSelected;
}
export async function deleteSelectedRecipe(selected_recipe_id: string) {
	const response = await fetch(
		"http://localhost:3001/selected/" + selected_recipe_id,
		{
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ selected_recipe_id }),
		}
	);

	const updatedSelected = fetchSelected();
	return updatedSelected;
}

export async function selectRecipe(selected_recipe_id: string) {
	try {
		const response = await fetch("http://localhost:3001/selected", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ selected_recipe_id }),
		});
		const updatedRecipes = fetchSelected();
		return updatedRecipes;
	} catch (e) {
		console.log(e);
	}
}

export async function createRecipe(recipe: string) {
	let id = Math.floor(Math.random() * 100000).toString();
	const newRecipe = await fetch("http://localhost:3001/recipes", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ id, recipe }),
	});
	const updatedRecipes = fetchRecipes();
	return updatedRecipes;
}
export async function fetchSelectedRecipeIngredients(): Promise<
	Ingredient[] | undefined
> {
	try {
		const response = await fetch(baseURL + "/ingredients/selected");
		async function test() {
			console.log("Testing!");
		}
		return response.json();
	} catch (e) {
		console.log(e);
	}
}
