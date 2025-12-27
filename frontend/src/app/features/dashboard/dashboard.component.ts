import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <!-- Welcome Section -->
      <div class="glass-card dark:glass-card-dark rounded-xl p-8 text-white backdrop-blur-xl border-white/30">
        <h1 class="text-3xl font-bold mb-2">
          Welcome back, {{ getUserFirstName() }}! 👋
        </h1>
        <p class="text-blue-100">
          Let's continue your journey to becoming {{ targetRoleName() || 'your dream role' }}
        </p>
      </div>

      <!-- Quick Stats -->
      @if (readinessScore()) {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Readiness Score -->
          <div class="glass-card dark:glass-card-dark rounded-xl p-6 backdrop-blur-xl">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400">Readiness Score</h3>
              <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {{ readinessScore()?.readinessPercentage || 0 }}%
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ readinessScore()?.readySkillsCount }} of {{ readinessScore()?.totalRequiredSkillsCount }} skills ready
            </p>
          </div>

          <!-- Skills Assessed -->
          <div class="glass-card dark:glass-card-dark rounded-xl p-6 backdrop-blur-xl">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400">Skills Assessed</h3>
              <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {{ userSkillsCount() }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Skills in your profile
            </p>
          </div>

          <!-- Learning Items -->
          <div class="glass-card dark:glass-card-dark rounded-xl p-6 backdrop-blur-xl">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400">Roadmap Items</h3>
              <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <p class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {{ roadmapCount() }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Skills to learn
            </p>
          </div>
        </div>
      }

      <!-- Action Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Select Target Role -->
        <div class="glass-card dark:glass-card-dark rounded-xl p-6 backdrop-blur-xl hover:scale-105 transition-all">
          <div class="flex items-start space-x-4">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {{ authService.currentUser()?.targetRole ? 'Change Target Role' : 'Select Target Role' }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                {{ authService.currentUser()?.targetRole ? 'Update your career goal' : 'Choose the role you want to grow into' }}
              </p>
              <a
                routerLink="/dashboard/role-selection"
                class="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                {{ authService.currentUser()?.targetRole ? 'Change Role' : 'Select Role' }}
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Assess Skills -->
        <div class="glass-card dark:glass-card-dark rounded-xl p-6 backdrop-blur-xl hover:scale-105 transition-all">
          <div class="flex items-start space-x-4">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {{ userSkillsCount() > 0 ? 'Update Your Skills' : 'Assess Your Skills' }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                {{ userSkillsCount() > 0 ? 'Keep your skill levels up to date' : 'Rate your current skill proficiency' }}
              </p>
              <a
                routerLink="/dashboard/skills"
                class="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium hover:underline"
              >
                {{ userSkillsCount() > 0 ? 'Update Skills' : 'Assess Now' }}
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- View Roadmap -->
        <div class="glass-card dark:glass-card-dark rounded-xl p-6 backdrop-blur-xl hover:scale-105 transition-all">
          <div class="flex items-start space-x-4">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Your Learning Roadmap
              </h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                See your personalized learning path with priorities
              </p>
              <a
                routerLink="/dashboard/roadmap"
                class="inline-flex items-center text-green-600 dark:text-green-400 font-medium hover:underline"
              >
                View Roadmap
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Gap Analysis -->
        <div class="glass-card dark:glass-card-dark rounded-xl p-6 backdrop-blur-xl hover:scale-105 transition-all">
          <div class="flex items-start space-x-4">
            <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Skill Gap Analysis
              </h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                See where you stand vs. target role requirements
              </p>
              <a
                routerLink="/dashboard/gap-analysis"
                class="inline-flex items-center text-orange-600 dark:text-orange-400 font-medium hover:underline"
              >
                View Analysis
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Role Comparison -->
        <div class="glass-card dark:glass-card-dark rounded-xl p-6 backdrop-blur-xl hover:scale-105 transition-all">
          <div class="flex items-start space-x-4">
            <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Compare Roles
              </h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                Find your best fit across multiple roles
              </p>
              <a
                routerLink="/dashboard/role-comparison"
                class="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                Compare Now
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Getting Started Guide (if new user) -->
      @if (!authService.currentUser()?.targetRole || userSkillsCount() === 0) {
        <div class="glass-card dark:glass-card-dark border-white/30 rounded-xl p-6 backdrop-blur-xl">
          <h3 class="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4">
            🚀 Getting Started with SkillPath
          </h3>
          <ol class="space-y-3 text-blue-800 dark:text-blue-200">
            <li class="flex items-start">
              <span class="font-bold mr-2">1.</span>
              <span>Select your target role (Junior UI Developer, Senior UI Developer, or Full Stack Developer)</span>
            </li>
            <li class="flex items-start">
              <span class="font-bold mr-2">2.</span>
              <span>Assess your current skill levels (1-5 scale based on real-world proficiency)</span>
            </li>
            <li class="flex items-start">
              <span class="font-bold mr-2">3.</span>
              <span>View your personalized roadmap with skill gaps and priorities</span>
            </li>
            <li class="flex items-start">
              <span class="font-bold mr-2">4.</span>
              <span>Track your progress as you learn and grow</span>
            </li>
          </ol>
        </div>
      }
    </div>
  `
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  apiService = inject(ApiService);

  readinessScore = signal<any>(null);
  userSkillsCount = signal(0);
  roadmapCount = signal(0);
  targetRoleName = signal('');

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    const targetRole = this.authService.currentUser()?.targetRole;

    // Load user skills count
    this.apiService.getUserSkills().subscribe({
      next: (skills) => {
        this.userSkillsCount.set(skills.length);
      },
      error: () => {
        this.userSkillsCount.set(0);
      }
    });

    // Load readiness score if target role is set
    if (targetRole) {
      this.apiService.getReadinessScore(targetRole).subscribe({
        next: (score) => {
          this.readinessScore.set(score);
          this.targetRoleName.set(score.targetRoleName || '');
        },
        error: () => {
          this.readinessScore.set(null);
        }
      });

      this.apiService.getRoadmap(targetRole).subscribe({
        next: (response) => {
          this.roadmapCount.set(response.roadmap?.length || 0);
        },
        error: () => {
          this.roadmapCount.set(0);
        }
      });
    }
  }

  getUserFirstName(): string {
    const name = this.authService.currentUser()?.name;
    if (!name) return 'there';
    return name.split(' ')[0];
  }
}

