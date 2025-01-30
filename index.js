const express = require('express')

const app = express()
const morgan = require('morgan')
  
// connecting using mongoDb
// const dbConnect = require('./db/db_connect')
// const Employee = require('./models/employee')

// connect using Superbase for SQL with postgres

const { dbConnect } = require('./db/supabase')
const Employee = require('./models/employeeSQl')

// sync database models

async function syncDB() {
  try {
    await Employee.sync()
    console.log('Models synchronized');
  } catch (error) {
    console.log('Error syncing models: ', error)
  }
}



// initialize db
dbConnect()
syncDB()

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use(morgan('dev'))

// routes
app.get('/', (req, res) => {
  res.status(200).json({ msg: 'msg' })
})

app.post('/api/reg', async (req, res) => {
  const body = req.body

  const employee = new Employee({
    empid: body.empid,
    name: body.name,
    emailid: body.emailid,
    pass: body.pass,
    salary: body.salary
  })
  try {
    await employee.save() 
    res.status(201).json({ msg: 'Employee registered' })
  } catch (error) {
    res.status(500).json({ msg: 'Server error' })
  }
})

// VIEW ALL API GET
app.get('/api/view', async (req, res) => {
  try {
    const employees = await Employee.findAll({})
    res.status(200).json({ employees })
  } catch (error) {
    res.status(500).json({ msg: 'Server error' })
  }
})

//get employee by id
app.get('/api/employee/:id', async (req, res) => {
  const id = req.params.id
  try {
    const employee = await Employee.findOne({ where: { empid: id } })
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' })
    }
    res.status(200).json({ employee })
    } catch (error) {
    res.status(500).json({ msg: 'Server error' })
  } 
})

// UPDATE API
app.put('/api/employee/:id', async (req, res) => {
  const id = req.params.id
  const body = req.body

  try {
    const [updated] = await Employee.update(body, {
      where: { empid: id }
    })
    if (updated === 0) {
      return res.status(404).json({ msg: 'Employee not found!'})
    }
    res.status(200).json({ msg: 'Employee updated' })
  } catch (error) {
    console.log('error')
    res.status(500).json({ msg: 'Server error' })
  }
})

// DELETE API
app.delete('/api/employee/:id', async (req, res) => {
  const id = req.params.id
  try {
    const deleted = await Employee.destroy({
      where: { empid: id }
  })

  if (deleted === 0 ) {
    return res.status(404).json({msg: 'Employee not found'})
  }

    res.status(200).json({ msg: 'Employee deleted' })

  } catch (error) {
    res.status(500).json({ msg: 'Server error' })
  }
})

const PORT = 3000

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})