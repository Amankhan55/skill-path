import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService, Role } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Select Your Target Role
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Choose the role you're aiming for. We'll analyze your skill gaps and create a personalized roadmap.
        </p>
      </div>

      <!-- Current Selection -->
      @if (authService.currentUser()?.targetRole) {
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <p class="text-sm text-blue-800 dark:text-blue-200">
            <span class="font-semibold">Current Target:</span> {{ getCurrentRoleName() }}
          </p>
        </div>
      }

      <!-- Loading State -->
      @if (loading()) {
        <div class="flex justify-center items-center py-12">
          <svg class="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      }

      <!-- Error State -->
      @if (errorMessage()) {
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage() }}</p>
        </div>
      }

      <!-- Roles Grid -->
      @if (!loading() && roles().length > 0) {
        <div class="grid grid-cols-1 gap-6">
          @for (role of roles(); track role._id) {
            <div
              (click)="selectRole(role)"
              [class.ring-2]="selectedRoleId() === role._id"
              [class.ring-blue-500]="selectedRoleId() === role._id"
              class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-3">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                      {{ role.name }}
                    </h3>
                    @if (selectedRoleId() === role._id) {
                      <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                    }
                  </div>
                  
                  <span class="inline-block px-3 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full mb-3">
                    {{ role.category }}
                  </span>
                  
                  <p class="text-gray-600 dark:text-gray-400 mb-4">
                    {{ role.description }}
                  </p>

                  @if (role.averageSalary) {
                    <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      ₹{{ formatSalary(role.averageSalary.min) }} - ₹{{ formatSalary(role.averageSalary.max) }} LPA
                    </div>
                  }
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Confirm Button -->
        @if (selectedRoleId()) {
          <div class="mt-8 flex justify-end space-x-4">
            <button
              (click)="cancel()"
              class="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              (click)="confirmSelection()"
              [disabled]="saving()"
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              @if (saving()) {
                <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              }
              <span>Confirm Selection</span>
            </button>
          </div>
        }
      }
    </div>
  `
})
export class RoleSelectionComponent implements OnInit {
  apiService = inject(ApiService);
  authService = inject(AuthService);
  router = inject(Router);

  roles = signal<Role[]>([]);
  selectedRoleId = signal<string>('');
  loading = signal(false);
  saving = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadRoles();
    const currentTarget = this.authService.currentUser()?.targetRole;
    if (currentTarget) {
      this.selectedRoleId.set(currentTarget);
    }
  }

  loadRoles(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.apiService.getRoles().subscribe({
      next: (roles) => {
        this.roles.set(roles);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Failed to load roles. Please try again.');
        this.loading.set(false);
      }
    });
  }

  selectRole(role: Role): void {
    this.selectedRoleId.set(role._id);
  }

  confirmSelection(): void {
    if (!this.selectedRoleId()) return;

    this.saving.set(true);
    this.errorMessage.set('');

    // Call backend API to save the target role
    this.authService.setTargetRole(this.selectedRoleId()).subscribe({
      next: () => {
        this.saving.set(false);
        // Navigate to skills assessment
        this.router.navigate(['/dashboard/skills']);
      },
      error: (error) => {
        this.saving.set(false);
        this.errorMessage.set('Failed to save target role. Please try again.');
        console.error('Error setting target role:', error);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }

  getCurrentRoleName(): string {
    const currentRoleId = this.authService.currentUser()?.targetRole;
    const role = this.roles().find(r => r._id === currentRoleId);
    return role?.name || '';
  }

  formatSalary(amount: number): string {
    return (amount / 100000).toFixed(1);
  }
}

