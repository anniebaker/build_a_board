import { Button, ButtonGroup, Show } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
//import { Recipe, ApiResponse, Selected } from "./models/schema";
import { Checkbox, CheckboxGroup } from "@chakra-ui/react";
import RecipeView from "./components/RecipeView";

function App() {
	const layout = { base: `"nav" "main"`, md: `"nav nav" "aside main"` };

	return (
		<Grid templateAreas={layout}>
			<GridItem area={"nav"} bg="papayawhip">
				<NavBar />
			</GridItem>
			<Show above="md">
				<GridItem area={"aside"} bg="tomato"></GridItem>
			</Show>
			<GridItem area={"main"}>
				<RecipeView />
			</GridItem>
		</Grid>
	);
}

export default App;
