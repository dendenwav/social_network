// Extension de types pour dotenv
declare namespace NodeJS {
    export interface ProcessEnv {
        CONNECTION_URL: string;
        PORT: string;
        JWT_SECRET: string;
    }
}