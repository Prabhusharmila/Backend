const http = require('http');
const url = require('url');
const querystring = require('querystring');
const StudentModel = require('../models/Student');

const studentRoute = (app) => {

app.get('/students', (req, res, next) => {
StudentModel.find((error, data) => {
if (error) {
return next(error)
} else {
res.json(data)
}
})
})

app.post('/create-student', (req, res, next) => {
StudentModel.create(req.body, (error, data) => {
if (error) {
return next(error)
} else {
res.json(data)
}
})
});

app.get('/edit-student/:id', (req, res, next) => {
StudentModel.findById(req.params.id, (error, data) => {
if (error) {
return next(error)
} else {
res.json(data)
}
})
})

// Update student
app.post('/update-student/:id', (req, res, next) => {
StudentModel.findByIdAndUpdate(req.params.id, {
$set: req.body
}, (error, data) => {
if (error) {
return next(error);
} else {
res.json(data)
console.log('Student successfully updated!')
}
})
})

// Delete student
app.delete('/delete-student/:id', (req, res, next) => {
StudentModel.findByIdAndRemove(req.params.id, (error, data) => {
if (error) {
return next(error);
} else {
res.status(200).json({
msg: data
})
}
})
})

}

module.exports = studentRoute;


