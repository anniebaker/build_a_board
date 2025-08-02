"use client";
import {
	Stack,
	Text,
	Input,
	Button,
	Group,
	SimpleGrid,
	IconButton,
	Box,
	Flex,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import {
	fetchRecipes,
	selectRecipe,
	createRecipe,
	fetchSelected,
	deleteSelectedRecipe,
	deleteRecipe,
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
import { MdFilterList } from "react-icons/md";
import { LuPlus } from "react-icons/lu";
import { Card, For } from "@chakra-ui/react";
import { Tag } from "./ui/tag";
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
		const updatedSelected = selectRecipe(val.currentTarget?.value).then(
			(res) => {
				setSelectedRecipes(res);
			}
		);
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
				<Text>Selected for the week</Text>
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

				{recipeList?.map((recipe, idx) => (
					<Box key={recipe.id + "-box"}>
						<Flex justify="space-between" key={recipe.id + "-parentflex"}>
							<Box width="90%" key={recipe.id + "-innerbox"}>
								<Box key={recipe.id + "-innermostbox"}>{recipe.recipe}</Box>
								{recipe.genre?.length &&
									recipe.genre.map((gen) => <Tag>{gen}</Tag>)}
							</Box>
							<IconButton
								onClick={handleRecipeCheck}
								aria-label="Add Recipe"
								key={recipe.id}
								value={recipe.id}
								size="lg"
								marginEnd="auto"
							>
								<LuPlus />
							</IconButton>
						</Flex>
					</Box>
				))}
			</Stack>
		</>
	);
};

export default RecipeView;
