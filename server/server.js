const express = require('express');
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("InterviewMate server is running");
});

app.get("/about", (req, res) => {
    res.send({
        project: "InterviewMate AI",
        purpose: "AI-powered interview preparation",
        status: "Under development"
    });
});

app.get("/hello/:name", (req, res) => {
    const name = req.params.name;

    res.send(`Hello, ${name}! Welcome to InterviewMate AI.`);
});

app.get("/search", (req, res) => {
    const company = req.query.company;
    const role = req.query.role;

    res.send({
        message: "Searching for interview questions",
        company: company,
        role: role
    });
});

app.post("/api/interview/config", (req, res) => {
    const config = req.body;

    res.send({
        message: "Interview configuration received successfully!",
        receivedData: config
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});