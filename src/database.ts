import { DataType, GreatDB, Schema } from "great.db";

const db = new GreatDB.Database({
    type: GreatDB.Type.File,
    filename: "data.db",
    location: "./database",
});

// db.pragma("journal_mode").set("WAL");

const initCategorySchema = Schema.Create({
    id: DataType.AutoIncrement,
    category: DataType.String
});

const trackingChannelSchema = Schema.Create({
    id: DataType.AutoIncrement,
    channel: DataType.String,
    type: DataType.String,
    user: DataType.String,
});


export const Database = () => ({
    initCategory: db.table("initCategory", initCategorySchema),
    trackingChannel: db.table("trackingChannel", trackingChannelSchema),
})

export type Database = ReturnType<typeof Database>