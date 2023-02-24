declare namespace NodeJS {
    export interface ProcessEnv {
        CONNECTION_URL: string;
        PORT: string;
        JWT_SECRET: string;
    }
}