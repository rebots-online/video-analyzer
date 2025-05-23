export interface VideoAnalysis {
  summary: string;
  timestamps: Array<{
    time: number;
    text: string;
    objects?: string[];
  }>;
}

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

export interface ModeConfig {
  emoji: string;
  prompt: string;
  isList?: boolean;
}

export interface Modes {
  [key: string]: ModeConfig & {
    subModes?: {
      [key: string]: ModeConfig;
    };
  };
}
