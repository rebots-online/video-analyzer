export type Theme = 'dark-skeuo' | 'light-brutalist' | 'dark-retro';

export interface ThemeConfig {
  className: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
}

export const themes: Record<Theme, ThemeConfig> = {
  'dark-skeuo': {
    className: 'dark-skeuo',
    colors: {
      primary: '#BD93F9',
      secondary: '#6272A4',
      background: '#1E1E2E',
      text: '#E0DEF4',
      accent: '#8BE9FD',
    },
  },
  'light-brutalist': {
    className: 'light-brutalist',
    colors: {
      primary: '#FF5555',
      secondary: '#6272A4',
      background: '#FFFFFF',
      text: '#282A36',
      accent: '#FF79C6',
    },
  },
  'dark-retro': {
    className: 'dark-retro',
    colors: {
      primary: '#FFB86C',
      secondary: '#8BE9FD',
      background: '#282A36',
      text: '#F8F8F2',
      accent: '#50FA7B',
    },
  },
};

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  const themeConfig = themes[theme];
  
  // Apply color variables
  Object.entries(themeConfig.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
  
  // Set the theme class
  root.className = themeConfig.className;
};
