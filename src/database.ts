import { DataType, GreatDB, Schema } from "great.db";

const db = new GreatDB.Database({
    type: GreatDB.Type.File,
    filename: "data.db",
    location: "./database",
});

// db.pragma("journal_mode").set("WAL");

export const trackingChannelSchema = Schema.Create({
    id: DataType.AutoIncrement,
    channel: DataType.String,
    type: DataType.String,

    use: DataType.String,

    guild: DataType.String,
});

export const Database = () => ({
    trackingChannel: db.table("trackingChannel", trackingChannelSchema),
})

export type Database = ReturnType<typeof Database>