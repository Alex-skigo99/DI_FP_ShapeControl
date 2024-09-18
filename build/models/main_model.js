"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainModel = void 0;
const db_1 = require("../config/db");
exports.mainModel = {
    _getPrograms: async (userid) => {
        const data = await (0, db_1.db)('programs as p')
            .leftJoin('data as d', 'p.id', 'd.prog_id')
            .select('p.id', 'p.progname', 'p.level', 'p.in_weight', 'p.out_weight', 'p.is_close', 'p.progcomment', 'p.tips', 'p.grade', 'p.menu', 'p.user_id')
            .where({ user_id: userid })
            .groupBy('p.id')
            .select(db_1.db.raw(`
            json_agg(
                json_build_object(
                'id', d.id,
                'day', d.day,
                'date', d.date,
                'plan', d.plan,
                'fact', d.fact,
                'strava', d.strava,
                'is_training', d.is_training,
                'workout', d.workout,
                'comment', d.comment,
                'prog_id', d.prog_id
                )
                ORDER BY d.date ASC
                ) as days
                `));
        if (!data)
            return undefined;
        return data;
    },
    _postProgram: async (data) => {
        let days = [...data.days];
        delete data.days;
        const trx = await db_1.db.transaction();
        try {
            const [result] = await trx('programs').insert(data).returning('*');
            console.log('result: ', result); //----------------------------
            const days_full = days.map(day => {
                return { ...day, prog_id: result.id };
            });
            const newDays = await trx('data').insert(days_full).returning('*');
            await trx.commit();
            result.days = newDays;
            console.log('_postProgram - result: ', result); //-----------------
            return result;
        }
        catch (error) {
            await trx.rollback();
            throw error;
        }
    },
    _patchProgram: async (data) => {
        let days = [...data.days];
        let user_id = data.user_id;
        delete data.days;
        const trx = await db_1.db.transaction();
        try {
            await trx('programs')
                .where({ id: data.id })
                .update(data);
            // .returning('*');
            let len = days.length;
            for (let i = 0; i < len; i++) {
                await trx('data')
                    .where({ id: days[i].id })
                    .update(days[i]);
            }
            await trx.commit();
            // return all programs of the user
            const progs = await exports.mainModel._getPrograms(user_id);
            return progs;
        }
        catch (error) {
            await trx.rollback();
            throw error;
        }
    }
};
