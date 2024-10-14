const express = require('express')
const app = express()
const port = 3001

const recipe_model = require('./recipeModel')

app.use(express.json())

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

// app.use(function (req, res, next) {
//     res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
//     res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
//     res.setHeader(
//       "Access-Control-Allow-Headers",
//       "Content-Type, Access-Control-Allow-Headers"
//     );
//     next();
//   });

app.get('/', (req, res) => {
  recipe_model.getRecipes()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.post('/recipes', (req, res) => {
  recipe_model.createRecipe(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.delete('/recipes/:id', (req, res) => {
  recipe_model.deleteRecipe(req.params.id)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})
app.put("/recipes/:id", (req, res) => {
  const id = req.params.id;
  const body = req.body;
  recipe_model
    .updateRecipe(id, body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})