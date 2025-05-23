export interface Theme {
  name: string;
  className: string;
  styles: {
    '--background': string;
    '--text': string;
    '--border': string;
    '--highlight': string;
    '--track': string;
    '--link': string;
    '--primary': string;
    '--primary-hover': string;
    '--secondary': string;
    '--card-bg': string;
    '--card-shadow': string;
    '--input-bg': string;
    '--input-border': string;
    '--dropdown-bg': string;
    '--dropdown-hover': string;
    '--skeuomorphic-depth': string;
  };
}

export const themes: Record<string, Theme> = {
  'dark-skeuomorphic': {
    name: 'Dark Skeuomorphic',
    className: 'dark-skeuomorphic',
    styles: {
      '--background': '#1E1E2E',
      '--text': '#E0DEF4',
      '--border': '#44475A',
      '--highlight': '#2A2A3A',
      '--track': '#6272A4',
      '--link': '#8BE9FD',
      '--primary': '#BD93F9',
      '--primary-hover': '#FF79C6',
      '--secondary': '#6272A4',
      '--card-bg': 'linear-gradient(145deg, #282A36, #21222C)',
      '--card-shadow': '8px 8px 16px #1A1B26, -8px -8px 16px #242635',
      '--input-bg': 'linear-gradient(145deg, #2E303E, #282A36)',
      '--input-border': '#44475A',
      '--dropdown-bg': '#282A36',
      '--dropdown-hover': '#3C3E4F',
      '--skeuomorphic-depth': '8px 8px 16px #1A1B26, -8px -8px 16px #242635',
    },
  },
  'light-brutalist': {
    name: 'Light Brutalist',
    className: 'light-brutalist',
    styles: {
      '--background': '#FFFFFF',
      '--text': '#000000',
      '--border': '#000000',
      '--highlight': '#F2F2F2',
      '--track': '#666666',
      '--link': '#0000FF',
      '--primary': '#000000',
      '--primary-hover': '#333333',
      '--secondary': '#CCCCCC',
      '--card-bg': '#FFFFFF',
      '--card-shadow': '4px 4px 0px #000000',
      '--input-bg': '#FFFFFF',
      '--input-border': '#000000',
      '--dropdown-bg': '#FFFFFF',
      '--dropdown-hover': '#F2F2F2',
      '--skeuomorphic-depth': 'none',
    },
  },
  'dark-retro': {
    name: 'Dark Retro',
    className: 'dark-retro',
    styles: {
      '--background': '#1A1A1A',
      '--text': '#33FF33',
      '--border': '#FF00FF',
      '--highlight': '#333333',
      '--track': '#00FFFF',
      '--link': '#FFFF00',
      '--primary': '#FF00FF',
      '--primary-hover': '#FF33FF',
      '--secondary': '#00FFFF',
      '--card-bg': '#0D0D0D',
      '--card-shadow': '0 0 10px rgba(0, 255, 255, 0.5)',
      '--input-bg': '#0D0D0D',
      '--input-border': '#FF00FF',
      '--dropdown-bg': '#0D0D0D',
      '--dropdown-hover': '#1A1A1A',
      '--skeuomorphic-depth': 'none',
    },
  },
};

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  Object.entries(theme.styles).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  root.className = theme.className;
};
