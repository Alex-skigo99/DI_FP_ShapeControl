import dayjs, { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export interface dataDayStrava {
    kCal: number,
    about: string, // from distance in meters. from moving_time in seconds
};

export const handleStravaResponse = (res: [], startDate: string): dataDayStrava[] => {
    console.log('handleStravaResponse-res- ', res);  //----------------
    console.log('handleStravaResponse-startDate- ', startDate); //----------------
    let returnData: dataDayStrava[] = [];   

    // get workouts for the day from res array and return kCal and about info (local)
    function _getWorkoutsForTheDay(date: Dayjs, res: []): dataDayStrava {
        let workoutsInfo: dataDayStrava = {
            kCal: 0,
            about: '',
        };
        let dateDayjs = dayjs(date);
        let next_find = true;
        while (next_find) {
            let workout: any = res.find((item: any) => dateDayjs.isSame(dayjs(item.start_date_local), 'day'));
            if (workout) {
                workoutsInfo.kCal += Math.round(workout.kilojoules / 4.184);
                let distance = workout.distance / 1000;
                let duration = dayjs.duration(workout.moving_tim).format('H:mm:ss');
                workoutsInfo.about = ` (${workout.sport_type} ${distance}km in ${duration})`;
                next_find = true;
            } else {
                next_find = false;
            }
        };
        return workoutsInfo;
    };

    let startDay = dayjs(startDate);
    if (startDay.isBefore(dayjs())) {
        let diff = dayjs().diff(startDay, 'day'); // get days from startDay to now
        let days = diff > 7 ? 7 : diff; // get 7 days or less
        for (let i = 0; i < days; i++) {
            let date = startDay.add(i+1, 'day');
                returnData.push(_getWorkoutsForTheDay(date, res));
            }
    }
    return returnData; // array of dataDayStrava, length = days
}
