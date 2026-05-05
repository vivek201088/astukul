export class TimezoneUtils {
    private static readonly TIMEZONE = 'Asia/Kolkata';

    static now(): Date {
        return new Date(new Date().toLocaleString('en-US', { timeZone: this.TIMEZONE }));
    }

    static toKolkataTime(date: Date): Date {
        return new Date(date.toLocaleString('en-US', { timeZone: this.TIMEZONE }));
    }

    static formatKolkataTime(date: Date, options?: Intl.DateTimeFormatOptions): string {
        const defaultOptions: Intl.DateTimeFormatOptions = {
            timeZone: this.TIMEZONE,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };

        return date.toLocaleString('en-IN', { ...defaultOptions, ...options });
    }

    static getTimezoneOffset(): string {
        const now = new Date();
        const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
        const kolkataTime = new Date(utcTime + (5.5 * 3600000)); // IST is UTC+5:30
        const offset = kolkataTime.getTimezoneOffset() / -60;
        return `UTC${offset >= 0 ? '+' : ''}${offset}:${offset % 1 === 0 ? '00' : '30'}`;
    }

    static isKolkataTimezone(): boolean {
        return Intl.DateTimeFormat().resolvedOptions().timeZone === this.TIMEZONE;
    }

    static getCurrentTimestamp(): string {
        return this.now().toISOString();
    }

    static toISTString(date: Date = new Date()): string {
        return this.toKolkataTime(date).toISOString();
    }
    static formatForLogs(date: Date = new Date()): string {
        const istDate = new Date(date.toLocaleString('en-US', { timeZone: this.TIMEZONE }));
        const year = istDate.getFullYear();
        const month = String(istDate.getMonth() + 1).padStart(2, '0');
        const day = String(istDate.getDate()).padStart(2, '0');
        const hours = String(istDate.getHours()).padStart(2, '0');
        const minutes = String(istDate.getMinutes()).padStart(2, '0');
        const seconds = String(istDate.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    static getTodayRange() {
        const now = this.now();
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);

        return {
            start: startOfDay.toISOString(),
            end: endOfDay.toISOString(),
            formatted: {
                start: this.formatKolkataTime(startOfDay),
                end: this.formatKolkataTime(endOfDay)
            }
        };
    }

    static getThisWeekRange() {
        const now = this.now();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
        endOfWeek.setHours(23, 59, 59, 999);

        return {
            start: startOfWeek.toISOString(),
            end: endOfWeek.toISOString(),
            formatted: {
                start: this.formatKolkataTime(startOfWeek),
                end: this.formatKolkataTime(endOfWeek)
            }
        };
    }
}
