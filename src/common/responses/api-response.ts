export class ApiResponse {
  static success<T>(data: T, message?: string) {
    return {
      success: true,
      data,
      message,
    };
  }

  static error(statusCode: number, message: string, error?: Record<string, string>,) {
    return {
      success: false,
      message,
      statusCode,
      errors: error,
    };
  }
}
