import { Show } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
//import { Recipe, ApiResponse, Selected } from "./models/schema";
import { Checkbox, CheckboxGroup } from "@chakra-ui/react";
import RecipeView from "./components/RecipeView";
//wrap around for breakpoints: Show when="md">

function App() {
	const layout = { base: `"nav" "main"`, md: `"nav nav" "main main"` };

	return (
		<Grid templateAreas={layout}>
			<GridItem area={"nav"} bg="papayawhip">
				<NavBar />
			</GridItem>
			<GridItem area={"main"}>
				<RecipeView />
			</GridItem>
		</Grid>
	);
}

export default App;
