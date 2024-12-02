class CustomError {
    private readonly statusCode: number;
    private readonly message: any;
    constructor(message: any, status = 400) {
        this.statusCode = status;
        this.message = Array.isArray(message) && message.length == 1 ? message[0] : message;
        Object.setPrototypeOf(this, CustomError.prototype);
    }

    getError() {
        return { status: 'ERROR', statusCode: this.statusCode, reason: this.message };
    }
    
    getStatusCode() {
        return this.statusCode;
    }
}

export default CustomError;
