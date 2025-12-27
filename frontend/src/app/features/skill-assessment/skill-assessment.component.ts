import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, Skill, SkillLevel, UserSkill } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

interface SkillAssessment {
  skillId: string;
  skill: Skill;
  currentLevel: number;
  confidenceScore: number;
}

@Component({
  selector: 'app-skill-assessment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Assess Your Skills
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Rate your current proficiency for each skill. Be honest - accurate self-assessment leads to better roadmaps!
        </p>
      </div>

      <!-- Skill Levels Reference -->
      @if (skillLevels().length > 0) {
        <div class="glass-card dark:glass-card-dark border-white/30 rounded-xl p-6 mb-8 backdrop-blur-xl">
          <h3 class="font-bold text-blue-900 dark:text-blue-100 mb-4">📊 Skill Level Reference</h3>
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            @for (level of skillLevels(); track level.level) {
              <div>
                <p class="font-semibold text-blue-800 dark:text-blue-200">Level {{ level.level }}: {{ level.name }}</p>
                <p class="text-xs text-blue-700 dark:text-blue-300 mt-1">{{ level.description }}</p>
              </div>
            }
          </div>
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
        <div class="glass-card dark:glass-card-dark border-red-300/50 dark:border-red-700/50 rounded-xl p-4 mb-6 backdrop-blur-xl">
          <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage() }}</p>
        </div>
      }

      <!-- Success Message -->
      @if (successMessage()) {
        <div class="glass-card dark:glass-card-dark border-green-300/50 dark:border-green-700/50 rounded-xl p-4 mb-6 backdrop-blur-xl">
          <p class="text-sm text-green-600 dark:text-green-400">{{ successMessage() }}</p>
        </div>
      }

      <!-- Skills Assessment Grid -->
      @if (!loading() && assessments().length > 0) {
        <div class="space-y-4">
          @for (assessment of assessments(); track assessment.skillId) {
            <div class="glass-card dark:glass-card-dark rounded-xl p-6 backdrop-blur-xl">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <!-- Skill Info -->
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                      {{ assessment.skill.name }}
                    </h3>
                    <span class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                      {{ assessment.skill.category }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ assessment.skill.description }}
                  </p>
                </div>

                <!-- Level Selector -->
                <div class="flex items-center space-x-4">
                  <div class="flex items-center space-x-2">
                    @for (level of [1, 2, 3, 4, 5]; track level) {
                      <button
                        (click)="setSkillLevel(assessment, level)"
                        [class.bg-blue-600]="assessment.currentLevel === level"
                        [class.dark:bg-blue-500]="assessment.currentLevel === level"
                        [class.text-white]="assessment.currentLevel === level"
                        [class.ring-2]="assessment.currentLevel === level"
                        [class.ring-blue-400]="assessment.currentLevel === level"
                        [class.dark:ring-blue-300]="assessment.currentLevel === level"
                        [class.shadow-lg]="assessment.currentLevel === level"
                        [class.bg-gray-200]="assessment.currentLevel !== level"
                        [class.dark:bg-gray-700]="assessment.currentLevel !== level"
                        [class.text-gray-700]="assessment.currentLevel !== level"
                        [class.dark:text-gray-300]="assessment.currentLevel !== level"
                        [class.glass]="assessment.currentLevel !== level"
                        [class.dark:glass-dark]="assessment.currentLevel !== level"
                        class="w-10 h-10 rounded-xl font-bold hover:scale-110 transition-all backdrop-blur-xl"
                      >
                        {{ level }}
                      </button>
                    }
                  </div>
                </div>
              </div>

              <!-- Confidence Slider (Optional) -->
              @if (assessment.currentLevel > 0) {
                <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div class="flex items-center justify-between mb-3">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confidence Level
                    </label>
                    <span class="text-sm font-bold text-blue-600 dark:text-blue-400 glass dark:glass-dark px-3 py-1 rounded-full backdrop-blur-xl">
                      {{ assessment.confidenceScore }}%
                    </span>
                  </div>
                  
                  <!-- Custom Progress Bar -->
                  <div class="relative">
                    <div class="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        class="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-full transition-all duration-300 ease-out"
                        [style.width.%]="assessment.confidenceScore"
                      ></div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      [(ngModel)]="assessment.confidenceScore"
                      class="absolute top-0 left-0 w-full h-3 opacity-0 cursor-pointer z-10"
                    />
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 flex justify-end space-x-4">
          <button
            (click)="cancel()"
            class="px-6 py-3 glass dark:glass-dark text-gray-900 dark:text-gray-100 font-medium rounded-xl hover:scale-105 transition-all backdrop-blur-xl"
          >
            Cancel
          </button>
          <button
            (click)="saveAssessments()"
            [disabled]="saving() || !hasChanges()"
            class="px-6 py-3 glass-card dark:glass-card-dark text-white font-medium rounded-xl hover:scale-105 transition-all backdrop-blur-xl border-white/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            @if (saving()) {
              <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            }
            <span>Save & Continue</span>
          </button>
        </div>
      }

      <!-- No Target Role Message -->
      @if (!loading() && !authService.currentUser()?.targetRole) {
        <div class="glass-card dark:glass-card-dark border-white/30 rounded-xl p-6 text-center backdrop-blur-xl">
          <svg class="w-12 h-12 mx-auto text-yellow-600 dark:text-yellow-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 class="text-lg font-bold text-yellow-900 dark:text-yellow-100 mb-2">
            No Target Role Selected
          </h3>
          <p class="text-yellow-800 dark:text-yellow-200 mb-4">
            Please select a target role first to assess relevant skills.
          </p>
          <button
            (click)="goToRoleSelection()"
            class="px-6 py-3 glass-card dark:glass-card-dark text-white font-medium rounded-xl hover:scale-105 transition-all backdrop-blur-xl border-white/30"
          >
            Select Target Role
          </button>
        </div>
      }
    </div>
  `
})
export class SkillAssessmentComponent implements OnInit {
  apiService = inject(ApiService);
  authService = inject(AuthService);
  router = inject(Router);

  assessments = signal<SkillAssessment[]>([]);
  skillLevels = signal<SkillLevel[]>([]);
  loading = signal(false);
  saving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  ngOnInit(): void {
    this.loadSkillLevels();
    
    const targetRole = this.authService.currentUser()?.targetRole;
    if (targetRole) {
      this.loadSkills(targetRole);
    }
  }

  loadSkillLevels(): void {
    this.apiService.getSkillLevels().subscribe({
      next: (levels) => {
        this.skillLevels.set(levels);
      },
      error: () => {
        // Continue without levels
      }
    });
  }

  loadSkills(targetRoleId: string): void {
    this.loading.set(true);
    this.errorMessage.set('');

    // Load skills for the target role
    this.apiService.getSkillsByRole(targetRoleId).subscribe({
      next: (response) => {
        const skills = response.data || response.skills || [];
        
        // Load existing user assessments
        this.apiService.getUserSkills().subscribe({
          next: (userSkills) => {
            const assessmentMap = new Map<string, SkillAssessment>();
            
            // Create assessments for all required skills
            skills.forEach((skill: any) => {
              const skillId = skill._id || skill.skillId;
              // Handle skillId being either a string or a populated object
              const existingSkill = userSkills.find((us: any) => {
                const usSkillId = typeof us.skillId === 'string' 
                  ? us.skillId 
                  : (us.skillId?._id?.toString() || us.skillId?.toString());
                return usSkillId === skillId.toString();
              });
              assessmentMap.set(skillId, {
                skillId: skillId,
                skill: {
                  _id: skill._id,
                  skillId: skillId,
                  name: skill.name,
                  category: skill.category,
                  description: skill.description
                },
                currentLevel: existingSkill?.currentLevel || 0,
                confidenceScore: existingSkill?.confidenceScore || 50
              });
            });

            this.assessments.set(Array.from(assessmentMap.values()));
            this.loading.set(false);
          },
          error: () => {
            // If user skills fail to load, just show all skills with level 0
            const initialAssessments = skills.map((skill: Skill) => ({
              skillId: skill.skillId,
              skill: skill,
              currentLevel: 0,
              confidenceScore: 50
            }));
            this.assessments.set(initialAssessments);
            this.loading.set(false);
          }
        });
      },
      error: () => {
        this.errorMessage.set('Failed to load skills. Please try again.');
        this.loading.set(false);
      }
    });
  }

  setSkillLevel(assessment: SkillAssessment, level: number): void {
    assessment.currentLevel = level;
    // Trigger change detection
    this.assessments.set([...this.assessments()]);
  }

  hasChanges(): boolean {
    return this.assessments().some(a => a.currentLevel > 0);
  }

  saveAssessments(): void {
    const assessmentsToSave = this.assessments()
      .filter(a => a.currentLevel > 0)
      .map(a => ({
        skillId: a.skillId,
        currentLevel: a.currentLevel,
        confidenceScore: a.confidenceScore
      }));

    if (assessmentsToSave.length === 0) {
      this.errorMessage.set('Please assess at least one skill.');
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.apiService.bulkUpdateUserSkills(assessmentsToSave).subscribe({
      next: () => {
        this.successMessage.set('Skills saved successfully!');
        this.saving.set(false);
        
        // Navigate to gap analysis or dashboard after 1 second
        setTimeout(() => {
          this.router.navigate(['/dashboard/gap-analysis']);
        }, 1000);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Failed to save skills. Please try again.');
        this.saving.set(false);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }

  goToRoleSelection(): void {
    this.router.navigate(['/dashboard/role-selection']);
  }
}

