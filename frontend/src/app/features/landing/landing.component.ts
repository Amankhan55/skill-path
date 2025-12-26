import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <!-- Hero Section -->
      <section class="container mx-auto px-4 py-20">
        <div class="max-w-4xl mx-auto text-center">
          <!-- Logo/Icon -->
          <div class="mb-8">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
              <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 class="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              SkillPath
            </h1>
            <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-medium">
              Your career roadmap, data-driven
            </p>
          </div>

          <!-- Tagline -->
          <p class="text-xl text-gray-700 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Stop guessing. Start growing. SkillPath tells you exactly <span class="font-semibold text-blue-600 dark:text-blue-400">WHAT</span> to learn, 
            <span class="font-semibold text-purple-600 dark:text-purple-400">WHY</span>, 
            and <span class="font-semibold text-indigo-600 dark:text-indigo-400">IN WHAT ORDER</span>.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a
              routerLink="/register"
              class="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started Free
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              routerLink="/login"
              class="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-all"
            >
              Sign In
            </a>
          </div>
        </div>
      </section>

      <!-- Problem Statement -->
      <section class="container mx-auto px-4 py-16">
        <div class="max-w-3xl mx-auto text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            The Problem We Solve
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300">
            Developers don't fail because of lack of content. 
            <span class="font-semibold text-red-600 dark:text-red-400">They fail because of lack of clarity.</span>
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <div class="text-red-500 mb-4">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Without SkillPath</h3>
            <ul class="space-y-2 text-gray-600 dark:text-gray-300">
              <li>❌ "I don't know what to learn next"</li>
              <li>❌ "Am I ready for that senior role?"</li>
              <li>❌ "Where do I even start?"</li>
              <li>❌ Endless tutorials, no clarity</li>
            </ul>
          </div>

          <div class="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 shadow-md">
            <div class="text-green-500 mb-4">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">With SkillPath</h3>
            <ul class="space-y-2 text-gray-600 dark:text-gray-300">
              <li>✅ Clear skill gaps identified</li>
              <li>✅ Exact readiness percentage</li>
              <li>✅ Ordered learning roadmap</li>
              <li>✅ Data-driven decisions</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="container mx-auto px-4 py-16">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">
            How It Works
          </h2>

          <div class="grid md:grid-cols-3 gap-8">
            <!-- Feature 1 -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Assess Your Skills</h3>
              <p class="text-gray-600 dark:text-gray-300">
                Rate your current skill levels on a 1-5 scale based on real-world proficiency definitions.
              </p>
            </div>

            <!-- Feature 2 -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">2. See Your Gaps</h3>
              <p class="text-gray-600 dark:text-gray-300">
                Get a detailed gap analysis showing exactly where you stand vs. your target role requirements.
              </p>
            </div>

            <!-- Feature 3 -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">3. Follow Your Roadmap</h3>
              <p class="text-gray-600 dark:text-gray-300">
                Get an ordered, dependency-aware learning path with time estimates and curated resources.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- What Makes Us Different -->
      <section class="container mx-auto px-4 py-16">
        <div class="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
          <h2 class="text-3xl md:text-4xl font-bold mb-6">What Makes SkillPath Different?</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-bold text-xl mb-2">✅ Data-Driven</h3>
              <p class="text-blue-100">Based on real job descriptions from top companies</p>
            </div>
            <div>
              <h3 class="font-bold text-xl mb-2">✅ Dependency-Aware</h3>
              <p class="text-blue-100">Learn prerequisites before advanced topics</p>
            </div>
            <div>
              <h3 class="font-bold text-xl mb-2">✅ Personalized</h3>
              <p class="text-blue-100">Tailored to your experience and target role</p>
            </div>
            <div>
              <h3 class="font-bold text-xl mb-2">✅ Measurable</h3>
              <p class="text-blue-100">Track progress with readiness scores</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="container mx-auto px-4 py-20">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Grow Your Career?
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join developers who've gained clarity on their career path.
          </p>
          <a
            routerLink="/register"
            class="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Start Your Journey
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  `
})
export class LandingComponent {}

