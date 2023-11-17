import Database from "bun:sqlite";

const db = new Database("data.db", { create: true });

const init = async () => {
    db.run("CREATE TABLE IF NOT EXISTS initCategory (category TEXT PRIMARY KEY)");
    db.run("CREATE TABLE IF NOT EXISTS makerChannel (channel TEXT PRIMARY KEY)");
}

export const base = () => {
    init();

    return {
        initCategory: {
            set: (category: string) => db.query("INSERT INTO initCategory (category) VALUES (?)").run(category),
            get: (category: string) => db.query("SELECT * FROM initCategory WHERE category = ?").get(category),
        },
        makerChannel: {
            set: (channel: string) => db.query("INSERT INTO makerChannel (channel) VALUES (?)").run(channel),
            get: (channel: string) => db.query("SELECT * FROM makerChannel WHERE channel = ?").get(channel),
        }
    }
}

export type base = ReturnType<typeof base>