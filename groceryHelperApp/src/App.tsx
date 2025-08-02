import { Show } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import { Checkbox, CheckboxGroup } from "@chakra-ui/react";
import RecipeView from "./components/RecipeView";
import RecipeForm from "./components/AddRecipe/NewRecipe";
import { Recipe } from "./models/schema";
import ShopTable from "./components/ShopTable";
//wrap around for breakpoints: Show when="md">
export enum View {
	Recipes = "recipes",
	NewRecipe = "new_recipe",
	Shopping = "shopping",
}
function App() {
	const [view, setView] = useState(View.Shopping);
	const layout = { base: `"nav" "main"`, md: `"nav nav" "main main"` };

	const handleViewChange = (view: View) => {
		setView(view);
	};

	return (
		<Grid templateAreas={layout}>
			<GridItem area={"nav"} bg="papayawhip">
				<NavBar viewChange={(view: View) => handleViewChange(view)} />
			</GridItem>
			<Show when={view === View.Recipes}>
				<GridItem area={"main"}>
					<RecipeView />
				</GridItem>
			</Show>
			<Show when={view === View.NewRecipe}>
				<GridItem area={"main"}>
					<RecipeForm />
				</GridItem>
			</Show>
			<Show when={view === View.Shopping}>
				<GridItem area={"main"}>
					<ShopTable viewRecipes={() => handleViewChange(View.Recipes)} />
				</GridItem>
			</Show>
		</Grid>
	);
}

export default App;
