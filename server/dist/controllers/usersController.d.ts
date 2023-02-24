import { Request, Response } from "express";
export declare const getUsers: (req: Request, res: Response) => Promise<void>;
export declare const getUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const followUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const unfollowUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
