import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  currentTheme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first
    const saved = localStorage.getItem('theme') as Theme;
    if (saved && (saved === 'light' || saved === 'dark' || saved === 'system')) {
      return saved;
    }
    
    // Default to system if no saved preference
    return 'system';
  });

  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(() => {
    // Get system preference
    const getSystemTheme = (): 'light' | 'dark' => {
      if (typeof window === 'undefined') return 'light';
      
      // Check if the browser supports prefers-color-scheme
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      
      // Fallback to light if no system preference detected
      return 'light';
    };

    if (theme === 'system') {
      return getSystemTheme();
    }
    
    return theme;
  });

  // Update current theme when theme preference changes
  useEffect(() => {
    const updateCurrentTheme = () => {
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setCurrentTheme(systemTheme);
      } else {
        setCurrentTheme(theme);
      }
    };

    updateCurrentTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        updateCurrentTheme();
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

  // Apply theme to document and CSS variables
  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Update data-theme attribute on document element
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update CSS variables based on current theme
    const root = document.documentElement;
    
    if (currentTheme === 'dark') {
      // Dark theme
      root.style.setProperty('--background', '0 0% 3.9%');
      root.style.setProperty('--foreground', '0 0% 98%');
      root.style.setProperty('--card', '0 0% 7%');
      root.style.setProperty('--card-foreground', '0 0% 98%');
      root.style.setProperty('--muted', '0 0% 14.9%');
      root.style.setProperty('--muted-foreground', '0 0% 63.9%');
      root.style.setProperty('--border', '0 0% 14.9%');
      root.style.setProperty('--input', '0 0% 14.9%');
      root.style.setProperty('--ring', '142 76% 36%');
      
      // Additional variables
      root.style.setProperty('--sidebar-background', '0 0% 7%');
      root.style.setProperty('--sidebar-foreground', '0 0% 98%');
      root.style.setProperty('--sidebar-border', '0 0% 14.9%');
    } else {
      // Light theme
      root.style.setProperty('--background', '0 0% 100%');
      root.style.setProperty('--foreground', '0 0% 3.9%');
      root.style.setProperty('--card', '0 0% 100%');
      root.style.setProperty('--card-foreground', '0 0% 3.9%');
      root.style.setProperty('--muted', '0 0% 96.1%');
      root.style.setProperty('--muted-foreground', '0 0% 45.1%');
      root.style.setProperty('--border', '0 0% 89.8%');
      root.style.setProperty('--input', '0 0% 89.8%');
      root.style.setProperty('--ring', '142 76% 36%');
      
      // Additional variables
      root.style.setProperty('--sidebar-background', '0 0% 98%');
      root.style.setProperty('--sidebar-foreground', '0 0% 3.9%');
      root.style.setProperty('--sidebar-border', '0 0% 89.8%');
    }
  }, [currentTheme, theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    // Cycle through themes: system -> light -> dark -> system
    setThemeState(prev => {
      if (prev === 'system') return 'light';
      if (prev === 'light') return 'dark';
      return 'system';
    });
  };

  const value: ThemeContextType = {
    theme,
    currentTheme,
    toggleTheme,
    setTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};