import type React from 'react';
import { createContext, useContext } from 'react';

export interface ThemeContextProps {
  theme: string;
  setTheme: React.Dispatch<any>;
}

export const ThemeDefaultValue = {
  theme: '',
  setTheme: () => {},
};
export const ThemeContext = createContext<ThemeContextProps>(ThemeDefaultValue);

export const useThemeContext = () => {
  return useContext(ThemeContext);
};
