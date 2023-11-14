import * as log4js from 'log4js';
import { getConfig } from '../config';

log4js.configure({
    appenders: {
        stdout: { type: "stdout" },
        cheese: { type: "file", filename: "cheese.log" }
    },
    categories: {
        default: { appenders: ["stdout"], level: "debug" },
        development: { appenders: ["stdout", "cheese"], level: "debug" },
        deploy: { appenders: ["cheese"], level: "debug" }
    },
})

export const logger = log4js.getLogger(getConfig().log.categories);
