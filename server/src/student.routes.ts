import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database";

export const studentRouter = express.Router();
studentRouter.use(express.json());

studentRouter.get("/", async (_req, res) => {
    try {
        const students = await collections?.students?.find({}).toArray();
        res.status(200).send(students);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});

studentRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const student = await collections?.students?.findOne(query);

        if (student) {
            res.status(200).send(student);
        } else {
            res.status(404).send(`Failed to find a student: ID ${id}`);
        }
    } catch (error) {
        res.status(404).send(`Failed to find a student: ID ${req?.params?.id}`);
    }
});


studentRouter.post("/", async (req, res) => {
    try {
        const student = req.body;
        const result = await collections?.students?.insertOne(student);

        if (result?.acknowledged) {
            res.status(201).send(`Created a new student: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new student.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});


studentRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const student = req.body;
        const query = { _id: new ObjectId(id) };
        const result = await collections?.students?.updateOne(query, { $set: student });

        if (result && result.matchedCount) {
            res.status(200).send(`Updated a student: ID ${id}.`);
        } else if (!result?.matchedCount) {
            res.status(404).send(`Failed to find a student: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update a student: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});


studentRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const result = await collections?.students?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed a student: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove a student: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find an student: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});