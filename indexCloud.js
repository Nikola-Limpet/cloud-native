const express = require('express');
const morgan = require('morgan');
const AWS = require('aws-sdk');
const app = express();

// Configure AWS
AWS.config.update({
  region: 'us-east-1'  // e.g., 'us-east-1'
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Employees';

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(morgan('dev'));

// routes
app.get('/', (req, res) => {
  res.status(200).json({ msg: 'msg' });
});

// Register employee
app.post('/api/reg', async (req, res) => {
  const body = req.body;
  
  const params = {
    TableName: TABLE_NAME,
    Item: {
      empid: body.empid,
      name: body.name,
      emailid: body.emailid,
      pass: body.pass,
      salary: body.salary
    }
  };

  try {
    await dynamoDB.put(params).promise();
    res.status(201).json({ msg: 'Employee registered' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// View all employees
app.get('/api/view', async (req, res) => {
  const params = {
    TableName: TABLE_NAME
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    res.status(200).json({ employees: data.Items });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get employee by id
app.get('/api/employee/:id', async (req, res) => {
  const id = req.params.id;
  
  const params = {
    TableName: TABLE_NAME,
    Key: {
      empid: id
    }
  };

  try {
    const data = await dynamoDB.get(params).promise();
    if (!data.Item) {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    res.status(200).json({ employee: data.Item });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update employee
app.put('/api/employee/:id', async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  const params = {
    TableName: TABLE_NAME,
    Key: {
      empid: id
    },
    UpdateExpression: 'set #name = :name, emailid = :emailid, pass = :pass, salary = :salary',
    ExpressionAttributeNames: {
      '#name': 'name' // 'name' is a reserved word in DynamoDB
    },
    ExpressionAttributeValues: {
      ':name': body.name,
      ':emailid': body.emailid,
      ':pass': body.pass,
      ':salary': body.salary
    },
    ReturnValues: 'UPDATED_NEW'
  };

  try {
    const data = await dynamoDB.update(params).promise();
    if (!data.Attributes) {
      return res.status(404).json({ msg: 'Employee not found!' });
    }
    res.status(200).json({ msg: 'Employee updated' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete employee
app.delete('/api/employee/:id', async (req, res) => {
  const id = req.params.id;
  
  const params = {
    TableName: TABLE_NAME,
    Key: {
      empid: id
    },
    ReturnValues: 'ALL_OLD'
  };

  try {
    const data = await dynamoDB.delete(params).promise();
    if (!data.Attributes) {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    res.status(200).json({ msg: 'Employee deleted' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

const PORT = 80;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});