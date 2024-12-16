import * as mongodb from "mongodb";

export interface Student {
    firstName: string;
    lastName: string;
    age: number;
    sector: "INFO" | "TC" | "GMP" | "GEA";
    _id?: mongodb.ObjectId;
  }