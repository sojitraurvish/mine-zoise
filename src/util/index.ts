export class ErrorResponse extends Error {
    private statusCode: number | null;

    constructor(message: any, statusCode: any) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class apiResponse {
    private status: number | null
    private message: string | null
    private data: any | null
    private error: any | null
    constructor(status: number, message: any, data: any, error: any) {
        this.status = status
        this.message = message
        this.data = data
        this.error = error
    }
}
export const image_folder = ['video', 'feed'];//'profile_image', , 'message', 'review'
// export class apiResponse {
//     status: number | null;
//     success: boolean;
//     data: any | null;
//     message: string | null;
//     error: any | null;
//     constructor(status: number, success: boolean, data: any, message: any, error: any) {

//         this.status = status;
//         this.success = success;
//         this.data = data;
//         this.message = message;
//         this.error = error;
//     }
// }