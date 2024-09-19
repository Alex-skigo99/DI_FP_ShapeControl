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
    function _getWorkoutsForTheDay(date: Dayjs): dataDayStrava {
        let workouts: any = res.filter((item: any) => date.isSame(dayjs(item.start_date_local), 'day'));
        console.log('workouts: ', workouts); //----------------
        if (workouts && workouts.length > 0) {
            let workout: dataDayStrava = workouts.reduce((acc: any, item: any) => {
                    acc.kCal += Math.round(item.kilojoules);
                    acc.about += ` (${item.sport_type} ${item.distance/1000}km in ${dayjs.duration(item.moving_time).format('H:mm:ss')})`;
                    return acc;
            }, 
            {kCal: 0, about: ''});

            // workoutsInfo.kCal += Math.round(workout.kilojoules / 4.184);
            // let distance = workout.distance / 1000;
            // let duration = dayjs.duration(workout.moving_tim).format('H:mm:ss');
            // workoutsInfo.about = ` (${workout.sport_type} ${distance}km in ${duration})`;
            console.log('workout: ', workout); //----------------
            return workout;
        };
        return {
            kCal: 0,
            about: '',
        };
    };

    let startDay = dayjs(startDate);
    console.log('startDay: ', startDay); //----------------
    if (startDay.isBefore(dayjs())) {
        let diff = dayjs().diff(startDay, 'day'); // get days from startDay to now
        console.log('diff: ', diff); //----------------
        let days = diff > 7 ? 7 : diff; // get 7 days or less
        for (let i = 0; i < days; i++) {
            let date = startDay.add(i, 'day');
            console.log('date: ', date); //----------------
            returnData.push(_getWorkoutsForTheDay(date));
            }
    }
    console.log('returnData: ', returnData); //----------------
    return returnData; // array of dataDayStrava, length = days
}
