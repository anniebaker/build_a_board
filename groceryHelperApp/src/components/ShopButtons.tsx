import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Shop, ShopListState } from "../models/schema";
import { Stack, Text, For, Button } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
interface ShopButtonsProps {
	shoppingList: ShopListState;
	handleSetShoppingList: (shoppingList: Shop[]) => void;
}

enum Filters {
	staple = "Staple",
	optional = "Optional",
}

interface FilterOptions {
	staple: boolean;
	optional: boolean;
}

const ShopButtons: React.FC<ShopButtonsProps> = ({
	shoppingList,
	handleSetShoppingList,
}) => {
	const [filters, setFilters] = React.useState<FilterOptions>({
		staple: false,
		optional: false,
	});
	const [loading, setLoading] = React.useState<boolean>(true);

	// const toggleFilters = useCallback(
	// 	(filters: FilterOptions, active: boolean) => {
	const toggleFilters = (e: any) => {
		const filterKey = e.target.value as keyof FilterOptions;
		setFilters((prevFilters) => ({
			...prevFilters,
			[filterKey]: !prevFilters[filterKey],
		}));
		setLoading(false);
	};

	const changeListDisplay = useCallback(
		(active: boolean) => {
			console.log("starting");
			//console.log(filterKey, " should be ", filters[filterKey]);
			if (active === true && loading === false) {
				let newShoppingList: Shop[] = [];
				//				console.log("optional", filters.optional, "staple", filters.staple);
				if (filters.optional === true && filters.staple === true) {
					newShoppingList = shoppingList.original;
				} else if (filters.optional === false && filters.staple === false) {
					newShoppingList = shoppingList.original?.filter(
						(ingredient) =>
							ingredient.staple === false && ingredient.optional === false
					);
				} else if (filters.optional === true && filters.staple === false) {
					newShoppingList = shoppingList.original?.filter(
						(ingredient) => ingredient.staple === false
					);
				} else if (filters.optional === false && filters.staple === true) {
					newShoppingList = shoppingList.original?.filter(
						(ingredient) => ingredient.optional === false
					);
				}
				handleSetShoppingList(newShoppingList);
				console.log(newShoppingList);
			}
		},
		[filters, loading, shoppingList.original, handleSetShoppingList]
	);

	useEffect(() => {
		let active = true;
		loading === false && changeListDisplay(active);
		return () => {
			active = false;
		};
	}, [filters, loading]);

	// onClick={() =>
	// 					setFilters({
	// 						...filters,
	// 						[item.toLowerCase() as keyof FilterOptions]:
	// 							!filters[item.toLowerCase() as keyof FilterOptions],
	// 					})
	// 				}
	return (
		<>
			<Button onClick={() => console.log(filters)}>Filters</Button>
			<Button onClick={() => console.log(shoppingList.display)}>LIst</Button>

			{Object.keys(Filters).map((item) => (
				<Button
					onClick={toggleFilters}
					variant="outline"
					value={item}
					key={item}
				>
					{item}
				</Button>
			))}
		</>
	);
};

export default ShopButtons;
