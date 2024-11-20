import React, { useEffect } from "react";
import { Shop, GroceryLocation } from "../models/schema";
import ShopItem from "./ShopItem";
interface ShopTableProps {
	shoppingList: Shop[] | undefined;
}
const ShopTable: React.FC<ShopTableProps> = ({ shoppingList }) => {
	const [shoppingByLocation, setShoppingByLocation] = React.useState<Shop[]>(
		[]
	);
	const locations = new Set(shoppingList?.map((shop) => shop.grocery_location));
	const locationArray = Array.from(locations);

	const handleShoppingLocation = (location: GroceryLocation | undefined) => {
		var filteredShoppingList = shoppingList?.filter(
			(shop) => shop.grocery_location === location
		);
		return filteredShoppingList;
	};
	return (
		<>
			{locationArray?.map((location) => {
				return (
					<>
						<ShopItem
							location={location}
							list={handleShoppingLocation(location)}
						/>
					</>
				);
			})}
		</>
	);
};

export default ShopTable;
