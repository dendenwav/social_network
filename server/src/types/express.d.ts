declare namespace Express {
    export interface Request {
        user?: {
            pseudo: string;
            email: string;
            id: string;
        }
    }
}