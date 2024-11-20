import React, { useCallback, useEffect, useState } from "react";
import { fetchSelected, deleteSelectedRecipe } from "../services/apiClient";
import { Recipe, ApiResponse, Selected } from "../models/schema";
import { Checkbox } from "./ui/checkbox";

interface SelectedRecipesProps {
	notifySelectedRefresh: Function;
	needRefresh: boolean;
}

const SelectedRecipes: React.FC<SelectedRecipesProps> = ({
	needRefresh,
	notifySelectedRefresh,
}) => {
	const [selectedRecipes, setSelectedRecipes] = useState<
		Selected[] | undefined
	>();

	useEffect(() => {
		async function handleFetchSelectedRecipes() {
			const _selected = await fetchSelected();
			setSelectedRecipes(_selected);
			console.log("selected", needRefresh);
		}
		handleFetchSelectedRecipes();
	}, [needRefresh]);

	const handleDeselectRecipe = (val: any) => {
		deleteSelectedRecipe(val.target.value);
		handleDisplayRecipes(val.target.value);
		notifySelectedRefresh();
	};

	const handleDisplayRecipes = useCallback(async (id: string) => {
		setSelectedRecipes(
			selectedRecipes?.filter(
				(selectedRecipe) => selectedRecipe.selected_id !== id
			)
		);
	}, []);

	return (
		<div>
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
		</div>
	);
};

export default SelectedRecipes;
