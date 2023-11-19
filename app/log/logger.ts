import * as log4js from 'log4js';
import { getConfig } from '../config';

log4js.configure({
    appenders: {
        stdout: { type: "stdout" },
        cheese: { type: "file", filename: "cheese.log" },
        error: { type: "file", filename: "error.log" }
    },
    categories: {
        default: { appenders: ["stdout"], level: "debug" },
        development: { appenders: ["stdout", "cheese"], level: "debug" },
        error: { appenders: ["stdout", "error"], level: "debug" },
        deploy: { appenders: ["cheese"], level: "debug" }
    },
})

export const logger = log4js.getLogger(getConfig().log.categories);
export const errorLogger = log4js.getLogger('error');
