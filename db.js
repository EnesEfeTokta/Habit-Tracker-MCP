import { JSONFilePreset } from 'lowdb/node';

const defaultData = { habits: [], userProfile: { name: "User" } };

export async function getDb() {
  const db = await JSONFilePreset('data.json', defaultData);
  return db;
}