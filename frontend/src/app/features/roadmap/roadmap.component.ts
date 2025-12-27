import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, RoadmapItem } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Your Learning Roadmap
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          An ordered, dependency-aware path to reach your target role. Start from the top!
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
        <div class="glass-card dark:glass-card-dark border-white/30 rounded-xl p-6 text-center backdrop-blur-xl">
          <h3 class="text-lg font-bold text-yellow-900 dark:text-yellow-100 mb-2">
            No Target Role Selected
          </h3>
          <p class="text-yellow-800 dark:text-yellow-200 mb-4">
            Please select a target role and assess your skills first.
          </p>
          <a
            routerLink="/dashboard/role-selection"
            class="inline-block px-6 py-3 glass-card dark:glass-card-dark text-white font-medium rounded-xl hover:scale-105 transition-all backdrop-blur-xl border-white/30"
          >
            Get Started
          </a>
        </div>
      }

      @if (!loading() && authService.currentUser()?.targetRole) {
        <!-- Summary Card -->
        @if (roadmap() && roadmap().length > 0) {
          <div class="glass-card dark:glass-card-dark rounded-xl p-8 text-white mb-8 backdrop-blur-xl border-white/30">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 class="text-2xl font-bold mb-2">
                  {{ roadmap().length }} Skills to Learn
                </h2>
                <p class="text-green-100">
                  Estimated total time: {{ getTotalHours() }} hours ({{ getTotalHours() / 40 | number:'1.0-0' }} weeks at 40hrs/week)
                </p>
              </div>
              <div class="mt-4 md:mt-0 text-right">
                <p class="text-green-100 text-sm">Mandatory Skills</p>
                <p class="text-4xl font-bold">{{ getMandatoryCount() }} / {{ roadmap().length }}</p>
              </div>
            </div>
          </div>
        }

        <!-- Roadmap Items -->
        @if (roadmap().length > 0) {
          <div class="space-y-6">
            @for (item of roadmap(); track item.skillId; let index = $index) {
              <div class="glass-card dark:glass-card-dark rounded-xl backdrop-blur-xl overflow-hidden">
                <!-- Item Header -->
                <div class="p-6 border-b border-white/20 dark:border-white/10">
                  <div class="flex items-start justify-between">
                    <div class="flex items-start space-x-4 flex-1">
                      <!-- Order Badge -->
                      <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span class="text-white font-bold">{{ index + 1 }}</span>
                      </div>

                      <!-- Skill Info -->
                      <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-2">
                          <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                            {{ item.skillName }}
                          </h3>
                          @if (item.isMandatory) {
                            <span class="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded font-medium">
                              MANDATORY
                            </span>
                          }
                          <span class="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
                            Priority: {{ item.priority.toFixed(1) }}
                          </span>
                        </div>

                        <div class="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div class="flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            <span>Level {{ item.currentLevel }} → {{ item.targetLevel }}</span>
                          </div>
                          <div class="flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{{ item.estimatedHours }} hours</span>
                          </div>
                          @if (item.dependencies.length > 0) {
                            <div class="flex items-center text-orange-600 dark:text-orange-400">
                              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              <span>{{ item.dependencies.length }} dependencies</span>
                            </div>
                          }
                        </div>

                        <!-- Progress Bar -->
                        @if (item.topics.length > 0) {
                          <div class="mt-3">
                            <div class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                              <span>Progress</span>
                              <span>{{ getSkillCompletion(item) }}%</span>
                            </div>
                            <div class="w-full h-2 glass dark:glass-dark rounded-full overflow-hidden backdrop-blur-xl">
                              <div
                                [style.width.%]="getSkillCompletion(item)"
                                class="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
                              ></div>
                            </div>
                          </div>
                        }

                        <!-- Dependencies -->
                        @if (item.dependencies && item.dependencies.length > 0 && showDependencies().has(item.skillId)) {
                          <div class="mt-3 p-3 glass dark:glass-dark border-white/20 dark:border-white/10 rounded-xl backdrop-blur-xl">
                            <p class="text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">
                              Prerequisites (learn these first):
                            </p>
                            <div class="flex flex-wrap gap-2">
                              @for (dep of item.dependencies; track dep.skillId) {
                                <span class="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded">
                                  {{ dep.skillName }}
                                </span>
                              }
                            </div>
                          </div>
                        }
                      </div>
                    </div>

                    <!-- Expand/Collapse Button -->
                    <button
                      (click)="toggleExpand(item.skillId)"
                      class="ml-4 p-2 rounded-xl glass dark:glass-dark hover:scale-110 transition-all backdrop-blur-xl"
                    >
                      <svg
                        [class.rotate-180]="expandedItems().has(item.skillId)"
                        class="w-5 h-5 text-gray-600 dark:text-gray-300 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Expanded Content: Topics & Resources -->
                @if (expandedItems().has(item.skillId) && item.topics.length > 0) {
                  <div class="p-6 glass dark:glass-dark backdrop-blur-xl">
                    <h4 class="font-bold text-gray-900 dark:text-white mb-4">
                      📚 Learning Topics ({{ item.topics.length }})
                    </h4>
                    
                    <div class="space-y-4">
                      @for (topic of item.topics; track topic.topicId) {
                        <div class="glass-card dark:glass-card-dark rounded-xl p-4 backdrop-blur-xl border-white/20 dark:border-white/10">
                          <div class="flex items-start space-x-3 mb-2">
                            <!-- Checkbox -->
                            <button
                              (click)="toggleTopicComplete(item.skillId, topic.topicId)"
                              [class.bg-green-500]="isTopicCompleted(topic.topicId)"
                              [class.border-gray-300]="!isTopicCompleted(topic.topicId)"
                              [class.dark:border-gray-600]="!isTopicCompleted(topic.topicId)"
                              class="mt-1 w-5 h-5 flex items-center justify-center border-2 rounded transition-colors hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                              @if (isTopicCompleted(topic.topicId)) {
                                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                                </svg>
                              }
                            </button>
                            
                            <div class="flex-1">
                              <h5 [class.line-through]="isTopicCompleted(topic.topicId)" [class.text-gray-500]="isTopicCompleted(topic.topicId)" class="font-semibold text-gray-900 dark:text-white">
                                {{ topic.order }}. {{ topic.title }}
                              </h5>
                              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {{ topic.description }}
                              </p>
                              <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                ⏱️ ~{{ topic.estimatedHours }} hours
                              </p>
                            </div>
                          </div>

                          <!-- Mark Complete -->
                          <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <label class="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                [checked]="isTopicComplete(item.skillId, topic.topicId)"
                                (change)="toggleTopicComplete(item.skillId, topic.topicId)"
                                class="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                              />
                              <span class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Mark as Complete
                              </span>
                            </label>
                          </div>

                          <!-- Resources -->
                          @if (topic.resources.length > 0) {
                            <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                              <p class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                📖 Resources:
                              </p>
                              <div class="space-y-2">
                                @for (resource of topic.resources; track resource.url) {
                                  <a
                                    [href]="resource.url"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                  >
                                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    {{ resource.title }}
                                    <span class="ml-2 text-xs text-gray-500">({{ resource.type }})</span>
                                  </a>
                                }
                              </div>
                            </div>
                          }
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        } @else {
          <div class="glass-card dark:glass-card-dark rounded-xl p-12 text-center backdrop-blur-xl">
            <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No Learning Items Found
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              Either you're already proficient in all required skills, or you haven't assessed your skills yet.
            </p>
            <a
              routerLink="/dashboard/skills"
              class="inline-block px-6 py-3 glass-card dark:glass-card-dark text-white font-medium rounded-xl hover:scale-105 transition-all backdrop-blur-xl border-white/30"
            >
              Assess Your Skills
            </a>
          </div>
        }

        <!-- Navigation -->
        @if (roadmap().length > 0) {
          <div class="mt-8 flex justify-between">
            <a
              routerLink="/dashboard/gap-analysis"
              class="px-6 py-3 glass dark:glass-dark text-gray-900 dark:text-gray-100 font-medium rounded-xl hover:scale-105 transition-all backdrop-blur-xl"
            >
              ← View Gap Analysis
            </a>
            <a
              routerLink="/dashboard"
              class="px-6 py-3 glass-card dark:glass-card-dark text-white font-medium rounded-xl hover:scale-105 transition-all backdrop-blur-xl border-white/30"
            >
              Back to Dashboard
            </a>
          </div>
        }
      }
    </div>
  `
})
export class RoadmapComponent implements OnInit {
  apiService = inject(ApiService);
  authService = inject(AuthService);

  roadmap = signal<RoadmapItem[]>([]);
  expandedItems = signal<Set<string>>(new Set());
  showDependencies = signal<Set<string>>(new Set());
  completedTopics = signal<Set<string>>(new Set());
  loading = signal(false);

  ngOnInit(): void {
    const targetRole = this.authService.currentUser()?.targetRole;
    if (targetRole) {
      this.loadRoadmap(targetRole);
      this.loadProgress();
    }
  }

  loadProgress(): void {
    this.apiService.getProgress().subscribe({
      next: (progress) => {
        const completed = new Set<string>();
        if (progress && Array.isArray(progress)) {
          progress.forEach((p: any) => {
            if (p.completedTopics && Array.isArray(p.completedTopics)) {
              p.completedTopics.forEach((topicId: string) => {
                completed.add(`${p.skillId}_${topicId}`);
              });
            }
          });
        }
        this.completedTopics.set(completed);
      },
      error: () => {
        // Continue without progress data
      }
    });
  }

  isTopicComplete(skillId: string, topicId: string): boolean {
    return this.completedTopics().has(`${skillId}_${topicId}`);
  }

  toggleTopicComplete(skillId: string, topicId: string): void {
    const key = `${skillId}_${topicId}`;
    const completed = new Set(this.completedTopics());
    
    if (completed.has(key)) {
      // Already complete, do nothing (or implement un-complete if needed)
      return;
    }

    // Mark as complete
    this.apiService.markTopicComplete(skillId, topicId).subscribe({
      next: () => {
        completed.add(key);
        this.completedTopics.set(completed);
      },
      error: (error) => {
        alert('Failed to mark topic as complete');
      }
    });
  }

  loadRoadmap(targetRoleId: string): void {
    this.loading.set(true);

    this.apiService.getRoadmap(targetRoleId).subscribe({
      next: (response: { roadmap: RoadmapItem[] }) => {
        const roadmapData: RoadmapItem[] = response.roadmap || [];
        this.roadmap.set(roadmapData);
        this.loading.set(false);
        
        // Auto-show dependencies for items that have them
        const itemsWithDeps = new Set(
          roadmapData
            .filter(item => item.dependencies && item.dependencies.length > 0)
            .map(item => item.skillId)
        );
        this.showDependencies.set(itemsWithDeps);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  toggleExpand(skillId: string): void {
    const expanded = new Set(this.expandedItems());
    if (expanded.has(skillId)) {
      expanded.delete(skillId);
    } else {
      expanded.add(skillId);
    }
    this.expandedItems.set(expanded);
  }

  getTotalHours(): number {
    return this.roadmap().reduce((sum, item) => sum + item.estimatedHours, 0);
  }

  getMandatoryCount(): number {
    return this.roadmap().filter(item => item.isMandatory).length;
  }

  getSkillNameById(skillId: string): string {
    const skill = this.roadmap().find(item => item.skillId === skillId);
    return skill?.skillName || skillId;
  }

  getSkillCompletion(item: RoadmapItem): number {
    if (item.topics.length === 0) return 0;
    const completed = item.topics.filter(t => this.isTopicComplete(item.skillId, t.topicId)).length;
    return Math.round((completed / item.topics.length) * 100);
  }

  isTopicCompleted(topicId: string): boolean {
    // Alias for template compatibility
    return this.completedTopics().has(topicId);
  }
}

