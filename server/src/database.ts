import * as mongodb from "mongodb";
import { Student } from "./student";

export const collections: {
    students?: mongodb.Collection<Student>;
} = {};

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("projet_virtu_backend");
    await applySchemaValidation(db);

    const studentsCollection = db.collection<Student>("students");
    collections.students = studentsCollection;
}

async function applySchemaValidation(db: mongodb.Db) {
    const jsonSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["firstName", "lastName", "sector"],
            additionalProperties: true,
            properties: {
                _id: {},
                firstName: {
                    bsonType: "string",
                    description: "'firstName' is required and is a string",
                },
                lastName: {
                    bsonType: "string",
                    description: "'lastName' is required and is a string",
                    minLength: 5
                },
                sector: {
                    bsonType: "string",
                    description: "'sector' is required and is one of 'INFO', 'TC', 'GMP', or 'GEA'",
                    enum: ["INFO", "TC", "GMP", "GEA"],
                },
            },
        },
    };

   await db.command({
        collMod: "students",
        validator: jsonSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === "NamespaceNotFound") {
            await db.createCollection("students", {validator: jsonSchema});
        }
    });
}