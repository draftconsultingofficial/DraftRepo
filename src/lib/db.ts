import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

function getMongoUri() {
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  return MONGODB_URI;
}

type CachedMongoose = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: CachedMongoose | undefined;
}

const cache = global.mongooseCache || { conn: null, promise: null };

global.mongooseCache = cache;

export async function connectToDatabase() {
  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(getMongoUri(), {
      bufferCommands: false,
      dbName: process.env.MONGODB_DB || "draft-consulting",
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
