const express = require('express');
const app = express();
app.use(express.json());

let users = [];

// 1. Registration API
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    
    if (users.find(user => user.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password
    };
    
    users.push(newUser);
    res.status(201).json({ message: 'User registered successfully', user: newUser });
});

// 2. Login API
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(user => user.email === email && user.password === password);
    
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    res.json({ message: 'Login successful', user });
});

// 3. Search API
app.get('/search', (req, res) => {
    const { email } = req.query;
    const user = users.find(user => user.email === email);
    
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
});

// 4. Profile Update API
app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    users[userIndex] = { ...users[userIndex], name, email, password };
    res.json({ message: 'User updated successfully', user: users[userIndex] });
});

// 5. Delete User API
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    users.splice(userIndex, 1);
    res.json({ message: 'User deleted successfully' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});