import { Button, ButtonGroup, Show } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import { Recipe, ApiResponse, Selected } from "./models/schema";
import { Checkbox, CheckboxGroup } from "@chakra-ui/react";

function App() {
  const [recipes, setRecipes] = useState<Recipe[] | undefined>();
  const [selected, setSelected] = useState<Selected[] | undefined>();

  const layout = { base: `"nav" "main"`, md: `"nav nav" "aside main"` };

  async function fetchRecipes(): Promise<Recipe[]> {
    const response = await fetch("http://localhost:3001");
    return response.json();
  }

  ///selected/:id

  async function fetchSelected(): Promise<Selected[]> {
    //let id = Math.floor(Math.random() * 100000).toString();
    const response = await fetch("http://localhost:3001/recipes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response);
    return response.json();
  }

  function deleteSelectedRecipe(selected_recipe_id: string) {
    fetch("http://localhost:3001/selected/" + selected_recipe_id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ selected_recipe_id }),
    })
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        fetchSelected().then((data) => setSelected(data));
      });
  }

  function selectRecipe(selected_recipe_id: string) {
    fetch("http://localhost:3001/selected", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ selected_recipe_id }),
    })
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        fetchSelected().then((data) => setSelected(data));
      });
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
  const handleRecipeCheck = (val: any) => {
    console.log(val);
    selectRecipe(val.target.value);
  };
  const handleDeselectRecipe = (val: any) => {
    deleteSelectedRecipe(val.target.value);
  };

  useEffect(() => {
    fetchRecipes().then((data) => setRecipes(data));
  }, []);
  useEffect(() => {
    fetchSelected().then((data) => setSelected(data));
  }, []);

  return (
    <Grid templateAreas={layout}>
      <GridItem area={"nav"} bg="papayawhip">
        <NavBar />
        <Button onClick={createRecipe}>Add recipe</Button>
      </GridItem>
      <Show above="md">
        <GridItem area={"aside"} bg="tomato">
          {selected?.map((selected) => (
            <>
              <Checkbox
                onChange={handleDeselectRecipe}
                defaultChecked
                key={selected.selected_id}
                value={selected.selected_id}
              >
                {selected.recipe}
              </Checkbox>
            </>
          ))}
        </GridItem>
      </Show>
      <GridItem area={"main"}>
        {recipes
          ? recipes.map((recipe) => (
              <Checkbox
                onChange={handleRecipeCheck}
                key={recipe.id}
                value={recipe.id}
              >
                {recipe.recipe}
              </Checkbox>
            ))
          : "No recipes yet"}
      </GridItem>
    </Grid>
  );
}

export default App;
