const express = require("express");

const app = express();

const PORT = 3000;


// Home route
app.get("/", function(req, res) {
    res.send("Welcome to the Student Server!");
});


// Students route
app.get("/students", function(req, res) {

    const students = [
        "Raghu",
        "Rahul",
        "Amulya",
        "Anjali",
        "Suresh"
    ];

    res.json(students);
});


// About route
app.get("/about", function(req, res) {

    res.send(
        "This is a Student Management application built using Node.js and Express.js."
    );
});


// Start the server
app.listen(PORT, function() {

    console.log(`Server is running at http://localhost:${PORT}`);

});