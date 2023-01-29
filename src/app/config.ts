//Config.ts is a file that contains all the configuration for the application.
// It is a good practice to keep all the configuration in a single file. 
//This file is used to get the configuration from the environment variables.
import dotenv from 'dotenv';
dotenv.config();

export type Config = {
    portRest: string;
    portWebsocket: string;
    serviceName: string;
}

export function getConfig(): Config {
    return {
        portRest: process.env.PORT || "3000",
        portWebsocket: process.env.PORT_WEBSOCKET || "3001",
        serviceName: 'Todo Service'
    }
}