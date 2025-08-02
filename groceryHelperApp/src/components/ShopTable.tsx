import React, { useEffect, useMemo, useCallback } from "react";
import {
	Shop,
	GroceryLocation,
	Ingredient,
	ShopListState,
} from "../models/schema";
import ShopItem from "./ShopItem";
import { fetchSelectedRecipeIngredients } from "../services/apiClient";
import { EmptyState } from "./ui/empty-state";
import { RiQuestionMark } from "react-icons/ri";
import { View } from "../App";
import { Button } from "./ui/button";
import { Skeleton, SkeletonText } from "./ui/skeleton";
import ShopButtons from "./ShopButtons";
import { Box } from "@chakra-ui/react";

interface ShopTableProps {
	viewRecipes: (view: View) => void;
	//shoppingList: Shop[] | undefined;
}

const ShopTable: React.FC<ShopTableProps> = ({ viewRecipes }) => {
	const [shoppingList, setShoppingList] = React.useState<ShopListState>({
		original: [],
		display: [],
	});
	const [loading, setLoading] = React.useState<boolean>(true);

	const locationArray = useMemo(() => {
		let locationArr: (GroceryLocation | undefined)[];
		if (shoppingList.display.length) {
			const locations = new Set(
				shoppingList.display.map((shop) => shop.grocery_location)
			);
			locationArr = Array.from(locations);
		} else {
			locationArr = [];
		}
		return locationArr;
	}, [shoppingList.display]);

	const filters = useMemo(() => {
		let locationArr: (GroceryLocation | undefined)[];
		if (shoppingList.display.length) {
			const locations = new Set(
				shoppingList.display.map((shop) => shop.grocery_location)
			);
			locationArr = Array.from(locations);
		} else {
			locationArr = [];
		}
		return locationArr;
	}, [shoppingList.original]);

	useEffect(() => {
		async function handleFetchSelectedIngredients() {
			let active = true;
			const _selectedIngredients = await fetchSelectedRecipeIngredients();
			setLoading(false);
			createDisplayList(_selectedIngredients, active);
			return () => {
				active = false;
			};
		}
		handleFetchSelectedIngredients();
	}, []);

	const createDisplayList = useCallback(
		(_selectedIngredients: Ingredient[] | undefined, active: boolean) => {
			if (_selectedIngredients) {
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
				const displayShoppingList = _shoppingList.filter(
					(ing) => !ing.staple && !ing.optional
				);
				if (active) {
					setShoppingList({
						original: _shoppingList,
						display: displayShoppingList,
					});
				} else {
					return;
				}
			} else {
				return;
			}
		},
		[]
	);

	const handleShoppingLocation = useCallback(
		(location: GroceryLocation | undefined) => {
			var filteredShoppingList = shoppingList.display?.filter(
				(shop) => shop.grocery_location === location
			);
			return filteredShoppingList;
		},
		[]
	);

	const handleSetShoppingList = useCallback((newShoppingList: Shop[]) => {
		setShoppingList((prevList) => ({
			...prevList,
			display: newShoppingList,
		}));
	}, []);

	if (loading) {
		return <SkeletonText noOfLines={14} gap="4" />;
	}

	return (
		<>
			{shoppingList.original?.length ? (
				<Box>
					<ShopButtons
						shoppingList={shoppingList}
						handleSetShoppingList={(newShoppingList: Shop[]) =>
							handleSetShoppingList(newShoppingList)
						}
					/>
					{locationArray?.map((location, idx) => {
						console.log(handleShoppingLocation(location));
						return (
							<ShopItem
								location={location}
								list={shoppingList.display?.filter(
									(shop) => shop.grocery_location === location
								)}
								key={`${location}-${idx}`}
							/>
						);
					})}
				</Box>
			) : (
				<EmptyState
					icon={<RiQuestionMark />}
					title="Your shopping list is empty"
				>
					<Button
						key="empty-state-btn"
						onClick={() => viewRecipes(View.Recipes)}
					>
						Add recipes
					</Button>
				</EmptyState>
			)}
		</>
	);
};

export default ShopTable;
