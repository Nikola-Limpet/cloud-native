const moongose = require('mongoose');

const employeeSchema = new moongose.Schema({
  empid: { type: String, required: true },
  name: String,
  emailid: String ,
  pass: String,
  salary: String,
  }, 
{ timestamps: true });


const Employee = moongose.model('Employee', employeeSchema);

module.exports = Employee;