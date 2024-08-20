import { db } from "../config/db";

export const _hello = (id: number) => {
    return db('playing_with_neon')
        .select('id', 'name', 'value')
        .where({id: id})
};
