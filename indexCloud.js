const express = require('express');
const morgan = require('morgan');
const AWS = require('aws-sdk');
const app = express();

// Configure AWS
AWS.config.update({
  region: 'us-east-1'
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Students';

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// 1. DB Connect Code (Already implemented in AWS config)

// 2. Student Schema (DynamoDB is schemaless, but we'll define our data structure)
/*
Student {
  sid: string (partition key),
  sname: string,
  semail: string,
  spass: string
}
*/

// 3. Student Registration
app.post('/register', async (req, res) => {
  const { sid, sname, semail, spass } = req.body;

  const params = {
    TableName: TABLE_NAME,
    Item: {
      sid,
      sname,
      semail,
      spass
    }
  };

  try {
    await dynamoDB.put(params).promise();
    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// 4. Student Login
app.post('/login', async (req, res) => {
  const { sid, spass } = req.body;

  const params = {
    TableName: TABLE_NAME,
    Key: { sid }
  };

  try {
    const data = await dynamoDB.get(params).promise();
    if (!data.Item || data.Item.spass !== spass) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful', student: data.Item });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// 5. Student Search
app.get('/search/:sid', async (req, res) => {
  const { sid } = req.params;

  const params = {
    TableName: TABLE_NAME,
    Key: { sid }
  };

  try {
    const data = await dynamoDB.get(params).promise();
    if (!data.Item) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(data.Item);
  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
});

// 6. Student Profile Update
app.put('/update/:sid', async (req, res) => {
  const { sid } = req.params;
  const { sname, semail, spass } = req.body;

  const params = {
    TableName: TABLE_NAME,
    Key: { sid },
    UpdateExpression: 'set sname = :sname, semail = :semail, spass = :spass',
    ExpressionAttributeValues: {
      ':sname': sname,
      ':semail': semail,
      ':spass': spass
    },
    ReturnValues: 'UPDATED_NEW'
  };

  try {
    const data = await dynamoDB.update(params).promise();
    res.json({ message: 'Profile updated', updates: data.Attributes });
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ message: 'Update failed' });
  }
});

// 7. Delete Student
app.delete('/delete/:sid', async (req, res) => {
  const { sid } = req.params;

  const params = {
    TableName: TABLE_NAME,
    Key: { sid }
  };

  try {
    await dynamoDB.delete(params).promise();
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ message: 'Deletion failed' });
  }
});

const PORT = 80;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});