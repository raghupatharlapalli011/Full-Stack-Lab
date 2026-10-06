const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter the filename: ", function(filename) {

    rl.question("Enter the content: ", function(content) {

        // Create and write the file
        fs.writeFile(filename, content, function(error) {

            if (error) {
                console.log("Error creating file");
                return;
            }

            console.log("File created successfully!");

            // Read the file
            fs.readFile(filename, "utf8", function(error, data) {

                if (error) {
                    console.log("Error reading file");
                    return;
                }

                console.log("\nFile contents:");
                console.log(data);

                // Ask for additional content
                rl.question("\nEnter additional content: ", function(additionalContent) {

                    // Append content
                    fs.appendFile(filename, "\n" + additionalContent, function(error) {

                        if (error) {
                            console.log("Error appending file");
                            return;
                        }

                        console.log("Content appended successfully!");

                        // Read final contents
                        fs.readFile(filename, "utf8", function(error, finalData) {

                            if (error) {
                                console.log("Error reading final file");
                                return;
                            }

                            console.log("\nFinal file contents:");
                            console.log(finalData);

                            rl.close();
                        });
                    });
                });
            });
        });
    });
});node 