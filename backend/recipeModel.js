const dotenv = require("dotenv");
//import * as dotenv from 'dotenv';
const Pool = require("pg").Pool;

dotenv.config();

const pool = new Pool({
	user: process.env.USER,
	host: process.env.HOST,
	database: process.env.DB,
	password: process.env.PASSWORD,
	port: process.env.PORT,
});

//get all recipes in our database
const getRecipes = async () => {
	try {
		return await new Promise(function (resolve, reject) {
			pool.query("SELECT * FROM recipe_list", (error, results) => {
				if (error) {
					reject(error);
				}
				if (results && results.rows) {
					resolve(results.rows);
				} else {
					reject(new Error("No results found"));
				}
			});
		});
	} catch (error_1) {
		console.error(error_1);
		throw new Error("Internal server error");
	}
};
// INSERT INTO recipe_list (recipe, method, made, genre, original_url, url, faves, meal_type, last_made, tags) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *"
//create a new recipe record in the databsse
const createRecipe = (body) => {
	return new Promise(function (resolve, reject) {
		const {
			id,
			recipe,
			method,
			made,
			genre,
			original_url,
			url,
			faves,
			meal_type,
			last_made,
			tags,
		} = body;
		pool.query(
			"INSERT INTO recipe_list (id, recipe, method, made, genre, original_url, url, faves, meal_type, last_made, tags) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
			[
				id,
				recipe,
				method,
				made,
				genre,
				original_url,
				url,
				faves,
				meal_type,
				last_made,
				tags,
			],
			(error, results) => {
				if (error) {
					reject(error);
				}
				if (results && results.rows) {
					resolve(
						`A new recipe has been added: ${JSON.stringify(results.rows[0])}`
					);
				} else {
					reject(new Error("No results found"));
				}
			}
		);
	});
};
//delete a recipe
const deleteRecipe = (id) => {
	return new Promise(function (resolve, reject) {
		pool.query(
			"DELETE FROM selected WHERE selected_id = $1",
			[id],
			(error, results) => {
				if (error) {
					reject(error);
				}
				resolve(`Recipe deleted with selected_id: ${id}`);
			}
		);
	});
};

//update a recipe record
const updateRecipe = (id, body) => {
	return new Promise(function (resolve, reject) {
		const { name, email } = body;
		pool.query(
			"UPDATE merchants SET recipe = $1, method = $2, meal = $3, favorites = $4, made = $5, genre = $6 WHERE id = $7 RETURNING *",
			[recipe, method, meal, favorites, made, genre, id],
			(error, results) => {
				if (error) {
					reject(error);
				}
				if (results && results.rows) {
					resolve(`Merchant updated: ${JSON.stringify(results.rows[0])}`);
				} else {
					reject(new Error("No results found"));
				}
			}
		);
	});
};

//get all recipes in our database
const getSelectedRecipes = async () => {
	try {
		return await new Promise(function (resolve, reject) {
			pool.query(
				"SELECT selected.selected_id, recipe_list.id, recipe_list.recipe, recipe_list.method, recipe_list.made, recipe_list.genre, recipe_list.original_url, recipe_list.url, recipe_list.faves, recipe_list.meal_type, recipe_list.last_made, recipe_list.tags FROM selected LEFT JOIN recipe_list ON recipe_list.id = selected.selected_recipe_id ORDER BY recipe_list.recipe",
				(error, results) => {
					if (error) {
						reject(error);
					}
					if (results && results.rows) {
						resolve(results.rows);
					} else {
						reject(new Error("No results found"));
					}
				}
			);
		});
	} catch (error_1) {
		console.error(error_1);
		throw new Error("Internal server error");
	}
};

const selectRecipe = (body) => {
	return new Promise(function (resolve, reject) {
		const { selected_recipe_id } = body;
		pool.query(
			"INSERT INTO selected (is_selected, selected_recipe_id) VALUES ('TRUE', $1) RETURNING *",
			[selected_recipe_id],
			(error, results) => {
				if (error) {
					reject(error);
				}
				if (results && results.rows) {
					resolve(
						`A new recipe has been selected: ${JSON.stringify(results.rows[0])}`
					);
				} else {
					reject(new Error("No results found"));
				}
			}
		);
	});
};

//delete a selection
const removeSelection = (selected_id) => {
	return new Promise(function (resolve, reject) {
		pool.query(
			"DELETE FROM selected WHERE selected_id = $1",
			[selected_id],
			(error, results) => {
				if (error) {
					reject(error);
				}
				resolve(`Selected deleted with selected_id: ${selected_id}`);
			}
		);
	});
};

//remove all selected
const clearAllSelected = (id) => {
	return new Promise(function (resolve, reject) {
		pool.query("TRUNCATE selected", [id], (error, results) => {
			if (error) {
				reject(error);
			}
			resolve(`Selected cleared`);
		});
	});
};

module.exports = {
	getRecipes,
	createRecipe,
	deleteRecipe,
	updateRecipe,
	getSelectedRecipes,
	selectRecipe,
	removeSelection,
	clearAllSelected,
};
