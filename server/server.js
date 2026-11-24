
const express = require('express');
const { randomUUID } = require('crypto');

const app = express();

app.use(express.json());

// Temporary storage for interview sessions
const interviews = {};

// Temporary question bank
const questionBank = [
    {
        id: 1,
        question: "Tell me about yourself.",
        category: "Introduction"
    },
    {
        id: 2,
        question: "Explain the four pillars of Object-Oriented Programming.",
        category: "Technical"
    },
    {
        id: 3,
        question: "What is the difference between an array and a linked list?",
        category: "Technical"
    },
    {
        id: 4,
        question: "How would you handle a disagreement with a teammate?",
        category: "Behavioral"
    },
    {
        id: 5,
        question: "Why do you want to work for this company?",
        category: "HR"
    }
];

// Home route
app.get("/", (req, res) => {
    res.send("InterviewMate server is running");
});

// About route
app.get("/about", (req, res) => {
    res.json({
        project: "InterviewMate AI",
        purpose: "AI-powered interview preparation",
        status: "Under development"
    });
});

// Route parameters
app.get("/hello/:name", (req, res) => {
    const name = req.params.name;

    res.send(`Hello, ${name}! Welcome to InterviewMate AI.`);
});

// Query parameters
app.get("/search", (req, res) => {
    const company = req.query.company;
    const role = req.query.role;

    res.json({
        message: "Searching for interview questions",
        company: company,
        role: role
    });
});

// Validate interview configuration
app.post("/api/interview/config", (req, res) => {
    const config = req.body || {};

    const { company, role, difficulty, duration, interviewType } = config;

    // Validate required text fields
    if (
        typeof company !== "string" ||
        typeof role !== "string" ||
        typeof difficulty !== "string" ||
        typeof interviewType !== "string" ||
        !company.trim() ||
        !role.trim() ||
        !difficulty.trim() ||
        !interviewType.trim()
    ) {
        return res.status(400).json({
            message: "Please provide valid company, role, difficulty, and interview type."
        });
    }

    // Validate difficulty
    const allowedDifficulties = ["Easy", "Medium", "Hard"];

    if (!allowedDifficulties.includes(difficulty.trim())) {
        return res.status(400).json({
            message: "Difficulty must be Easy, Medium, or Hard."
        });
    }

    // Validate duration
    if (
        typeof duration !== "number" ||
        duration <= 0
    ) {
        return res.status(400).json({
            message: "Duration must be a positive number."
        });
    }

    // Clean configuration
    const cleanConfig = {
        company: company.trim(),
        role: role.trim(),
        difficulty: difficulty.trim(),
        duration,
        interviewType: interviewType.trim()
    };

    res.status(200).json({
        message: "Interview configuration validated successfully!",
        data: cleanConfig
    });
});

// Receive and validate user data
app.post("/api/user", (req, res) => {
    const userData = req.body || {};
    const { name, targetRole } = userData;

    // Validate user input
    if (
        typeof name !== "string" ||
        typeof targetRole !== "string" ||
        !name.trim() ||
        !targetRole.trim()
    ) {
        return res.status(400).json({
            message: "Name and target role must be valid non-empty strings"
        });
    }

    // Clean user input
    const cleanUserData = {
        ...userData,
        name: name.trim(),
        targetRole: targetRole.trim()
    };

    console.log(cleanUserData);

    res.json({
        message: "User data received successfully",
        data: cleanUserData
    });
});

// Start a new interview
app.post("/api/interviews/start", (req, res) => {
    const config = req.body || {};

    const { company, role, difficulty, duration, interviewType } = config;

    // Basic validation
    if (
        typeof company !== "string" ||
        typeof role !== "string" ||
        typeof difficulty !== "string" ||
        typeof interviewType !== "string" ||
        !company.trim() ||
        !role.trim() ||
        !difficulty.trim() ||
        !interviewType.trim() ||
        typeof duration !== "number" ||
        duration <= 0
    ) {
        return res.status(400).json({
            message: "Please provide valid interview configuration."
        });
    }

    // Create a unique interview ID
    const interviewId = randomUUID();

    // Create interview session
    const interview = {
        id: interviewId,
        config: {
            company: company.trim(),
            role: role.trim(),
            difficulty: difficulty.trim(),
            duration,
            interviewType: interviewType.trim()
        },
        questions: questionBank,
        currentQuestionIndex: 0,
        answers: [],
        status: "in_progress",
        createdAt: new Date()
    };

    // Store interview temporarily
    interviews[interviewId] = interview;

    // Return interview details and first question
    res.status(201).json({
        message: "Interview started successfully!",
        interviewId: interviewId,
        status: interview.status,
        totalQuestions: interview.questions.length,
        currentQuestion: interview.questions[0],
        config: interview.config
    });
});

// Get interview session details
app.get("/api/interviews/:id", (req, res) => {
    const interviewId = req.params.id;
    const interview = interviews[interviewId];

    if (!interview) {
        return res.status(404).json({
            message: "Interview not found."
        });
    }

    res.json({
        interviewId: interview.id,
        status: interview.status,
        config: interview.config,
        totalQuestions: interview.questions.length,
        currentQuestionIndex: interview.currentQuestionIndex,
        answersSubmitted: interview.answers.length
    });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
