import React from "react";
import { Shop, GroceryLocation } from "../models/schema";
import { Checkbox } from "./ui/checkbox";
import { Tag } from "../components/ui/tag";
import { HStack } from "@chakra-ui/react";
interface ShopItemProps {
	list: Shop[] | undefined;
	location: GroceryLocation | undefined;
}
const ShopItem: React.FC<ShopItemProps> = ({ location, list }) => {
	return (
		<>
			{location && (
				<h2>{location.replace("{", "").replace("}", "").replace('"', "")}</h2>
			)}
			{list?.map((item) => {
				return (
					<>
						<HStack>
							<Checkbox key={item.item} value={item.ingredient_id}>
								{item.quantity === 1 ? "" : item.quantity} {item.item}{" "}
								{item.optional && `(optional for ${item.recipe_name})`}
							</Checkbox>
							{item.staple && <Tag>staple</Tag>}
						</HStack>
					</>
				);
			})}
		</>
	);
};

export default ShopItem;
