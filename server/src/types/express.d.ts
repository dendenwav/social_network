import { IUser } from "../models/_interfaces/UserInterfaces";

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}