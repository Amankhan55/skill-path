import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Role {
  _id: string;
  name: string;
  level: string;
  description: string;
  category: string;
  experienceYears: {
    min: number;
    max: number;
  };
  averageSalary?: {
    min: number;
    max: number;
  };
}

export interface Skill {
  _id: string;
  skillId: string;
  name: string;
  category: string;
  description: string;
}

export interface SkillLevel {
  level: number;
  name: string;
  description: string;
}

export interface UserSkill {
  _id: string;
  userId: string;
  skillId: string | { _id: string; name?: string; category?: string; description?: string }; // Can be string or populated object
  currentLevel: number;
  confidenceScore?: number;
  lastAssessed: string;
}

export interface SkillGap {
  skillId: string;
  skillName: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  weight: number;
  priority: number;
  isMandatory: boolean;
}

export interface RoadmapDependency {
  skillId: string;
  skillName: string;
  type?: string;
  minimumLevel?: number;
  reason?: string;
}

export interface RoadmapItem {
  skillId: string;
  skillName: string;
  currentLevel: number;
  targetLevel: number;
  gap: number;
  priority: number;
  isMandatory: boolean;
  dependencies: RoadmapDependency[];
  topics: Array<{
    topicId: string;
    title: string;
    description: string;
    order: number;
    estimatedHours: number;
    resources: Array<{
      title: string;
      url: string;
      type: string;
    }>;
  }>;
  estimatedHours: number;
  order: number;
}

export interface ReadinessScore {
  targetRoleId?: string;
  targetRoleName?: string;
  readinessPercentage: number;
  readySkillsCount: number;
  totalRequiredSkillsCount: number;
  achievedScore: number;
  totalRequiredScore: number;
  skillBreakdown: Array<{
    skillId: string;
    skillName: string;
    currentLevel: number;
    requiredLevel: number;
    isReady: boolean;
    gap: number;
  }>;
  categoryBreakdown?: Array<{
    category: string;
    readiness: number;
    skillCount: number;
  }>;
  interpretation?: {
    level: string;
    message: string;
    color: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  // Roles
  getRoles(): Observable<Role[]> {
    return this.http.get<{ success: boolean; count: number; data: Role[] }>(`${environment.apiUrl}/roles`)
      .pipe(map(response => response.data));
  }

  getRole(roleId: string): Observable<Role> {
    return this.http.get<Role>(`${environment.apiUrl}/roles/${roleId}`);
  }

  // Skills
  getSkills(): Observable<Skill[]> {
    return this.http.get<{ success: boolean; count: number; data: Skill[] }>(`${environment.apiUrl}/skills`)
      .pipe(map(response => response.data));
  }

  getSkillsByRole(roleId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/skills/by-role/${roleId}`);
  }

  getSkillLevels(): Observable<SkillLevel[]> {
    return this.http.get<{ success: boolean; data: SkillLevel[] }>(`${environment.apiUrl}/skills/levels`)
      .pipe(map(response => response.data));
  }

  // User Skills
  getUserSkills(): Observable<UserSkill[]> {
    return this.http.get<{ success: boolean; count: number; data: UserSkill[] }>(`${environment.apiUrl}/user-skills`)
      .pipe(map(response => response.data));
  }

  updateUserSkill(skillId: string, level: number, confidence?: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/user-skills/assess`, {
      skillId,
      currentLevel: level,
      confidenceScore: confidence
    });
  }

  bulkUpdateUserSkills(assessments: Array<{ skillId: string; currentLevel: number; confidenceScore?: number }>): Observable<any> {
    return this.http.post(`${environment.apiUrl}/user-skills/bulk-assess`, { assessments });
  }

  // Gap Analysis
  getGapAnalysis(targetRoleId: string): Observable<{ gaps: SkillGap[] }> {
    return this.http.get<{ success: boolean; data: { gaps: SkillGap[] } }>(`${environment.apiUrl}/analysis/gap/${targetRoleId}`)
      .pipe(map(response => response.data));
  }

  // Roadmap
  getRoadmap(targetRoleId: string): Observable<{ roadmap: RoadmapItem[] }> {
    return this.http.get<{ success: boolean; data: { roadmap: RoadmapItem[] } }>(`${environment.apiUrl}/analysis/roadmap/${targetRoleId}`)
      .pipe(map(response => response.data));
  }

  // Readiness Score
  getReadinessScore(targetRoleId: string): Observable<ReadinessScore> {
    return this.http.get<{ success: boolean; data: ReadinessScore }>(`${environment.apiUrl}/analysis/readiness/${targetRoleId}`)
      .pipe(map(response => response.data));
  }

  // Progress
  markTopicComplete(skillId: string, topicId: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/progress/topic/complete`, {
      skillId,
      topicId
    });
  }

  getProgress(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/progress`);
  }

  // Dashboard
  getDashboard(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/dashboard`);
  }

  // Profile
  updateProfile(data: { name?: string; experienceYears?: number; currentRole?: string; bio?: string }): Observable<any> {
    return this.http.put(`${environment.apiUrl}/profile`, data);
  }

  updateTargetRole(targetRole: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/profile/target-role`, { targetRole });
  }

  // Role Comparison
  compareRoles(roleIds: string[]): Observable<any> {
    return this.http.post(`${environment.apiUrl}/analysis/compare-roles`, { roleIds });
  }
}

