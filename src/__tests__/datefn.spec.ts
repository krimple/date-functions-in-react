import {describe, it, expect} from 'vitest';
import {subWeeks, endOfDay} from 'date-fns';
import {zonedTimeToUtc} from 'date-fns-tz';

describe('date fn tests', () => {
    it('zonedTimeToUTC time at 3/12/2023 at 1:40AM (before 2AM cutover) is in EST (+5)', () => {
        // EDT date that is in leap time
        // 240AM Eastern ny time
        const myDate = new Date(2023, 2, 12, 1, 40, 0, 0);
        console.log(`date: ${myDate.toString()}`);
        const laterZonedTime= zonedTimeToUtc(myDate, 'America/New_York');
        console.log(`utc date: ${laterZonedTime.toUTCString()}`);
        expect(laterZonedTime.getDate()).toBe(12);
        // should be 6AM (five hours ahead of 1AM)
        expect(laterZonedTime.getUTCHours()).toBe(6);

        // end of day 1 week before
        const eod1wkdate = endOfDay(subWeeks(myDate, 1));
        expect(eod1wkdate.getTime()).toBeDefined();
        expect(eod1wkdate.getDate()).toBe(5);
    });

    it('zonedTimeToUTC time at 3/12/2023 at 2:40AM (that lost 2AM hour) is in EST (+5)', () => {
        const myDate = new Date(2023, 2, 12, 2, 40, 0, 0);
        console.log(`date: ${myDate.toString()}`);
        const laterZonedTime= zonedTimeToUtc(myDate, 'America/New_York');
        console.log(`utc date: ${laterZonedTime.toUTCString()}`);
        expect(laterZonedTime.getDate()).toBe(12);
        // should be 7AM (fiver hours ahead of 2AM)
        expect(laterZonedTime.getUTCHours()).toBe(7);

        // end of day 1 week before
        const eod1wkdate = endOfDay(subWeeks(myDate, 1));
        expect(eod1wkdate.getTime()).toBeDefined();
        expect(eod1wkdate.getDate()).toBe(5);
    });

    it('zonedTimeToUTC time at 3/12/2023 at 3:40AM should be 4 hours later in UTC (+4)', () => {
        const myDate = new Date(2023, 2, 12, 3, 40, 0, 0);
        const laterZonedTime= zonedTimeToUtc(myDate, 'America/New_York');
        expect(laterZonedTime.getDate()).toBe(12);
        // should be 6AM (four hours ahead of 2AM)
        expect(laterZonedTime.getUTCHours()).toBe(7);
        // end of day 1 week before
        const eod1wkdate = endOfDay(subWeeks(myDate, 1));
        expect(eod1wkdate.getTime()).toBeDefined();
        expect(eod1wkdate.getDate()).toBe(5);
    });

    it('pure date arithmetic - before DST switch at 12:40AM EDT (+5)', () => {
        const myDate = new Date(2023, 2, 12, 0, 40, 0, 0);
        const utcTimeData = myDate.toISOString();
        // 5 hours later in UTC
        expect(utcTimeData).toEqual('2023-03-12T05:40:00.000Z');
    });

    it("pure date arithmetic - dead zone between 2 and 3 AM : 7AM UTC (+5)", () => {
        const myDate = new Date(2023, 2, 12, 2, 1, 0, 0);
        const utcTimeData = myDate.toISOString();
        // 5 hours later in UTC - we're between 2 and 3 AM EDT - is that right?
        expect(utcTimeData).toEqual('2023-03-12T07:01:00.000Z');
    });

    it("pure date arithmetic - just after 3AM - DST = 7AM UTC (+4)", () => {
        const myDate = new Date(2023, 2, 12, 3, 1, 0, 0);
        const utcTimeData = myDate.toISOString();
        // 4 hours later in UTC - we're between 2 and 3 AM EDT - is that right?
        expect(utcTimeData).toEqual('2023-03-12T07:01:00.000Z');
    });
});
