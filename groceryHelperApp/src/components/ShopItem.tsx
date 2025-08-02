import React from "react";
import { Shop, GroceryLocation } from "../models/schema";
import { Checkbox } from "./ui/checkbox";
import { Tag } from "../components/ui/tag";
import { HStack, Button } from "@chakra-ui/react";
interface ShopItemProps {
	list: Shop[] | undefined;
	location: GroceryLocation | undefined;
}
const ShopItem: React.FC<ShopItemProps> = ({ location, list }) => {
	return (
		<>
			{location && (
				<h2>
					{location.replace("{", "").replace("}", "").replaceAll('"', "")}
				</h2>
			)}
			{list &&
				list?.map((item) => (
					<HStack key={item.ingredient_id + "hstack"}>
						<Checkbox value={item.ingredient_id + "checkbox"}>
							{item.quantity === 1 ? "" : item.quantity} {item.item}{" "}
						</Checkbox>
						{item.staple && <Tag>staple</Tag>}
						{item.optional && <Tag>optional - {item.recipe_name}</Tag>}
					</HStack>
				))}
		</>
	);
};

export default ShopItem;
