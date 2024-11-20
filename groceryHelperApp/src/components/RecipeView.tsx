import { Stack, Text, Input, Button, IconButton } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import {
	fetchRecipes,
	selectRecipe,
	createRecipe,
	fetchSelected,
	deleteSelectedRecipe,
	deleteRecipe,
	fetchSelectedRecipeIngredients,
	fetchRecipeIngredients,
} from "../services/apiClient";
import {
	Recipe,
	Selected,
	Ingredient,
	Shop,
	RecipeIngredient,
} from "../models/schema";
import { Checkbox } from "./ui/checkbox";
import ShopTable from "./ShopTable";
import { Table, createListCollection } from "@chakra-ui/react";
import {
	SelectContent,
	SelectItem,
	SelectLabel,
	SelectRoot,
	SelectTrigger,
	SelectValueText,
} from "./ui/select";
import {
	PopoverBody,
	PopoverContent,
	PopoverHeader,
	PopoverRoot,
	PopoverTrigger,
} from "./ui/popover";
import { AnyString } from "@chakra-ui/react/dist/types/styled-system/generated/system.gen";
import { MdFilterList } from "react-icons/md";

interface ListCollection {
	items: Array<ItemList>;
}
interface ItemList {
	label: string;
	value: string;
}
const RecipeView = () => {
	const [refreshRecipeList, setRefreshRecipeList] =
		React.useState<boolean>(true);
	const [recipes, setRecipes] = useState<Recipe[] | undefined>();
	const [displayRecipes, setDisplayRecipes] = useState<Recipe[] | undefined>();
	const [selectedRecipes, setSelectedRecipes] = useState<
		Selected[] | undefined
	>();
	const [newRecipe, setNewRecipe] = useState<string>("");
	const [selectedIngredients, setSelectedIngredients] = useState<
		Ingredient[] | undefined
	>();
	const [shoppingList, setShoppingList] = useState<Shop[] | undefined>();
	const [recipeIngredients, setRecipeIngredients] = useState<
		RecipeIngredient[] | undefined
	>();
	const [displayIngredients, setDisplayIngredients] =
		useState<ListCollection>();
	const [value, setValue] = useState<string>("");

	useEffect(() => {
		if (value) {
			const filteredIngredients = recipeIngredients?.filter(
				(recipeIngredient) => recipeIngredient.name?.includes(value)
			);

			const filteredRecipeIds = new Set(
				filteredIngredients?.map((ing) => ing.id)
			);
			const filteredRecipes = recipes?.filter((recipe) =>
				filteredRecipeIds.has(recipe.id)
			);
			setDisplayRecipes(filteredRecipes);
		}
	}, [value]);

	useEffect(() => {
		async function handleFetchSelectedIngredients() {
			const _selectedIngredients = await fetchSelectedRecipeIngredients();
			const ingredientMap = new Map(
				_selectedIngredients?.map((i) => [i.id, i])
			);
			var _shoppingList: Shop[] = [];
			for (let [key, val] of ingredientMap) {
				const dupes = _selectedIngredients?.filter(
					(originalIng, idx, array) => originalIng.id === key
				);
				const numIngredients = dupes?.length === 0 ? 1 : dupes?.length;
				var shop: Shop = {
					item: val.name,
					ingredient_id: val.id,
					recipe_id: val.recipe_id,
					recipe_name: val.recipe_name,
					staple: val.staple,
					grocery_location: val.grocery_location,
					optional: val.optional,
					quantity: numIngredients,
				};
				_shoppingList.push(shop);
			}
			const nonStaples = _selectedIngredients?.filter(
				(ingredient) => ingredient.staple == false
			);
			setShoppingList(_shoppingList);
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

	useEffect(() => {
		async function handleFetchRecipeIngredients() {
			const _recipeIngredients = await fetchRecipeIngredients();
			const _sortedRecipeIngredients = _recipeIngredients?.sort((a, b) => {
				if (a.name < b.name) {
					return -1;
				}
				if (a.name > b.name) {
					return 1;
				}
				return 0;
			});

			//console.log(_recipeIngredients);

			setRecipeIngredients(_recipeIngredients);
			let dedupe = new Set(
				_recipeIngredients?.map((ing) => {
					return ing.name;
				})
			);
			const dedupedAndReformatted = [...dedupe]?.map((ing: string) => {
				return { label: ing, value: ing };
			});
			const _displayIngredients = createListCollection({
				items: dedupedAndReformatted,
			});
			setDisplayIngredients(_displayIngredients);
		}
		handleFetchRecipeIngredients();
	}, []);
	//const handleDisplayIngredients = useCallback(async (id: string) => {},[])
	const handleDeselectRecipe = (val: any) => {
		const updatedSelected = deleteSelectedRecipe(val.target.value).then(
			(res) => {
				setSelectedRecipes(res);
			}
		);
	};

	const handleRecipeCheck = (val: any) => {
		console.log(val);
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
	let recipeList = displayRecipes ? displayRecipes : recipes;

	return (
		<>
			<Stack direction="row" gap={4} align="center">
				<Input placeholder="Recipe" onChange={handleInput} value={newRecipe} />
				<Button onClick={handleClick}>Create</Button>
				<Button onClick={() => console.log(recipeIngredients)}>Recipes</Button>
			</Stack>

			<Stack>
				<ShopTable shoppingList={shoppingList} />
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
				<Text>Recipes</Text>

				<Table.Root size="sm">
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeader>
								Recipe
								<PopoverRoot size="xs">
									<PopoverTrigger asChild>
										<IconButton
											aria-label="Filter by ingredient"
											variant="ghost"
											size="sm"
										>
											<MdFilterList />
										</IconButton>
									</PopoverTrigger>

									<PopoverContent>
										<PopoverBody>
											<SelectRoot
												collection={displayIngredients}
												value={value}
												onValueChange={(e: any) => setValue(e.value)}
											>
												<SelectTrigger>
													<SelectValueText placeholder="Ingredient" />
												</SelectTrigger>
												<SelectContent>
													{displayIngredients?.items.map((ing) => (
														<SelectItem item={ing} key={ing.value}>
															{ing.label}
														</SelectItem>
													))}
												</SelectContent>
											</SelectRoot>
										</PopoverBody>
									</PopoverContent>
								</PopoverRoot>
							</Table.ColumnHeader>
							<Table.ColumnHeader>Genre</Table.ColumnHeader>
							<Table.ColumnHeader>Faves</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{recipeList?.map((recipe, idx) => (
							<Table.Row key={recipe.id + "tr-recipe"}>
								<Table.Cell>
									<Button
										onClick={handleRecipeCheck}
										aria-label="Add Recipe"
										key={recipe.id}
										value={recipe.id}
										size="xs"
									>
										Add
									</Button>
									{recipe.recipe}
								</Table.Cell>
								<Table.Cell>{recipe.genre}</Table.Cell>
								<Table.Cell>{recipe.faves}</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table.Root>
			</Stack>
		</>
	);
};

export default RecipeView;
