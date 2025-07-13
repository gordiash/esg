// API Constants
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    UPDATE: '/users/:id',
    DELETE: '/users/:id',
    GET_BY_ID: '/users/:id',
  },
  COMPANIES: {
    LIST: '/companies',
    CREATE: '/companies',
    UPDATE: '/companies/:id',
    DELETE: '/companies/:id',
    GET_BY_ID: '/companies/:id',
  },
  ESG_METRICS: {
    LIST: '/esg-metrics',
    CREATE: '/esg-metrics',
    UPDATE: '/esg-metrics/:id',
    DELETE: '/esg-metrics/:id',
    GET_BY_ID: '/esg-metrics/:id',
    GET_BY_COMPANY: '/esg-metrics/company/:companyId',
  },
  REPORTS: {
    LIST: '/reports',
    CREATE: '/reports',
    UPDATE: '/reports/:id',
    DELETE: '/reports/:id',
    GET_BY_ID: '/reports/:id',
    GENERATE: '/reports/generate',
    EXPORT: '/reports/:id/export',
  },
  SURVEYS: {
    LIST: '/surveys',
    CREATE: '/surveys',
    UPDATE: '/surveys/:id',
    DELETE: '/surveys/:id',
    GET_BY_ID: '/surveys/:id',
    RESPONSES: '/surveys/:id/responses',
  },
  TASKS: {
    LIST: '/tasks',
    CREATE: '/tasks',
    UPDATE: '/tasks/:id',
    DELETE: '/tasks/:id',
    GET_BY_ID: '/tasks/:id',
    GET_BY_ASSIGNEE: '/tasks/assignee/:userId',
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// ESG Frameworks
export const ESG_FRAMEWORKS = {
  GRI: 'GRI',
  SASB: 'SASB',
  TCFD: 'TCFD',
  EU_TAXONOMY: 'EU_TAXONOMY',
  CDP: 'CDP',
  UNGC: 'UNGC',
} as const;

// Default pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// Date formats
export const DATE_FORMATS = {
  ISO: 'YYYY-MM-DD',
  DISPLAY: 'DD/MM/YYYY',
  DATETIME: 'DD/MM/YYYY HH:mm',
  TIME: 'HH:mm',
} as const;

// File upload limits
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
  ],
} as const;

// Cache durations (in seconds)
export const CACHE_DURATION = {
  SHORT: 5 * 60, // 5 minutes
  MEDIUM: 30 * 60, // 30 minutes
  LONG: 60 * 60, // 1 hour
  VERY_LONG: 24 * 60 * 60, // 24 hours
} as const;

// Rate limiting
export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
} as const;

// Validation constraints
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  EMAIL_MAX_LENGTH: 254,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 1000,
  TITLE_MAX_LENGTH: 200,
} as const;

// ESG Metric units
export const ESG_UNITS = {
  CARBON: {
    TONNES_CO2E: 'tCO2e',
    KG_CO2E: 'kgCO2e',
    GRAMS_CO2E: 'gCO2e',
  },
  ENERGY: {
    KWH: 'kWh',
    MWH: 'MWh',
    GJ: 'GJ',
    THERMS: 'therms',
  },
  WATER: {
    LITERS: 'L',
    CUBIC_METERS: 'm³',
    GALLONS: 'gal',
  },
  WASTE: {
    KILOGRAMS: 'kg',
    TONNES: 't',
    CUBIC_METERS: 'm³',
  },
  PERCENTAGE: '%',
  COUNT: 'count',
  RATIO: 'ratio',
  SCORE: 'score',
} as const;

// Company industries
export const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Manufacturing',
  'Retail',
  'Energy',
  'Transportation',
  'Real Estate',
  'Education',
  'Food & Beverage',
  'Telecommunications',
  'Construction',
  'Agriculture',
  'Mining',
  'Utilities',
  'Media',
  'Pharmaceuticals',
  'Automotive',
  'Aerospace',
  'Other',
] as const;

// Countries
export const COUNTRIES = [
  'Poland',
  'Germany',
  'United Kingdom',
  'France',
  'Italy',
  'Spain',
  'Netherlands',
  'Belgium',
  'Austria',
  'Switzerland',
  'Czech Republic',
  'Slovakia',
  'Hungary',
  'Other',
] as const;

// Error messages
export const ERROR_MESSAGES = {
  VALIDATION: {
    REQUIRED: 'This field is required',
    EMAIL_INVALID: 'Please enter a valid email address',
    PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
    PASSWORD_TOO_LONG: `Password must be no more than ${VALIDATION.PASSWORD_MAX_LENGTH} characters`,
    NAME_TOO_LONG: `Name must be no more than ${VALIDATION.NAME_MAX_LENGTH} characters`,
  },
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    TOKEN_EXPIRED: 'Your session has expired. Please login again.',
    UNAUTHORIZED: 'You are not authorized to perform this action',
  },
  GENERAL: {
    NETWORK_ERROR: 'Network error. Please check your connection and try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    NOT_FOUND: 'The requested resource was not found',
  },
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Created successfully',
  UPDATED: 'Updated successfully',
  DELETED: 'Deleted successfully',
  SAVED: 'Saved successfully',
  SENT: 'Sent successfully',
} as const; 