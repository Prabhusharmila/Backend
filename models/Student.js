const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let studentSchema = new Schema({
  id:{
    type:Number
  },
  name: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: Number
  },
  department: {
    type:String
  }
}, {
  collection: 'students'
})

module.exports = mongoose.model('StudentDB', studentSchema)