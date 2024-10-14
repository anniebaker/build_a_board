import { Button, ButtonGroup, Show } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import { Recipe, ApiResponse } from "./models/schema";

function App() {
  const [recipes, setRecipes] = useState<Recipe[] | undefined>();

  const layout = { base: `"nav" "main"`, md: `"nav nav" "aside main"` };

  async function fetchRecipes(): Promise<Recipe[]> {
    const response = await fetch("http://localhost:3001");
    return response.json();
  }

  function createRecipe() {
    let id = Math.floor(Math.random() * 100000).toString();
    let recipe = prompt("Enter recipe name");
    fetch("http://localhost:3001/recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, recipe }),
    })
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        alert(data);
        fetchRecipes().then((data) => setRecipes(data));
      });
  }

  useEffect(() => {
    fetchRecipes().then((data) => setRecipes(data));
  }, []);

  return (
    <Grid templateAreas={layout}>
      <GridItem area={"nav"} bg="papayawhip">
        <NavBar />
      </GridItem>
      <Show above="md">
        <GridItem area={"aside"} bg="tomato">
          Aside
        </GridItem>
      </Show>
      <GridItem area={"main"}>
        Main
        <Button onClick={createRecipe}>Add recipe</Button>
        {recipes
          ? recipes.map((recipe) => <div key={recipe.id}>{recipe.recipe}</div>)
          : "No recipes yet"}
      </GridItem>
    </Grid>
  );
}

export default App;
