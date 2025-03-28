/**
 * Logger class for colorful logging
 */
export class Logger {
    /**
     * ANSI escape codes for colors
     */
    static Colors = {
        // resets text styling back to default
        Reset: "\x1b[0m",
        // makes text bold
        Bright: "\x1b[1m",

        // define foreground text colors
        FgRed: "\x1b[31m",
        FgGreen: "\x1b[32m",
        FgYellow: "\x1b[33m",
        FgBlue: "\x1b[34m",
    };

    static Log(message: string, params?: any) {
        const logging = params ? message + JSON.stringify(params) : message;
        if (process.env.NODE_ENV !== 'test') {
            console.log(logging);
        }
    }

    static Info(message: string, params?: any) {
        let logging =
            process.env.NODE_ENV === "localhost"
                ? this.Colors.FgBlue + message + this.Colors.Reset
                : message;
        logging = params ? logging + JSON.stringify(params) : logging;
        if (process.env.NODE_ENV !== 'test') {
            console.log(logging);
        }
    }

    static Error(message: string, params?: any) {
        let logging =
            process.env.NODE_ENV === "localhost"
                ? this.Colors.FgRed +
                  this.Colors.Bright +
                  message +
                  this.Colors.Reset
                : message;
        logging = params ? logging + JSON.stringify(params) : logging;
        if (process.env.NODE_ENV !== 'test') {
            console.log(logging);
        }
    }

    static Warn(message: string, params?: any) {
        let logging =
            process.env.NODE_ENV === "localhost"
                ? this.Colors.FgYellow + message + this.Colors.Reset
                : message;
        logging = params ? logging + JSON.stringify(params) : logging;
        if (process.env.NODE_ENV !== 'test') {
            console.log(logging);
        }
    }

    static Success(message: string, params?: any) {
        let logging =
            process.env.NODE_ENV === "localhost"
                ? this.Colors.FgGreen + message + this.Colors.Reset
                : message;
        logging = params ? logging + JSON.stringify(params) : logging;
        if (process.env.NODE_ENV !== 'test') {
            console.log(logging);
        }
    }
}
