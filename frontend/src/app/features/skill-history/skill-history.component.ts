import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface SkillHistoryEntry {
  _id: string;
  userId: string;
  skillId: string;
  skillName: string;
  previousLevel: number;
  newLevel: number;
  changeReason?: string;
  timestamp: string;
}

@Component({
  selector: 'app-skill-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Skill History
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Track your skill development over time
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
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Updates</h3>
              <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ history().length }}</p>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400">Skills Improved</h3>
              <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ getImprovementsCount() }}</p>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400">Unique Skills</h3>
              <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ getUniqueSkillsCount() }}</p>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Growth</h3>
              <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">+{{ getAverageGrowth().toFixed(1) }}</p>
          </div>
        </div>

        <!-- Timeline -->
        @if (history().length > 0) {
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Timeline</h2>
            
            <div class="relative">
              <!-- Timeline Line -->
              <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

              <!-- History Entries -->
              <div class="space-y-8">
                @for (entry of history(); track entry._id) {
                  <div class="relative pl-16">
                    <!-- Timeline Dot -->
                    <div
                      [class.bg-green-500]="entry.newLevel > entry.previousLevel"
                      [class.bg-yellow-500]="entry.newLevel === entry.previousLevel"
                      [class.bg-red-500]="entry.newLevel < entry.previousLevel"
                      class="absolute left-6 w-5 h-5 rounded-full border-4 border-white dark:border-gray-800"
                    ></div>

                    <!-- Entry Card -->
                    <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <div class="flex items-start justify-between mb-2">
                        <div>
                          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                            {{ entry.skillName }}
                          </h3>
                          <p class="text-sm text-gray-500 dark:text-gray-400">
                            {{ formatDate(entry.timestamp) }}
                          </p>
                        </div>
                        
                        <!-- Level Change Badge -->
                        <div class="flex items-center space-x-2">
                          <span class="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded font-medium">
                            Level {{ entry.previousLevel }}
                          </span>
                          @if (entry.newLevel > entry.previousLevel) {
                            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                          } @else if (entry.newLevel < entry.previousLevel) {
                            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                            </svg>
                          } @else {
                            <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h16" />
                            </svg>
                          }
                          <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded font-medium">
                            Level {{ entry.newLevel }}
                          </span>
                        </div>
                      </div>

                      <!-- Change Indicator -->
                      <div class="mt-3">
                        @if (entry.newLevel > entry.previousLevel) {
                          <p class="text-sm text-green-600 dark:text-green-400 font-medium">
                            ↑ Improved by {{ entry.newLevel - entry.previousLevel }} level(s)
                          </p>
                        } @else if (entry.newLevel < entry.previousLevel) {
                          <p class="text-sm text-red-600 dark:text-red-400 font-medium">
                            ↓ Decreased by {{ entry.previousLevel - entry.newLevel }} level(s)
                          </p>
                        } @else {
                          <p class="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                            = Re-assessed (no change)
                          </p>
                        }
                      </div>

                      @if (entry.changeReason) {
                        <div class="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">
                          Note: {{ entry.changeReason }}
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        } @else {
          <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-12 text-center">
            <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No Skill History Yet
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              Start assessing and updating your skills to track your progress
            </p>
            <a
              routerLink="/dashboard/skills"
              class="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Assess Your Skills
            </a>
          </div>
        }

        <!-- Back Button -->
        <div class="mt-8">
          <a
            routerLink="/dashboard"
            class="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </a>
        </div>
      }
    </div>
  `
})
export class SkillHistoryComponent implements OnInit {
  http = inject(HttpClient);

  history = signal<SkillHistoryEntry[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.loading.set(true);

    this.http.get<SkillHistoryEntry[]>(`${environment.apiUrl}/skills/history`).subscribe({
      next: (data) => {
        // Sort by timestamp descending (most recent first)
        const sorted = data.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        this.history.set(sorted);
        this.loading.set(false);
      },
      error: () => {
        this.history.set([]);
        this.loading.set(false);
      }
    });
  }

  getImprovementsCount(): number {
    return this.history().filter(h => h.newLevel > h.previousLevel).length;
  }

  getUniqueSkillsCount(): number {
    const uniqueSkills = new Set(this.history().map(h => h.skillId));
    return uniqueSkills.size;
  }

  getAverageGrowth(): number {
    const improvements = this.history().filter(h => h.newLevel > h.previousLevel);
    if (improvements.length === 0) return 0;
    
    const totalGrowth = improvements.reduce((sum, h) => sum + (h.newLevel - h.previousLevel), 0);
    return totalGrowth / improvements.length;
  }

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

