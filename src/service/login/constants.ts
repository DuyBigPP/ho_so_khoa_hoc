// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  AUTH_USER: 'auth_user',
} as const

// API timeouts
export const API_TIMEOUT = {
  DEFAULT: 10000, // 10 seconds
  LOGIN: 15000,   // 15 seconds for login
  UPLOAD: 30000,  // 30 seconds for file uploads
} as const

// Error messages
export const ERROR_MESSAGES = {
  LOGIN_FAILED: 'Đăng nhập thất bại',
  INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng',
  NETWORK_ERROR: 'Lỗi kết nối mạng',
  SERVER_ERROR: 'Lỗi server, vui lòng thử lại sau',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ',
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  LOGOUT_SUCCESS: 'Đăng xuất thành công',
  REGISTER_SUCCESS: 'Đăng ký thành công',
} as const

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const
