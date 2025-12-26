import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, SkillGap, ReadinessScore } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-gap-analysis',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Skill Gap Analysis
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          See exactly where you stand vs. your target role requirements.
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

      <!-- No Target Role -->
      @if (!loading() && !authService.currentUser()?.targetRole) {
        <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 text-center">
          <h3 class="text-lg font-bold text-yellow-900 dark:text-yellow-100 mb-2">
            No Target Role Selected
          </h3>
          <p class="text-yellow-800 dark:text-yellow-200 mb-4">
            Please select a target role first.
          </p>
          <a
            routerLink="/dashboard/role-selection"
            class="inline-block px-6 py-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Select Target Role
          </a>
        </div>
      }

      @if (!loading() && authService.currentUser()?.targetRole) {
        <!-- Readiness Score Card -->
        @if (readinessScore()) {
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white mb-8">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 class="text-2xl font-bold mb-2">
                  Your Readiness for {{ readinessScore()?.targetRoleName }}
                </h2>
                <p class="text-blue-100">
                  Based on your current skill levels vs. role requirements
                </p>
              </div>
              <div class="mt-4 md:mt-0 text-center">
                <div class="text-6xl font-bold">
                  {{ readinessScore()?.readinessPercentage || 0 }}%
                </div>
                <p class="text-blue-100 mt-2">
                  {{ readinessScore()?.readySkillsCount }} / {{ readinessScore()?.totalRequiredSkillsCount }} skills
                </p>
              </div>
            </div>
          </div>
        }

        <!-- Filters -->
        <div class="flex flex-wrap gap-3 mb-6">
          <button
            (click)="filterType.set('all')"
            [class.bg-blue-600]="filterType() === 'all'"
            [class.text-white]="filterType() === 'all'"
            [class.bg-gray-200]="filterType() !== 'all'"
            [class.dark:bg-gray-700]="filterType() !== 'all'"
            class="px-4 py-2 rounded-lg font-medium transition-colors"
          >
            All ({{ gaps().length }})
          </button>
          <button
            (click)="filterType.set('mandatory')"
            [class.bg-blue-600]="filterType() === 'mandatory'"
            [class.text-white]="filterType() === 'mandatory'"
            [class.bg-gray-200]="filterType() !== 'mandatory'"
            [class.dark:bg-gray-700]="filterType() !== 'mandatory'"
            class="px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Mandatory ({{ getMandatoryCount() }})
          </button>
          <button
            (click)="filterType.set('optional')"
            [class.bg-blue-600]="filterType() === 'optional'"
            [class.text-white]="filterType() === 'optional'"
            [class.bg-gray-200]="filterType() !== 'optional'"
            [class.dark:bg-gray-700]="filterType() !== 'optional'"
            class="px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Optional ({{ getOptionalCount() }})
          </button>
        </div>

        <!-- Gap List -->
        @if (getFilteredGaps().length > 0) {
          <div class="space-y-4">
            @for (gap of getFilteredGaps(); track gap.skillId) {
              <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <!-- Skill Info -->
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                      <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                        {{ gap.skillName }}
                      </h3>
                      @if (gap.isMandatory) {
                        <span class="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded font-medium">
                          MANDATORY
                        </span>
                      } @else {
                        <span class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                          Optional
                        </span>
                      }
                    </div>
                    
                    <div class="flex items-center space-x-6 text-sm">
                      <div>
                        <span class="text-gray-600 dark:text-gray-400">Current:</span>
                        <span class="font-semibold text-gray-900 dark:text-white ml-1">Level {{ gap.currentLevel }}</span>
                      </div>
                      <div>
                        <span class="text-gray-600 dark:text-gray-400">Required:</span>
                        <span class="font-semibold text-gray-900 dark:text-white ml-1">Level {{ gap.requiredLevel }}</span>
                      </div>
                      <div>
                        <span class="text-gray-600 dark:text-gray-400">Gap:</span>
                        <span [class.text-red-600]="gap.gap > 0" [class.text-green-600]="gap.gap === 0" class="font-semibold ml-1">
                          {{ gap.gap > 0 ? '+' + gap.gap : '✓' }}
                        </span>
                      </div>
                      <div>
                        <span class="text-gray-600 dark:text-gray-400">Priority:</span>
                        <span class="font-semibold text-gray-900 dark:text-white ml-1">{{ gap.priority.toFixed(1) }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Visual Gap Indicator -->
                  <div class="w-full md:w-64">
                    <div class="flex items-center space-x-2">
                      @for (level of [1, 2, 3, 4, 5]; track level) {
                        <div
                          [class.bg-green-500]="level <= gap.currentLevel"
                          [class.bg-red-200]="level > gap.currentLevel && level <= gap.requiredLevel"
                          [class.dark:bg-red-800]="level > gap.currentLevel && level <= gap.requiredLevel"
                          [class.bg-gray-200]="level > gap.requiredLevel"
                          [class.dark:bg-gray-700]="level > gap.requiredLevel"
                          class="flex-1 h-8 rounded flex items-center justify-center text-xs font-bold"
                          [class.text-white]="level <= gap.currentLevel"
                          [class.text-gray-600]="level > gap.currentLevel"
                        >
                          {{ level }}
                        </div>
                      }
                    </div>
                    <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>✓ Achieved</span>
                      <span>Gap</span>
                      <span>Not Required</span>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="text-center py-12 text-gray-500 dark:text-gray-400">
            No skill gaps found for the selected filter.
          </div>
        }

        <!-- Action Buttons -->
        <div class="mt-8 flex justify-between">
          <a
            routerLink="/dashboard/skills"
            class="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            ← Update Skills
          </a>
          <a
            routerLink="/dashboard/roadmap"
            class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            View Roadmap →
          </a>
        </div>
      }
    </div>
  `
})
export class GapAnalysisComponent implements OnInit {
  apiService = inject(ApiService);
  authService = inject(AuthService);

  gaps = signal<SkillGap[]>([]);
  readinessScore = signal<ReadinessScore | null>(null);
  filterType = signal<'all' | 'mandatory' | 'optional'>('all');
  loading = signal(false);

  ngOnInit(): void {
    const targetRole = this.authService.currentUser()?.targetRole;
    if (targetRole) {
      this.loadGapAnalysis(targetRole);
      this.loadReadinessScore(targetRole);
    }
  }

  loadGapAnalysis(targetRoleId: string): void {
    this.loading.set(true);

    this.apiService.getGapAnalysis(targetRoleId).subscribe({
      next: (response) => {
        this.gaps.set(response.gaps || []);
        this.loading.set(false);
      },
      error: () => {
        this.gaps.set([]);
        this.loading.set(false);
      }
    });
  }

  loadReadinessScore(targetRoleId: string): void {
    this.apiService.getReadinessScore(targetRoleId).subscribe({
      next: (response: any) => {
        this.readinessScore.set(response || null);
      },
      error: () => {
        this.readinessScore.set(null);
      }
    });
  }

  getFilteredGaps(): SkillGap[] {
    const allGaps = this.gaps();
    const filter = this.filterType();

    if (filter === 'mandatory') {
      return allGaps.filter(g => g.isMandatory);
    } else if (filter === 'optional') {
      return allGaps.filter(g => !g.isMandatory);
    }
    return allGaps;
  }

  getMandatoryCount(): number {
    return this.gaps().filter(g => g.isMandatory).length;
  }

  getOptionalCount(): number {
    return this.gaps().filter(g => !g.isMandatory).length;
  }
}

