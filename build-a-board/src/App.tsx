import { Button, ButtonGroup, Show } from "@chakra-ui/react";
import { Grid, GridItem } from "@chakra-ui/react";

function App() {
  const layout = { base: `"nav" "main"`, md: `"nav nav" "aside main"` };
  return (
    <Grid templateAreas={layout}>
      <GridItem area={"nav"} bg="papayawhip">
        Nav
      </GridItem>
      <Show above="md">
        <GridItem area={"aside"} bg="tomato">
          Aside
        </GridItem>
      </Show>
      <GridItem area={"main"} bg="azure">
        Main
      </GridItem>
    </Grid>
  );
}

export default App;
