const dotenv = require("dotenv");
const Pool = require("pg").Pool;

dotenv.config();

const pool = new Pool({
	user: process.env.USER,
	host: process.env.HOST,
	database: process.env.DB,
	password: process.env.PASSWORD,
	port: process.env.PORT,
});

//get all ingredients for selected recipes in our database
const getSelectedRecipeIngredients = async () => {
	try {
		return await new Promise(function (resolve, reject) {
			pool.query(
				"SELECT ingredients.name as name, ingredients.ingredient_id as id, recipe_list.id as recipe_id, recipe_list.recipe as recipe_name, ingredients.staple as staple, ingredients.grocery_location as grocery_location, recipe_ingredients.optional as optional FROM selected INNER JOIN recipe_list ON recipe_list.id = selected.selected_recipe_id INNER JOIN recipe_ingredients ON recipe_ingredients.recipe_id = recipe_list.id INNER JOIN ingredients ON ingredients.ingredient_id = recipe_ingredients.ingredient_id ORDER BY ingredients.name",
				(error, results) => {
					if (error) {
						reject(error);
					}
					if (results && results.rows) {
						resolve(results.rows);
					} else {
						reject(new Error("No ingredients found"));
					}
				}
			);
		});
	} catch (error_1) {
		console.error(error_1);
		throw new Error("Internal server error");
	}
};

const getAllRecipeIngredients = async () => {
	try {
		return await new Promise(function (resolve, reject) {
			pool.query(
				"SELECT recipe_list.recipe, recipe_list.id, recipe_list.method, recipe_list.made, recipe_list.genre, recipe_list.faves, recipe_list.meal_type, recipe_list.last_made, recipe_list.tags, recipe_ingredients.recipe_ingredient_name, ingredients.name FROM recipe_list INNER JOIN recipe_ingredients ON recipe_ingredients.recipe_id = recipe_list.id INNER JOIN ingredients ON ingredients.ingredient_id = recipe_ingredients.ingredient_id ORDER BY recipe_list.recipe",
				(error, results) => {
					if (error) {
						reject(error);
					}
					if (results && results.rows) {
						resolve(results.rows);
					} else {
						reject(new Error("No ingredients found"));
					}
				}
			);
		});
	} catch (error_1) {
		console.error(error_1);
		throw new Error("Internal server error");
	}
};

const createIngredient = (body) => {
	return new Promise(function (resolve, reject) {
		const { name, staple, grocery_location } = body;
		pool.query(
			"INSERT INTO ingredients (name, staple, grocery_location) VALUES ($1, $2, $3) RETURNING * ",
			[name, staple, grocery_location],
			(error, results) => {
				if (error) {
					reject(error);
				}
				if (results && results.rows) {
					resolve(
						`A new ingredient has been added: ${JSON.stringify(
							results.rows[0]
						)}`
					);
				} else {
					reject(new Error("No results found"));
				}
			}
		);
	});
};
// 'Produce', 'Baked Goods', 'Refrigerated', 'Vegetarian''s Corner', 'Dairy', 'Pantry', 'Frozen', 'Spices', 'Bulk Section', 'Specialty Store', 'Other', 'DIY'
//create a new recipe record in the databsse
const createRecipeIngredient = (body) => {
	return new Promise(function (resolve, reject) {
		const { name, staple, grocery_location } = body;
		pool.query(
			"INSERT INTO recipe_ingredients (recipe_ingredient_name, optional, ingredient_group, ingredient_id, recipe_id) VALUES ($1, $2, $3, $4, $5) RETURNING * ",
			[
				recipe_ingredient_name,
				optional,
				ingredient_group,
				ingredient_id,
				recipe_id,
			],
			(error, results) => {
				if (error) {
					reject(error);
				}
				if (results && results.rows) {
					resolve(
						`A new recipe ingredient has been added: ${JSON.stringify(
							results.rows[0]
						)}`
					);
				} else {
					reject(new Error("No results found"));
				}
			}
		);
	});
};

module.exports = {
	getSelectedRecipeIngredients,
	getAllRecipeIngredients,
	createIngredient,
	createRecipeIngredient,
};
