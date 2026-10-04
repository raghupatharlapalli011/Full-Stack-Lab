/**
 * MongoDB Student Information Management System (Node.js Application)
 * Database: collegeDB
 * Collection: students
 */

const { MongoClient } = require('mongodb');

// Connection URL (Default MongoDB local instance)
const defaultUrl = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const dbName = 'collegeDB';
const collectionName = 'students';

let initialStudents = [
  { rollNo: "23CM001", name: "Ravi Kumar", branch: "CSE-AIML", year: 3, marks: 85, email: "ravi@example.com" },
  { rollNo: "23CM002", name: "Priya Sharma", branch: "CSE-AIML", year: 3, marks: 92, email: "priya@example.com" },
  { rollNo: "23EC015", name: "Amit Patel", branch: "ECE", year: 2, marks: 78, email: "amit@example.com" },
  { rollNo: "23ME042", name: "Suresh Raina", branch: "MECH", year: 4, marks: 45, email: "suresh@example.com" },
  { rollNo: "23CS105", name: "Ananya Roy", branch: "CSE", year: 3, marks: 88, email: "ananya@example.com" },
  { rollNo: "23EC089", name: "Vikram Singh", branch: "ECE", year: 1, marks: 48, email: "vikram@example.com" }
];

// Simulated In-Memory Database Engine (Used when MongoDB service is not running locally)
class MockStudentDB {
  constructor() {
    this.students = JSON.parse(JSON.stringify(initialStudents));
    this.indexes = [];
  }

  insertMany(docs) {
    this.students = JSON.parse(JSON.stringify(docs));
    return { insertedCount: docs.length };
  }

  find(query = {}) {
    let result = [...this.students];
    if (query.branch) result = result.filter(s => s.branch === query.branch);
    if (query.year) result = result.filter(s => s.year === query.year);
    if (query.rollNo) result = result.filter(s => s.rollNo === query.rollNo);
    if (query.marks) {
      if (query.marks.$gt !== undefined) result = result.filter(s => s.marks > query.marks.$gt);
      if (query.marks.$lt !== undefined) result = result.filter(s => s.marks < query.marks.$lt);
    }
    return {
      toArray: async () => result,
      sort: (sortObj) => {
        const key = Object.keys(sortObj)[0];
        const dir = sortObj[key];
        result.sort((a, b) => dir === 1 ? a[key] - b[key] : b[key] - a[key]);
        return {
          toArray: async () => result,
          limit: (n) => ({ toArray: async () => result.slice(0, n) })
        };
      },
      explain: async () => ({
        executionStats: {
          executionStages: { stage: this.indexes.includes("rollNo") ? "IXSCAN" : "COLLSCAN" },
          totalDocsExamined: this.indexes.includes("rollNo") ? 1 : this.students.length,
          nReturned: 1,
          executionTimeMillis: this.indexes.includes("rollNo") ? 0 : 2
        }
      })
    };
  }

  findOne(query) {
    return this.students.find(s => s.rollNo === query.rollNo) || null;
  }

  updateOne(filter, update) {
    const doc = this.students.find(s => s.rollNo === filter.rollNo);
    if (doc && update.$set) {
      Object.assign(doc, update.$set);
    }
    return { modifiedCount: doc ? 1 : 0 };
  }

  deleteOne(filter) {
    const initLen = this.students.length;
    this.students = this.students.filter(s => s.rollNo !== filter.rollNo);
    return { deletedCount: initLen - this.students.length };
  }

  createIndex(indexObj) {
    const key = Object.keys(indexObj)[0];
    this.indexes.push(key);
    return `idx_${key}`;
  }
}

async function runStudentManagement() {
  let client;
  let collection;
  let isSimulated = false;

  try {
    client = new MongoClient(defaultUrl, { serverSelectionTimeoutMS: 1500 });
    await client.connect();
    const db = client.db(dbName);
    collection = db.collection(collectionName);
    console.log("Connected successfully to MongoDB Server at " + defaultUrl);
  } catch (err) {
    console.log("\n⚠️  Notice: Local MongoDB server (mongod) is not running on 127.0.0.1:27017.");
    console.log("⚡ Executing database operations using Standalone Demonstration Mode...\n");
    collection = new MockStudentDB();
    isSimulated = true;
  }

  try {
    if (!isSimulated) {
      await collection.deleteMany({});
    }

    // 1. Insert documents
    const insertResult = await collection.insertMany(initialStudents);
    console.log(`1. Inserted ${insertResult.insertedCount} student records.`);

    // 2. Display all students
    console.log("\n2. --- Displaying All Students ---");
    const allStudents = await collection.find({}).toArray();
    console.table(allStudents);

    // 3. Display students belonging to a particular branch (e.g., CSE-AIML)
    console.log("\n3. --- Students in CSE-AIML Branch ---");
    const aimlStudents = await collection.find({ branch: "CSE-AIML" }).toArray();
    console.table(aimlStudents);

    // 4. Display students who scored more than 75 marks
    console.log("\n4. --- Students Scoring > 75 Marks ---");
    const highScorers = await collection.find({ marks: { $gt: 75 } }).toArray();
    console.table(highScorers);

    // 5. Search for a student using rollNo
    console.log("\n5. --- Search Student by rollNo (23CM001) ---");
    const singleStudent = await collection.findOne({ rollNo: "23CM001" });
    console.log(singleStudent);

    // 6. Search students based on condition (e.g., year = 3)
    console.log("\n6. --- Search Students in Year 3 ---");
    const year3Students = await collection.find({ year: 3 }).toArray();
    console.table(year3Students);

    // 7. Update marks of a particular student
    console.log("\n7. --- Updating Marks for rollNo: 23CM001 to 95 ---");
    await collection.updateOne({ rollNo: "23CM001" }, { $set: { marks: 95 } });

    // 8. Update another field (email & branch)
    console.log("\n8. --- Updating Email & Branch for rollNo: 23CM001 ---");
    await collection.updateOne(
      { rollNo: "23CM001" },
      { $set: { email: "ravi.kumar_new@example.com", branch: "CSE-AI" } }
    );
    const updatedRavi = await collection.findOne({ rollNo: "23CM001" });
    console.log("Updated Record:", updatedRavi);

    // 9. Delete student record using rollNo
    console.log("\n9. --- Deleting Record rollNo: 23ME042 ---");
    const deleteResult = await collection.deleteOne({ rollNo: "23ME042" });
    console.log(`Deleted Count: ${deleteResult.deletedCount}`);

    // 10. Display students in descending order of marks
    console.log("\n10. --- Students Sorted by Marks Descending ---");
    const sortedStudents = await collection.find({}).sort({ marks: -1 }).toArray();
    console.table(sortedStudents);

    // 11. Create an index on rollNo
    console.log("\n11. --- Creating Single Field Index on 'rollNo' ---");
    const indexName = await collection.createIndex({ rollNo: 1 });
    console.log(`Index Created successfully: ${indexName}`);

    // 12. Demonstrate Index usefulness using explain()
    console.log("\n12. --- Indexing Performance Analysis (explain stats) ---");
    const explainResult = await collection.find({ rollNo: "23CM001" }).explain("executionStats");
    const executionStats = explainResult.executionStats;
    console.log(`Query Execution Stage: ${executionStats.executionStages.stage}`);
    console.log(`Total Docs Examined: ${executionStats.totalDocsExamined}`);
    console.log(`Documents Returned: ${executionStats.nReturned}`);
    console.log(`Execution Time (ms): ${executionStats.executionTimeMillis}`);

    // ==========================================
    // Real-Time Extension ⭐
    // ==========================================
    console.log("\n==========================================");
    console.log("⭐ REAL-TIME EXTENSION QUERIES ⭐");
    console.log("==========================================");

    // Query 1: Find students scoring above 80
    console.log("\n⭐ 1. Students Scoring Above 80:");
    console.table(await collection.find({ marks: { $gt: 80 } }).toArray());

    // Query 2: Find students scoring below 50
    console.log("\n⭐ 2. Students Scoring Below 50:");
    console.table(await collection.find({ marks: { $lt: 50 } }).toArray());

    // Query 3: Find highest-scoring student
    console.log("\n⭐ 3. Highest Scoring Student:");
    const highestScorer = await collection.find({}).sort({ marks: -1 }).limit(1).toArray();
    console.table(highestScorer);

    // Query 4: Find students belonging to a particular branch (ECE)
    console.log("\n⭐ 4. Students in ECE Branch:");
    console.table(await collection.find({ branch: "ECE" }).toArray());

    // Query 5: Display students sorted according to marks (Ascending)
    console.log("\n⭐ 5. Display Students Sorted According to Marks (Ascending):");
    console.table(await collection.find({}).sort({ marks: 1 }).toArray());

    if (isSimulated) {
      console.log("\n==================================================================");
      console.log("💡 INFO: To connect to an actual live MongoDB database:");
      console.log("Option A (Local Service): Start MongoDB service via Windows Service Manager or run 'net start MongoDB' in Admin CMD.");
      console.log("Option B (MongoDB Atlas): Set connection string: $env:MONGO_URI='mongodb+srv://user:pass@cluster.mongodb.net/'");
      console.log("==================================================================\n");
    }

  } catch (err) {
    console.error("Error during operation:", err.message);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

if (require.main === module) {
  runStudentManagement();
}
