import { JSONFilePreset } from "lowdb/node";
import { nanoid } from "nanoid";

const defaultData = {
  sessions: []
};

const db = await JSONFilePreset(
  "./data/db.json",
  defaultData
);


export async function saveSession(session) {

  const newSession = {

    id: nanoid(),

    ...session,

    createdAt: new Date().toISOString()

  };

  db.data.sessions.push(newSession);

  await db.write();

  return newSession;
}


export async function getSessions() {

  return db.data.sessions;

}