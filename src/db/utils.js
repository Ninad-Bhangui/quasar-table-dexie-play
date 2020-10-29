import db from './db';
import Dexie from "dexie";

export default class Utils {
    static create(columns) {
        db.version(1).stores({
          deserts: `++id,${columns.join(",")}`
        });
    }
    static open() {
        return db.open();
    }
    static close() {
        return db.close();
    }
    static bulkAdd(data) {
        return db.deserts.bulkAdd(data);
    }
    static exists() {
        return Dexie.exists('datadb');
    }
}