// ==========================================
// MongoDB Student Information Management System
// Database: collegeDB | Collection: students
// ==========================================

// Switch to collegeDB database
use collegeDB;

// ------------------------------------------
// 1. Insert at least 5 documents into students collection
// ------------------------------------------
db.students.insertMany([
  {
    rollNo: "23CM001",
    name: "Ravi Kumar",
    branch: "CSE-AIML",
    year: 3,
    marks: 85,
    email: "ravi@example.com"
  },
  {
    rollNo: "23CM002",
    name: "Priya Sharma",
    branch: "CSE-AIML",
    year: 3,
    marks: 92,
    email: "priya@example.com"
  },
  {
    rollNo: "23EC015",
    name: "Amit Patel",
    branch: "ECE",
    year: 2,
    marks: 78,
    email: "amit@example.com"
  },
  {
    rollNo: "23ME042",
    name: "Suresh Raina",
    branch: "MECH",
    year: 4,
    marks: 45,
    email: "suresh@example.com"
  },
  {
    rollNo: "23CS105",
    name: "Ananya Roy",
    branch: "CSE",
    year: 3,
    marks: 88,
    email: "ananya@example.com"
  },
  {
    rollNo: "23EC089",
    name: "Vikram Singh",
    branch: "ECE",
    year: 1,
    marks: 48,
    email: "vikram@example.com"
  }
]);

// ------------------------------------------
// 2. Display all students
// ------------------------------------------
print("\n--- Display All Students ---");
db.students.find().pretty();

// ------------------------------------------
// 3. Display students belonging to a particular branch (e.g., CSE-AIML)
// ------------------------------------------
print("\n--- Students in CSE-AIML Branch ---");
db.students.find({ branch: "CSE-AIML" }).pretty();

// ------------------------------------------
// 4. Display students who scored more than 75 marks
// ------------------------------------------
print("\n--- Students Scoring More Than 75 Marks ---");
db.students.find({ marks: { $gt: 75 } }).pretty();

// ------------------------------------------
// 5. Search for a student using rollNo
// ------------------------------------------
print("\n--- Search Student by rollNo: 23CM001 ---");
db.students.find({ rollNo: "23CM001" }).pretty();

// ------------------------------------------
// 6. Search students based on specified condition (e.g., year = 3)
// ------------------------------------------
print("\n--- Search Students in 3rd Year ---");
db.students.find({ year: 3 }).pretty();

// ------------------------------------------
// 7. Update the marks of a particular student
// ------------------------------------------
print("\n--- Update Marks of 23CM001 to 95 ---");
db.students.updateOne(
  { rollNo: "23CM001" },
  { $set: { marks: 95 } }
);

// ------------------------------------------
// 8. Update another field such as email or branch
// ------------------------------------------
print("\n--- Update Email of 23CM001 ---");
db.students.updateOne(
  { rollNo: "23CM001" },
  { $set: { email: "ravi.kumar_updated@example.com", branch: "CSE-AI" } }
);

// Verify update
db.students.find({ rollNo: "23CM001" }).pretty();

// ------------------------------------------
// 9. Delete a student record using rollNo
// ------------------------------------------
print("\n--- Delete Student Record (rollNo: 23ME042) ---");
db.students.deleteOne({ rollNo: "23ME042" });

// Verify deletion
db.students.find().pretty();

// ------------------------------------------
// 10. Display students in descending order of marks
// ------------------------------------------
print("\n--- Students Sorted in Descending Order of Marks ---");
db.students.find().sort({ marks: -1 }).pretty();

// ------------------------------------------
// 11. Create an index on rollNo
// ------------------------------------------
print("\n--- Creating Single-Field Index on rollNo ---");
db.students.createIndex({ rollNo: 1 });

// View existing indexes
db.students.getIndexes();

// ------------------------------------------
// 12. Demonstrate why indexing is useful for searching student records
// ------------------------------------------
print("\n--- Index Execution Stats (IXSCAN Demonstration) ---");
db.students.find({ rollNo: "23CM001" }).explain("executionStats");

// ==========================================
// Real-Time Extension ⭐
// ==========================================

// Real-Time Query 1: Find students scoring above 80
print("\n⭐ Real-Time Extension: Students scoring above 80");
db.students.find({ marks: { $gt: 80 } }).pretty();

// Real-Time Query 2: Find students scoring below 50
print("\n⭐ Real-Time Extension: Students scoring below 50");
db.students.find({ marks: { $lt: 50 } }).pretty();

// Real-Time Query 3: Find the highest-scoring student
print("\n⭐ Real-Time Extension: Highest-scoring student");
db.students.find().sort({ marks: -1 }).limit(1).pretty();

// Real-Time Query 4: Find students belonging to a particular branch (e.g., ECE)
print("\n⭐ Real-Time Extension: Students in ECE branch");
db.students.find({ branch: "ECE" }).pretty();

// Real-Time Query 5: Display students sorted according to marks
print("\n⭐ Real-Time Extension: Students sorted by marks (Ascending)");
db.students.find().sort({ marks: 1 }).pretty();
