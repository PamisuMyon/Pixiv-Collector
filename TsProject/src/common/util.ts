import { Pamisu, System } from "csharp";

export default class Util {
    public static stringFormat(str: string, ...args: any): string {
        if (args.length == 0)
            return null;
        for (var i = 0; i < args.length; i++) {
            var re = new RegExp('\\{' + i + '\\}', 'gm');
            str = str.replace(re, args[i]);
        }
        return str;
    }

    public static dateFormat(fmt: string, date: Date): string {
        let ret;
        const opt: any = {
            "Y+": date.getFullYear().toString(),    
            "m+": (date.getMonth() + 1).toString(), 
            "d+": date.getDate().toString(),        
            "H+": date.getHours().toString(),       
            "M+": date.getMinutes().toString(),     
            "S+": date.getSeconds().toString()      
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            };
        };
        return fmt;
    }

    public static getTimeCounterText(time: number): string {
        if (time < 60) {
            return time + '秒';
        } else {
            time = Math.ceil(time / 60);
            return time + '分钟';
        }
    }

    public static getElem<T>(array: T[], index: number): T {
        if (index < array.length) {
            return array[index];
        }
        return null;
    }

    public static pushUnique<T>(a: T[], b: T) {
        if (a.indexOf(b) == -1) {
            a.push(b);
        }
    }

    public static pushAllUnique<T>(a: T[], b: T[]) {
        for (const item of b) {
            if (a.indexOf(item) == -1) {
                a.push(item);
            }
        }
    }

    public static sleep(timeout: number): Promise<void> {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }

    public static generateToken() {
        return new Date().getTime() + '' + Math.random() * 1000;
    }

    public static jsToCharp(origin: any, type: System.Type) {
        const str = JSON.stringify(origin);
        return Pamisu.Common.Util.ParseJson(str, type);
    }

    // public static jsToCSharp<O extends Object, T extends System.Object>(origin: O, target: T) {
    //     const tar = target as any;
    //     for (const key in origin) {
    //         try {
    //             if (typeof(origin[key]) == 'object') {
    //                 tar[key] = this.jsToCSharp(origin[key], tar[key]);
    //             } else {
    //                 tar[key] = origin[key];
    //             }
    //         } catch (err) {
    //             console.log(err);
    //             console.log('key   ' + key);
    //         }
    //     }
    //     return tar as T;
    // }

}
