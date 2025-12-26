import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, ThemeToggleComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <nav class="container mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <!-- Logo -->
            <a routerLink="/dashboard" class="flex items-center space-x-2 group">
              <img src="/skillpath.png" alt="SkillPath Logo" class="h-10 w-auto group-hover:scale-110 transition-transform" />
              <span class="text-xl font-bold text-gray-900 dark:text-white">SkillPath</span>
            </a>

            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center space-x-6">
              <a routerLink="/dashboard" routerLinkActive="text-blue-600 dark:text-blue-400" class="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                Dashboard
              </a>
              <a routerLink="/dashboard/skills" routerLinkActive="text-blue-600 dark:text-blue-400" class="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                Skills
              </a>
              <a routerLink="/dashboard/roadmap" routerLinkActive="text-blue-600 dark:text-blue-400" class="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                Roadmap
              </a>
              <a routerLink="/dashboard/role-comparison" routerLinkActive="text-blue-600 dark:text-blue-400" class="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                Compare
              </a>
            </div>

            <!-- User Menu & Theme Toggle -->
            <div class="hidden md:flex items-center space-x-4">
              <app-theme-toggle></app-theme-toggle>
              
              <!-- User Dropdown -->
              <div class="relative">
                <button
                  (click)="userMenuOpen = !userMenuOpen"
                  class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-medium">{{ getUserInitials() }}</span>
                  </div>
                  <svg class="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                @if (userMenuOpen) {
                  <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                    <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ authService.currentUser()?.name }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ authService.currentUser()?.email }}</p>
                    </div>
                    <a
                      routerLink="/dashboard/profile"
                      (click)="userMenuOpen = false"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Profile Settings
                    </a>
                    <button
                      (click)="logout()"
                      class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                }
              </div>
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
            <div class="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div class="flex flex-col space-y-3">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ authService.currentUser()?.name }}</span>
                  <app-theme-toggle></app-theme-toggle>
                </div>
                <a routerLink="/dashboard" (click)="mobileMenuOpen = false" class="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  Dashboard
                </a>
                <a routerLink="/dashboard/role-selection" (click)="mobileMenuOpen = false" class="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  Roles
                </a>
                <a routerLink="/dashboard/role-selection" (click)="mobileMenuOpen = false" class="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  Roles
                </a>
                <a routerLink="/dashboard/skills" (click)="mobileMenuOpen = false" class="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  Skills
                </a>
                <a routerLink="/dashboard/roadmap" (click)="mobileMenuOpen = false" class="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  Roadmap
                </a>
                <a routerLink="/dashboard/role-comparison" (click)="mobileMenuOpen = false" class="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  Compare Roles
                </a>
                <a routerLink="/dashboard/profile" (click)="mobileMenuOpen = false" class="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  Profile
                </a>
                <button
                  (click)="logout()"
                  class="text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            </div>
          }
        </nav>
      </header>

      <!-- Main Content -->
      <main class="container mx-auto px-4 py-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class DashboardLayoutComponent {
  authService = inject(AuthService);
  router = inject(Router);
  
  mobileMenuOpen = false;
  userMenuOpen = false;

  getUserInitials(): string {
    const name = this.authService.currentUser()?.name || '';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  logout(): void {
    this.userMenuOpen = false;
    this.mobileMenuOpen = false;
    this.authService.logout();
  }
}

