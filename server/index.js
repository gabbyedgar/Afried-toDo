import express from "express";
// const express = require("express");
import sql from "./db.js";
import cors from "cors"

const app = express();

const data = [
    {"id": "1",
    "task": "Take a bath",
    "is_completed":true
    },
    {"id": "2",
    "task": "Eat",
    "is_completed":false
    },
    {"id": "3",
    "task": "Eas some more",
    "is_completed":false
    },
    {"id": "4",
    "task": "Rest",
    "is_completed":true
    }
]

app.get("/", (req, res) => {
    res.send("Hello")
})

app.use(
    cors({
      origin: ["http://localhost:5173"],
    })
  );

app.get("/api/todos", (req, res) => {
    res.json(data)
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
});