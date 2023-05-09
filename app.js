const http = require('http');
const url = require('url');
const MongoClient = require('mongodb').MongoClient;
const database = require('./database');

// Connect to MongoDB
MongoClient.connect(database.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function(err, client) {
  if (err) {
    console.log("Database couldn't be connected to: " + err);
  } else {
    console.log("Database connected");
    
    // Create server
    const server = http.createServer((req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, UPDATE, PUT, PATCH');
      res.setHeader('Content-Type', 'application/json');

      // Handle requests
      const reqUrl = url.parse(req.url, true);
      const pathname = reqUrl.pathname;
      const query = reqUrl.query;
      const method = req.method;

      // Handle API requests
      if (pathname === '/api/students') {
        const collection = client.db(database.dbName).collection(database.collections.students);

        if (method === 'GET') {
          // Get all students
          collection.find({}).toArray(function(err, data) {
            if (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ message: "Error fetching students" }));
            } else {
              res.statusCode = 200;
              res.end(JSON.stringify(data));
            }
          });
        } else if (method === 'POST') {
          // Add new student
          const student = query;
          collection.insertOne(student, function(err, result) {
            if (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ message: "Error adding student" }));
            } else {
              res.statusCode = 201;
              res.end(JSON.stringify({ message: "Student added successfully" }));
            }
          });
        } else if (method === 'PUT') {
          // Update student
          const studentId = query.id;
          const newValues = { $set: query };
          collection.updateOne({ _id: new MongoClient.ObjectId(studentId) }, newValues, function(err, result) {
            if (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ message: "Error updating student" }));
            } else {
              res.statusCode = 200;
              res.end(JSON.stringify({ message: "Student updated successfully" }));
            }
          });
        } else if (method === 'DELETE') {
          // Delete student
          const studentId = query.id;
          collection.deleteOne({ _id: new MongoClient.ObjectId(studentId) }, function(err, result) {
            if (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ message: "Error deleting student" }));
            } else {
              res.statusCode = 200;
              res.end(JSON.stringify({ message: "Student deleted successfully" }));
            }
          });
        }
      } else {
        // Handle 404 error
        res.statusCode = 404;
        res.end(JSON.stringify({ message: "Page not found" }));
      }
    });

    // Listen on port
    const port = process.env.PORT || 5000;
    server.listen(port, () => {
      console.log('Server running on port ' + port);
    });
  }
});
