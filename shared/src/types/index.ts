// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  companyId: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
  VIEWER = 'VIEWER',
}

// Company types
export interface Company {
  id: string;
  name: string;
  nip: string;
  regon?: string;
  industry: string;
  size: CompanySize;
  website?: string;
  description?: string;
  isActive: boolean;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum CompanySize {
  MICRO = 'MICRO',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

// ESG Metrics types
export interface EsgMetric {
  id: string;
  companyId: string;
  category: EsgCategory;
  type: string;
  name: string;
  value: number;
  unit: string;
  period: string;
  source?: string;
  verified: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum EsgCategory {
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  SOCIAL = 'SOCIAL',
  GOVERNANCE = 'GOVERNANCE',
}

// Report types
export interface Report {
  id: string;
  companyId: string;
  title: string;
  type: ReportType;
  framework?: string;
  period: string;
  status: ReportStatus;
  content?: any;
  fileUrl?: string;
  publishedAt?: Date;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ReportType {
  SUSTAINABILITY = 'SUSTAINABILITY',
  ESG_SCORECARD = 'ESG_SCORECARD',
  CARBON_FOOTPRINT = 'CARBON_FOOTPRINT',
  DIVERSITY_INCLUSION = 'DIVERSITY_INCLUSION',
  GOVERNANCE = 'GOVERNANCE',
  CUSTOM = 'CUSTOM',
}

export enum ReportStatus {
  DRAFT = 'DRAFT',
  REVIEW = 'REVIEW',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

// Survey types
export interface Survey {
  id: string;
  companyId: string;
  title: string;
  description?: string;
  type: SurveyType;
  status: SurveyStatus;
  startDate?: Date;
  endDate?: Date;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum SurveyType {
  EMPLOYEE_SATISFACTION = 'EMPLOYEE_SATISFACTION',
  DIVERSITY_INCLUSION = 'DIVERSITY_INCLUSION',
  WORKPLACE_SAFETY = 'WORKPLACE_SAFETY',
  ETHICS_COMPLIANCE = 'ETHICS_COMPLIANCE',
  CUSTOM = 'CUSTOM',
}

export enum SurveyStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

// Task types
export interface Task {
  id: string;
  companyId: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
  completedAt?: Date;
  assignedToId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  companyId: string;
}

// Common utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Date period type
export interface DatePeriod {
  start: Date;
  end: Date;
} 