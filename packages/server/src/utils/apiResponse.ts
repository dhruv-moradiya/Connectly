class ApiResponse {
  statusCode: number;
  message: string;
  data: any;
  success: boolean;

  constructor(statusCode: number, message: string, data: any = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }
}

class SocketResponse {
  message: string;
  success: boolean;
  data: any;

  constructor(message: string, success: boolean, data: any = null) {
    this.message = message;
    this.success = success;
    this.data = data;
  }
}

export { ApiResponse, SocketResponse };
