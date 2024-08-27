"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._hello = void 0;
const db_1 = require("../config/db");
const _hello = (id) => {
    return (0, db_1.db)('playing_with_neon')
        .select('id', 'name', 'value')
        .where({ id: id });
};
exports._hello = _hello;
