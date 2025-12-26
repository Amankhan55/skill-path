import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, Role } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

interface RoleReadiness {
  roleId: string;
  roleName: string;
  readinessPercentage: number;
  readySkillsCount: number;
  totalSkillsCount: number;
  missingSkills: Array<{
    skillId: string;
    skillName: string;
    currentLevel: number;
    requiredLevel: number;
    gap: number;
  }>;
}

@Component({
  selector: 'app-role-comparison',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Role Comparison
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          See how close you are to different roles and find your best fit
        </p>
      </div>

      <!-- Loading State -->
      @if (loading()) {
        <div class="flex justify-center items-center py-12">
          <svg class="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      }

      @if (!loading()) {
        <!-- Readiness Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          @for (comparison of roleComparisons(); track comparison.roleId) {
            <div
              [class.ring-2]="comparison.roleId === authService.currentUser()?.targetRole"
              [class.ring-blue-500]="comparison.roleId === authService.currentUser()?.targetRole"
              class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer"
              (click)="selectRole(comparison.roleId)"
            >
              <!-- Role Header -->
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                  {{ comparison.roleName }}
                </h3>
                @if (comparison.roleId === authService.currentUser()?.targetRole) {
                  <span class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded font-medium">
                    TARGET
                  </span>
                }
              </div>

              <!-- Readiness Circle -->
              <div class="flex items-center justify-center mb-4">
                <div class="relative w-32 h-32">
                  <svg class="w-32 h-32 transform -rotate-90">
                    <!-- Background circle -->
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      stroke-width="8"
                      fill="none"
                      class="text-gray-200 dark:text-gray-700"
                    />
                    <!-- Progress circle -->
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      stroke-width="8"
                      fill="none"
                      [attr.stroke-dasharray]="getCircumference()"
                      [attr.stroke-dashoffset]="getCircumference() - (getCircumference() * comparison.readinessPercentage) / 100"
                      [class.text-green-500]="comparison.readinessPercentage >= 80"
                      [class.text-blue-500]="comparison.readinessPercentage >= 50 && comparison.readinessPercentage < 80"
                      [class.text-yellow-500]="comparison.readinessPercentage >= 30 && comparison.readinessPercentage < 50"
                      [class.text-red-500]="comparison.readinessPercentage < 30"
                      class="transition-all duration-500"
                    />
                  </svg>
                  <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-3xl font-bold text-gray-900 dark:text-white">
                      {{ comparison.readinessPercentage }}%
                    </span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">Ready</span>
                  </div>
                </div>
              </div>

              <!-- Skills Count -->
              <div class="text-center mb-4">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ comparison.readySkillsCount }} of {{ comparison.totalSkillsCount }} skills ready
                </p>
              </div>

              <!-- Missing Skills Badge -->
              @if (comparison.missingSkills.length > 0) {
                <div class="flex items-center justify-center">
                  <span class="text-xs px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full">
                    {{ comparison.missingSkills.length }} skills to learn
                  </span>
                </div>
              }
            </div>
          }
        </div>

        <!-- Detailed Comparison -->
        @if (selectedRoleId()) {
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ getSelectedRoleName() }} - Detailed Breakdown
              </h2>
              <button
                (click)="setAsTargetRole()"
                class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Set as Target Role
              </button>
            </div>

            @if (getSelectedComparison()?.missingSkills && getSelectedComparison()!.missingSkills.length) {
              <div class="space-y-4">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                  Skills to Improve ({{ getSelectedComparison()!.missingSkills.length }})
                </h3>
                @for (skill of getSelectedComparison()?.missingSkills; track skill.skillId) {
                  <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div class="flex-1">
                      <h4 class="font-semibold text-gray-900 dark:text-white mb-2">
                        {{ skill.skillName }}
                      </h4>
                      <div class="flex items-center space-x-4 text-sm">
                        <span class="text-gray-600 dark:text-gray-400">
                          Current: Level {{ skill.currentLevel }}
                        </span>
                        <span class="text-gray-600 dark:text-gray-400">
                          Required: Level {{ skill.requiredLevel }}
                        </span>
                        <span class="text-red-600 dark:text-red-400 font-semibold">
                          Gap: +{{ skill.gap }}
                        </span>
                      </div>
                    </div>

                    <!-- Visual Progress Bar -->
                    <div class="w-32">
                      <div class="flex space-x-1">
                        @for (level of [1, 2, 3, 4, 5]; track level) {
                          <div
                            [class.bg-green-500]="level <= skill.currentLevel"
                            [class.bg-red-200]="level > skill.currentLevel && level <= skill.requiredLevel"
                            [class.dark:bg-red-800]="level > skill.currentLevel && level <= skill.requiredLevel"
                            [class.bg-gray-200]="level > skill.requiredLevel"
                            [class.dark:bg-gray-700]="level > skill.requiredLevel"
                            class="flex-1 h-6 rounded"
                          ></div>
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="text-center py-12">
                <svg class="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  You're fully qualified for this role! 🎉
                </h3>
                <p class="text-gray-600 dark:text-gray-400">
                  All required skills meet or exceed the needed levels
                </p>
              </div>
            }
          </div>
        }

        <!-- Recommendation -->
        @if (bestFitRole()) {
          <div class="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
            <h3 class="text-2xl font-bold mb-2">💡 Recommendation</h3>
            <p class="text-blue-100 mb-4">
              Based on your current skills, you're most ready for:
              <span class="font-bold text-white">{{ bestFitRole()?.roleName }}</span>
              ({{ bestFitRole()?.readinessPercentage }}% ready)
            </p>
            @if (bestFitRole()?.roleId !== authService.currentUser()?.targetRole) {
              <a
                routerLink="/dashboard/role-selection"
                class="inline-block px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
              >
                Consider Switching to This Role
              </a>
            }
          </div>
        }
      }
    </div>
  `
})
export class RoleComparisonComponent implements OnInit {
  apiService = inject(ApiService);
  authService = inject(AuthService);

  roleComparisons = signal<RoleReadiness[]>([]);
  selectedRoleId = signal<string>('');
  loading = signal(false);

  ngOnInit(): void {
    this.loadRoleComparisons();
  }

  loadRoleComparisons(): void {
    this.loading.set(true);

    // Load all roles and calculate readiness for each
    this.apiService.getRoles().subscribe({
      next: (roles) => {
        const comparisonPromises = roles.map(role => 
          this.apiService.getReadinessScore(role._id).toPromise()
            .then((readiness: any) => {
              // readiness is already the data object (API service maps it)
              return {
                roleId: role._id,
                roleName: role.name,
                readinessPercentage: readiness.readinessPercentage || 0,
                readySkillsCount: readiness.readySkillsCount || 0,
                totalSkillsCount: readiness.totalRequiredSkillsCount || 0,
                missingSkills: (readiness.skillBreakdown || [])
                  .filter((s: any) => !s.isReady)
                  .map((s: any) => ({
                    skillId: s.skillId,
                    skillName: s.skillName,
                    currentLevel: s.currentLevel || 0,
                    requiredLevel: s.requiredLevel || 0,
                    gap: s.gap || 0
                  }))
              };
            })
            .catch(() => ({
              roleId: role._id,
              roleName: role.name,
              readinessPercentage: 0,
              readySkillsCount: 0,
              totalSkillsCount: 0,
              missingSkills: []
            }))
        );

        Promise.all(comparisonPromises).then(comparisons => {
          this.roleComparisons.set(comparisons);
          this.loading.set(false);

          // Auto-select current target role or best fit
          const targetRole = this.authService.currentUser()?.targetRole;
          if (targetRole) {
            this.selectedRoleId.set(targetRole);
          } else if (comparisons.length > 0) {
            const best = comparisons.reduce((a, b) => 
              a.readinessPercentage > b.readinessPercentage ? a : b
            );
            this.selectedRoleId.set(best.roleId);
          }
        });
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  selectRole(roleId: string): void {
    this.selectedRoleId.set(roleId);
  }

  getSelectedComparison(): RoleReadiness | undefined {
    return this.roleComparisons().find(r => r.roleId === this.selectedRoleId());
  }

  getSelectedRoleName(): string {
    return this.getSelectedComparison()?.roleName || '';
  }

  setAsTargetRole(): void {
    const roleId = this.selectedRoleId();
    if (!roleId) return;

    this.authService.setTargetRole(roleId).subscribe({
      next: () => {
        alert(`Target role updated to ${this.getSelectedRoleName()}!`);
      },
      error: () => {
        alert('Failed to update target role. Please try again.');
      }
    });
  }

  bestFitRole(): RoleReadiness | null {
    const comparisons = this.roleComparisons();
    if (comparisons.length === 0) return null;

    return comparisons.reduce((best, current) => 
      current.readinessPercentage > best.readinessPercentage ? current : best
    );
  }

  getCircumference(): number {
    return 2 * Math.PI * 56; // radius is 56
  }
}
