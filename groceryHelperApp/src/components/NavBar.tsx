import { HStack, Image } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { LuMenu } from "react-icons/lu";
import { MenuRoot, MenuTrigger, MenuContent, MenuItem } from "./ui/menu";
import { View } from "../App";
import { SelectionDetails } from "@chakra-ui/react/dist/types/components/menu/namespace";
interface NavBarProps {
	viewChange: (view: View) => void;
	//shoppingList: Shop[] | undefined;
}
interface Details {
	value: string;
}
const NavBar: React.FC<NavBarProps> = ({ viewChange }) => {
	const handleSelect = (details: Details) => {
		viewChange(details.value as View);
	};

	return (
		<MenuRoot
			positioning={{ placement: "right-start" }}
			composite
			closeOnSelect
			size="md"
			onSelect={handleSelect}
		>
			<MenuTrigger asChild>
				<IconButton variant="ghost" size="lg">
					<LuMenu />
				</IconButton>
			</MenuTrigger>
			<MenuContent>
				<MenuItem value="recipes">Recipes</MenuItem>
				<MenuItem value="new_recipe">Add Recipe</MenuItem>
				<MenuItem value="shopping">Shopping List</MenuItem>
			</MenuContent>
		</MenuRoot>
	);
};

export default NavBar;
