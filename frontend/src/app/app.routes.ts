import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { LandingComponent } from './features/landing/landing.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { RoleSelectionComponent } from './features/role-selection/role-selection.component';
import { SkillAssessmentComponent } from './features/skill-assessment/skill-assessment.component';
import { GapAnalysisComponent } from './features/gap-analysis/gap-analysis.component';
import { RoadmapComponent } from './features/roadmap/roadmap.component';
import { ProfileComponent } from './features/profile/profile.component';
import { RoleComparisonComponent } from './features/role-comparison/role-comparison.component';
import { SkillHistoryComponent } from './features/skill-history/skill-history.component';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: LandingComponent },
      { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
      { path: 'register', component: RegisterComponent, canActivate: [guestGuard] }
    ]
  },
  // Protected routes (Dashboard)
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'role-selection', component: RoleSelectionComponent },
      { path: 'skills', component: SkillAssessmentComponent },
      { path: 'gap-analysis', component: GapAnalysisComponent },
      { path: 'roadmap', component: RoadmapComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'role-comparison', component: RoleComparisonComponent },
      { path: 'history', component: SkillHistoryComponent }
    ]
  },
  // Fallback
  { path: '**', redirectTo: '' }
];
