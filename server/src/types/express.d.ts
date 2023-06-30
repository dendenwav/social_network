import { IUser } from "../models/_interfaces/UserInterfaces";

// Extension de types pour express
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}