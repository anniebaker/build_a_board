import { extendTheme, ThemeConfig } from "@chakra-ui/react";

// Add color mode config
const config = {
    initialColorMode: 'system',
    useSystemColorMode: false,
  }
  
// Extend the theme
const theme = extendTheme({ config })
  
export default theme
