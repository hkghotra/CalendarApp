import mysql from 'mysql';
import config from './config.js';
import fetch from 'node-fetch';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import response from 'express';
//import admin from 'firebase-admin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the service account credentials from Firebase
//import serviceAccount from './serviceAccountKey.json' assert {type: 'json'};

/*
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://msci342-project-7c824-default-rtdb.firebaseio.com" //Replace with your Firebase Realtime Database URL
});
*/
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, "client/build")));
  
/*
// Middleware to verify Firebase ID Token
const checkAuth = (req, res, next) => {
	const idToken = req.headers.authorization;
	if (!idToken) {
	  return res.status(403).send('Unauthorized');
	}
	admin.auth().verifyIdToken(idToken)
	  .then(decodedToken => {
		req.user = decodedToken;
		next();
	  }).catch(error => {
		res.status(403).send('Unauthorized');
	  });
  };
*/
  /*
// API to read movies from the database
app.post('/api/getMovies', (req, res) => {
	let connection = mysql.createConnection(config);

	const sql = `SELECT id, name, year, quality FROM movies`;

	connection.query(sql, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}
		let string = JSON.stringify(results);
		res.send({ express: string });
	});
	connection.end();
});

// API to add a review to the database
app.post('/api/addReview', (req, res) => {
	const { userID, movieID, reviewTitle, reviewContent, reviewScore } = req.body;

	let connection = mysql.createConnection(config);

	const sql = `INSERT INTO Review (userID, movieID, reviewTitle, reviewContent, reviewScore) 
				 VALUES (?, ?, ?, ?, ?)`;

	const data = [userID, movieID, reviewTitle, reviewContent, reviewScore];

	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			console.error("Error adding review:", error.message);
			return res.status(500).json({ error: "Error adding review to the database" });
		}

		return res.status(200).json({ success: true });
	});
	connection.end();
});

*/


app.post('/api/addUser', (req, res) => {
	console.log("API addUser called")
	let connection = mysql.createConnection(config);
  
	const { firstName, lastName, username, password, email, course1, course2, course3, course4, course5 } = req.body;
  
	const sql = `INSERT INTO users (firstName, lastName, username, password, email, course1, course2, course3, course4, course5) 
				 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
	const data = [firstName, lastName, username, password, email, course1, course2, course3, course4, course5];
  
	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			console.error("Error adding user:", error.message);
			return res.status(500).json({ error: "Error adding user to the database" });
		}
  
		return res.status(200).json({ success: true, message: "User added successfully" });
	});
  
	connection.end();
  });

app.post('/api/addEvent', (req, res) => {
	console.log("API addEvent called")
	let connection = mysql.createConnection(config);
	
	const { id, title, description, start, end, eventType, course } = req.body;

    const sql = `INSERT INTO Events (id, title, description, start, end, eventType, course) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const data = [id, title, description, start, end, eventType, course];

    connection.query(sql, data, (error, results, fields) => {
        if (error) {
            console.error("Error adding event:", error.message);
            return res.status(500).json({ error: "Error adding event to the database" });
        }

        return res.status(200).json({ success: true });
    });

    connection.end();
});

// add a task
app.post('/api/addTask', (req, res) => {
    console.log("API addTask called");
    let connection = mysql.createConnection(config);
    
    const { id, title, description, deadline, weight, course, type } = req.body;

    const sql = `INSERT INTO tasks (id, title, description, deadline, weight, course, type) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const data = [id, title, description, deadline, weight, course, type];

    connection.query(sql, data, (error, results, fields) => {
        if (error) {
            console.error("Error adding task:", error.message);
            return res.status(500).json({ error: "Error adding task to the database" });
        }

        return res.status(200).json({ success: true });
    });

    connection.end();
});

// Delete a task
app.delete('/api/deleteTask', async (req, res) => {
    const { id } = req.body; 
    
    let connection = mysql.createConnection(config);
    connection.connect();
  
    const sql = 'DELETE FROM tasks WHERE id = ?';
    connection.query(sql, [id], (error, results) => {
      connection.end();
  
      if (error) {
        console.error("Failed to delete task:", error);
        return res.status(500).json({ message: 'Failed to delete task' });
      }
  
      res.status(200).json({ message: 'Task deleted successfully' });
    });
});

// Update a task
app.put('/api/editTask',(req, res) => {
    const { id, title, description, deadline, weight, course, type } = req.body;
  
    let connection = mysql.createConnection(config);
    connection.connect();
  
    const sql = `
      UPDATE tasks
      SET title = ?, description = ?, deadline = ?, weight = ?, course = ?, type = ?
      WHERE id = ?`;
  
    const values = [title, description, deadline, weight, course, type, id];
  
    connection.query(sql, values, (error, results) => {
      connection.end();
      if (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Error updating task in the database" });
        return;
      }
  
      res.status(200).json({ message: "Task updated successfully", results });
    });
});

// Get all tasks
app.get('/api/getTasks', (req, res) => {
    let connection = mysql.createConnection(config);
    connection.connect();
  
    const sql = 'SELECT id, title, description, deadline, weight, course, type FROM tasks';
    connection.query(sql, (error, results) => {
      connection.end();
      if (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: "Error fetching tasks from the database" });
        return;
      }
      res.json(results);
    });
});

app.delete('/api/deleteEvent', async (req, res) => {
	const { id } = req.body; 
	
	let connection = mysql.createConnection(config);
	connection.connect();
  
	const sql = 'DELETE FROM Events WHERE id = ?';
	connection.query(sql, [id], (error, results) => {
	  connection.end();
  
	  if (error) {
		console.error("Failed to delete event:", error);
		return res.status(500).json({ message: 'Failed to delete event' });
	  }
  
	  res.status(200).json({ message: 'Event deleted successfully' });
	});
  });
  
  app.put('/api/editEvent', (req, res) => {
	const { id, title, description, start, end, eventType, course } = req.body;
  
	let connection = mysql.createConnection(config);
	connection.connect();
  
	const sql = `
	  UPDATE Events
	  SET title = ?, description = ?, start = ?, end = ?, eventType = ?, course = ?
	  WHERE id = ?`;
  
	const values = [title, description, start, end, eventType, course, id];
  
	connection.query(sql, values, (error, results) => {
	  connection.end();
	  if (error) {
		console.error("Error updating event:", error);
		res.status(500).json({ message: "Error updating event in the database" });
		return;
	  }
  
	  res.status(200).json({ message: "Event updated successfully", results });
	});
  });
  
  app.get('/api/getEvents', (req, res) => {
	let connection = mysql.createConnection(config);
	connection.connect();
  
	const sql = 'SELECT id, title, description, start, end, eventType, course FROM Events';
	connection.query(sql, (error, results) => {
	  connection.end();
	  if (error) {
		console.error('Error fetching events:', error);
		res.status(500).json({ message: "Error fetching events from the database" });
		return;
	  }
	  const events = results.map(event => ({
		...event,
		start: new Date(event.start),
		end: new Date(event.end)
	  }));
	  res.json(events);
	});
  });

app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version
