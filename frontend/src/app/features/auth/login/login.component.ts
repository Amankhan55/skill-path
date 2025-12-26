import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div class="max-w-md w-full">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            Sign in to continue your learning journey
          </p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <form (ngSubmit)="onSubmit()">
            <!-- Error Message -->
            @if (errorMessage) {
              <div class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
              </div>
            }

            <!-- Email -->
            <div class="mb-6">
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                [(ngModel)]="email"
                name="email"
                required
                [disabled]="authService.isLoading()"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors disabled:opacity-50"
                placeholder="you@example.com"
              />
            </div>

            <!-- Password -->
            <div class="mb-6">
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                [(ngModel)]="password"
                name="password"
                required
                [disabled]="authService.isLoading()"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="authService.isLoading()"
              class="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              @if (authService.isLoading()) {
                <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              } @else {
                <span>Sign In</span>
              }
            </button>
          </form>

          <!-- Divider -->
          <div class="my-6 flex items-center">
            <div class="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
            <span class="px-4 text-sm text-gray-500 dark:text-gray-400">or</span>
            <div class="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          </div>

          <!-- Register Link -->
          <p class="text-center text-gray-600 dark:text-gray-400">
            Don't have an account?
            <a routerLink="/register" class="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  authService = inject(AuthService);
  
  email = '';
  password = '';
  errorMessage = '';

  onSubmit(): void {
    this.errorMessage = '';
    
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        // Navigation handled by AuthService
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
      }
    });
  }
}

