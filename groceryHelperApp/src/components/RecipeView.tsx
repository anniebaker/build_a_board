import { Stack, Text, Input, Button } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
	fetchRecipes,
	selectRecipe,
	createRecipe,
	fetchSelected,
	deleteSelectedRecipe,
	deleteRecipe,
	fetchSelectedRecipeIngredients,
} from "../services/apiClient";
import { Recipe, ApiResponse, Selected, Ingredient } from "../models/schema";
import { Checkbox } from "@chakra-ui/react";

const RecipeView = () => {
	const [refreshRecipeList, setRefreshRecipeList] =
		React.useState<boolean>(true);
	const [recipes, setRecipes] = useState<Recipe[] | undefined>();
	const [selectedRecipes, setSelectedRecipes] = useState<
		Selected[] | undefined
	>();
	const [newRecipe, setNewRecipe] = useState<string>("");
	const [selectedIngredients, setSelectedIngredients] = useState<
		Ingredient[] | undefined
	>();

	useEffect(() => {
		async function handleFetchSelectedIngredients() {
			const _selectedIngredients = await fetchSelectedRecipeIngredients();

			const nonStaples = _selectedIngredients?.filter(
				(ingredient) => ingredient.staple == false
			);
			console.log(nonStaples);
			setSelectedIngredients(nonStaples);
		}
		handleFetchSelectedIngredients();
	}, [selectedRecipes]);

	useEffect(() => {
		async function handleFetchRecipes() {
			const _recipes = await fetchRecipes();
			setRecipes(_recipes);
		}
		handleFetchRecipes();
	}, []);

	useEffect(() => {
		async function handleFetchSelectedRecipes() {
			const _selected = await fetchSelected();
			setSelectedRecipes(_selected);
		}
		handleFetchSelectedRecipes();
	}, []);

	const handleDeselectRecipe = (val: any) => {
		const updatedSelected = deleteSelectedRecipe(val.target.value).then(
			(res) => {
				setSelectedRecipes(res);
			}
		);
	};

	const handleRecipeCheck = (val: any) => {
		const updatedSelected = selectRecipe(val.target.value).then((res) => {
			setSelectedRecipes(res);
		});
	};
	const handleInput = (e: any) => {
		setNewRecipe(e.target.value);
	};

	const handleClick = () => {
		if (newRecipe !== "") {
			createRecipe(newRecipe).then((res) => {
				setRecipes(res);
			});

			setNewRecipe("");
		}
	};

	const handleDelete = (id: string) => {
		const deleteRecipes = deleteRecipe(id).then((res) => {
			setRecipes(res);
		});
	};

	return (
		<Stack>
			<Stack direction="row" spacing={4} align="center">
				<Input placeholder="Recipe" onChange={handleInput} value={newRecipe} />
				<Button onClick={handleClick}>Create</Button>
			</Stack>
			<Text>Recipes</Text>
			{recipes?.map((recipe) => (
				<Stack
					direction="row"
					spacing={4}
					align="center"
					key={Math.floor(Math.random() * 100000).toString()}
				>
					<Checkbox
						onChange={handleRecipeCheck}
						key={recipe.id}
						value={recipe.id}
					>
						{recipe.recipe}
					</Checkbox>
					<Text>{recipe.faves}</Text>
					<Button
						key={recipe.id + "delete"}
						onClick={() => handleDelete(recipe.id)}
					>
						X
					</Button>
				</Stack>
			))}
			<Text>Selected</Text>
			{selectedRecipes?.map((selectedRecipe) => (
				<Checkbox
					onChange={handleDeselectRecipe}
					defaultChecked
					key={selectedRecipe.selected_id}
					value={selectedRecipe.selected_id}
				>
					{selectedRecipe.recipe}
				</Checkbox>
			))}
			<Text>Ingredients List</Text>
			{selectedIngredients?.map((ingredient, idx) => {
				return <Text key={idx + ingredient.id}>{ingredient.name}</Text>;
			})}
			<Text>Pantry Items</Text>
		</Stack>
	);
};

export default RecipeView;
