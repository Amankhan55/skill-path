import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, ThemeToggleComponent],
  template: `
    <div class="min-h-screen gradient-bg transition-colors">
      <!-- Header -->
      <header class="glass-nav dark:glass-nav-dark sticky top-0 z-50 transition-all">
        <nav class="container mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <!-- Logo -->
            <a routerLink="/" class="flex items-center space-x-2 group">
              <img src="/skillpath.png" alt="skillpathLogo" class="h-10 w-auto group-hover:scale-110 transition-transform" />
              <span class="text-xl font-bold text-gray-900 dark:text-white">SkillPath</span>
            </a>

            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center space-x-4">
              <!-- Theme Toggle -->
              <app-theme-toggle></app-theme-toggle>

              <!-- Auth Buttons or Dashboard Link -->
              @if (authService.isAuthenticated()) {
                <a
                  routerLink="/dashboard"
                  class="px-6 py-2 glass-card dark:glass-card-dark text-white rounded-xl hover:scale-105 transition-all font-medium backdrop-blur-lg"
                >
                  Dashboard
                </a>
              } @else {
                <a
                  routerLink="/login"
                  class="px-4 py-2 glass dark:glass-dark text-gray-900 dark:text-gray-200 rounded-xl hover:scale-105 transition-all font-medium"
                >
                  Sign In
                </a>
                <a
                  routerLink="/register"
                  class="px-6 py-2 glass-card dark:glass-card-dark text-white rounded-xl hover:scale-105 transition-all font-medium backdrop-blur-lg"
                >
                  Get Started
                </a>
              }
            </div>

            <!-- Mobile Menu Button -->
            <button
              (click)="mobileMenuOpen = !mobileMenuOpen"
              class="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                @if (!mobileMenuOpen) {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                } @else {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                }
              </svg>
            </button>
          </div>

          <!-- Mobile Menu -->
          @if (mobileMenuOpen) {
            <div class="md:hidden mt-4 pt-4 border-t border-white/20 dark:border-white/10">
              <div class="flex flex-col space-y-3">
                <div class="flex justify-end">
                  <app-theme-toggle></app-theme-toggle>
                </div>
                @if (authService.isAuthenticated()) {
                  <a
                    routerLink="/dashboard"
                    (click)="mobileMenuOpen = false"
                    class="px-4 py-2 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    Dashboard
                  </a>
                } @else {
                  <a
                    routerLink="/login"
                    (click)="mobileMenuOpen = false"
                    class="px-4 py-2 text-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Sign In
                  </a>
                  <a
                    routerLink="/register"
                    (click)="mobileMenuOpen = false"
                    class="px-4 py-2 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    Get Started
                  </a>
                }
              </div>
            </div>
          }
        </nav>
      </header>

      <!-- Main Content -->
      <main>
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div class="container mx-auto px-4 py-8">
          <div class="text-center text-gray-600 dark:text-gray-400">
            <p class="mb-2">
              <span class="font-semibold text-gray-900 dark:text-white">SkillPath</span> - Your career roadmap, data-driven
            </p>
            <p class="text-sm">
              © 2025 SkillPath. Built with clarity in mind.
            </p>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class MainLayoutComponent {
  authService = inject(AuthService);
  mobileMenuOpen = false;
}

