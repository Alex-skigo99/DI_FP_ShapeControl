import { LevelIdxType, LevelType, User, activityIndex } from "./consts";

function calculateDailyCalorie(weight: number, level: LevelType, userData: User) {
    const {age, height, gender} = userData;
    let dailyCal: number;  //TDEE
    const LevelIdx: LevelIdxType = {
        stable: 1,
        progress: 0.85,
        jump: 0.7
    }
    if (gender == 'male') {
        dailyCal = Math.round((88.4 + (13.4 * weight) + (4.8 * height) + (5.68 * age)) * 1.2 * LevelIdx[level] / 100) * 100
    }
    else {
        dailyCal = Math.round((447.6 + (9.25 * weight) + (3.1 * height) + (4.33 * age)) * 1.2 * LevelIdx[level] / 100) * 100
    }
    let dailyCalActiv: number = Math.round(dailyCal * activityIndex / 100) * 100;
    return {dailyCal, dailyCalActiv}
};

export default calculateDailyCalorie;