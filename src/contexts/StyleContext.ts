import {createContext} from "react";
// Theme colors are CSS variables, so SSR and hydration do not depend on a device.
const StyleContext = createContext({isDark: false});
export const StyleProvider = StyleContext.Provider;
export default StyleContext;
