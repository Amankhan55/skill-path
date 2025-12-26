import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal(false);

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      this.enableDarkMode();
    } else if (savedTheme === 'light') {
      this.enableLightMode();
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        this.enableDarkMode();
      }
    }
  }

  toggleTheme(): void {
    if (this.isDarkMode()) {
      this.enableLightMode();
    } else {
      this.enableDarkMode();
    }
  }

  private enableDarkMode(): void {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    this.isDarkMode.set(true);
  }

  private enableLightMode(): void {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    this.isDarkMode.set(false);
  }
}

