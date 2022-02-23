//module
//validation
const Joi = require('joi');
const express = require("express");
const morgan = require('morgan');

// creating express route handler
const router = express.Router()

var app = express();

// Database config
const connection = require('./config/db.config')
connection.once('open', () => console.log('DB Connected'))
connection.on('error', () => console.log('Error'))

// register view engine
app.set('view engine', 'ejs');

// Routes Config
app.use(express.json({
    extended: false
})) //parse incoming request body in JSON format.

app.use('/', require('./routes/redirect'))
app.use('/api/url', require('./routes/url'))

//Listen for incoming requests
const PORT = process.env.PORT || 5000
console.log(process.env.PORT)
app.listen(PORT, console.log(`server started, listening PORT ${PORT}`))


//for post function
app.use(express.json());


const Logger = require('./logger');
const logger = new Logger(); 

//register event
logger.on('messageLogged', function(arg){
    console.log('listener called ',arg);
});


logger.log('message');

const courses=[
    {id:1, name:'course1'},
    {id:2, name:'course2'},
    {id:3, name:'course3'}
];


//response when user access root
app.get("/", (req,res)=>{
    //redirect
    
    res.send('hi');
});
app.get('/about', (req,res)=>{
    //redirect
    res.redirect('https://www.google.com');
})

app.get("/api/courses", (req,res)=>{
    res.send(courses);
});
app.get("/api/courses/:id", (req,res)=>{
    const course = courses.find(c=>c.id===parseInt(req.params.id));
    if(!course) return res.status(404).send('the course is not find');
    res.send(course);
});
//create
app.post('/api/courses', (req, res)=>{
    //if invalid, return 400-bad request
    const {error} = validateCourse(req.body);//result.error
    //400 bad req
    if(error) return res.status(400).send(error.details[0].message);
    
    const course = {
        id: courses.length+1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
});
app.put('/api/courses/:id', (req, res)=>{
    //look up course
    //if dne, return 404
    const course = courses.find(c=>c.id===parseInt(req.params.id));
    if(!course) res.status(404).send('the course is not find');
    
    //validate
    //if invalid, return 400-bad request
    const {error} = validateCourse(req.body);//result.error
    //400 bad req
    if(error) return res.status(400).send(error.details[0].message);
    
    //update course
    //return the updated course
    course.name = req.body.name;
    res.send(course);
});
app.delete('/api/courses/:id', (req,res)=>{
    //look up the course
    //if dne return 404
    const course = courses.find(c=>c.id===parseInt(req.params.id));
    if(!course) return res.status(404).send('the course is not find');
    
    
    //delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    //return the same course

    res.send(course);
});


function validateCourse(course)
{
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    return schema.validate(course);
}


// //update
// app.put();
// //create
// app.delete();
