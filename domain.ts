export function beijingDate(date = new Date()) { return date.toLocaleDateString('en-CA', { timeZone: 'Asia/Shanghai' }); }
export function remainingDays(expiry: string, now = new Date()) { return Math.round((Date.parse(expiry + 'T00:00:00Z') - Date.parse(beijingDate(now) + 'T00:00:00Z')) / 86400000); }
export function urgency(days: number) { return days < 0 ? 'expired' : days < 7 ? 'critical' : days < 30 ? 'warning' : days <= 90 ? 'upcoming' : 'safe'; }
export function alertThreshold(days: number) { return days <= 1 ? 1 : days <= 7 ? 7 : days <= 15 ? 15 : days <= 30 ? 30 : null; }
export function validDate(value: unknown): value is string { return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value; }
export const documentTypes = ['residence','visa','passport','insurance'];
