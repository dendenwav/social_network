// Extension de types pour dotenv
declare namespace NodeJS {
    export interface ProcessEnv {
        PORT: string;
        JWT_SECRET: string;
    }
}