import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Your Profile
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      <!-- Profile Card -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-6">
        <!-- Success Message -->
        @if (successMessage()) {
          <div class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p class="text-sm text-green-600 dark:text-green-400">{{ successMessage() }}</p>
          </div>
        }

        <!-- Error Message -->
        @if (errorMessage()) {
          <div class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage() }}</p>
          </div>
        }

        <form (ngSubmit)="saveProfile()">
          <!-- Avatar Section -->
          <div class="flex items-center space-x-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <div class="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span class="text-white text-3xl font-bold">{{ getInitials() }}</span>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ name() }}</h3>
              <p class="text-gray-600 dark:text-gray-400">{{ email() }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Member since {{ getMemberSince() }}
              </p>
            </div>
          </div>

          <!-- Personal Information -->
          <div class="space-y-6">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Personal Information</h3>
            
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                [(ngModel)]="name"
                name="name"
                required
                [disabled]="saving()"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors disabled:opacity-50"
              />
            </div>

            <!-- Email (read-only) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                disabled
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Email cannot be changed
              </p>
            </div>

            <!-- Experience Years -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                [(ngModel)]="experienceYears"
                name="experience"
                min="0"
                max="50"
                [disabled]="saving()"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors disabled:opacity-50"
              />
            </div>

            <!-- Current Role -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Role (Optional)
              </label>
              <input
                type="text"
                [(ngModel)]="currentRole"
                name="currentRole"
                [disabled]="saving()"
                placeholder="e.g., Junior Developer, UI Designer"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors disabled:opacity-50"
              />
            </div>

            <!-- Target Role (read-only, link to change) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Role
              </label>
              <div class="flex items-center space-x-4">
                <input
                  type="text"
                  [value]="targetRole() || 'Not set'"
                  disabled
                  class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
                <a
                  routerLink="/dashboard/role-selection"
                  class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Change
                </a>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex justify-between">
            <a
              routerLink="/dashboard"
              class="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </a>
            <button
              type="submit"
              [disabled]="saving()"
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              @if (saving()) {
                <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              }
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Account Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Skills Assessed</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ skillsCount() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Days Active</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ getDaysActive() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Readiness</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ readinessScore() }}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  http = inject(HttpClient);

  name = signal('');
  email = signal('');
  experienceYears = signal<number | null>(null);
  currentRole = signal('');
  targetRole = signal('');
  skillsCount = signal(0);
  readinessScore = signal(0);
  
  saving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.name.set(user.name);
      this.email.set(user.email);
      this.experienceYears.set(user.experienceYears || null);
      this.currentRole.set(user.currentRole || '');
      this.targetRole.set(user.targetRole || '');
    }

    // Load stats
    this.loadStats();
  }

  loadStats(): void {
    // Load skills count and readiness
    this.http.get<any>(`${environment.apiUrl}/dashboard`).subscribe({
      next: (data) => {
        this.skillsCount.set(data.skillsAssessed || 0);
        this.readinessScore.set(data.readinessScore?.readinessPercentage || 0);
      },
      error: () => {
        // Silent fail for stats
      }
    });
  }

  saveProfile(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.saving.set(true);

    const updateData = {
      name: this.name(),
      experienceYears: this.experienceYears(),
      currentRole: this.currentRole()
    };

    this.http.put(`${environment.apiUrl}/auth/profile`, updateData).subscribe({
      next: (response: any) => {
        // Update local user object
        const user = this.authService.currentUser();
        if (user) {
          user.name = this.name();
          user.experienceYears = this.experienceYears() || undefined;
          user.currentRole = this.currentRole() || undefined;
          localStorage.setItem('skillpath_user', JSON.stringify(user));
          this.authService.currentUser.set(user);
        }

        this.successMessage.set('Profile updated successfully!');
        this.saving.set(false);

        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage.set('');
        }, 3000);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Failed to update profile');
        this.saving.set(false);
      }
    });
  }

  getInitials(): string {
    return this.name()
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getMemberSince(): string {
    const user = this.authService.currentUser();
    if (user?.createdAt) {
      return new Date(user.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
    }
    return 'Recently';
  }

  getDaysActive(): number {
    const user = this.authService.currentUser();
    if (user?.createdAt) {
      const created = new Date(user.createdAt);
      const now = new Date();
      const diff = now.getTime() - created.getTime();
      return Math.floor(diff / (1000 * 60 * 60 * 24));
    }
    return 0;
  }
}
