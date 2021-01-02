var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
// var passport = require('passport');
// var cookieSession = require('cookie-session');
global.appRoot = path.resolve(__dirname);

/** Import router */
var indexRouter = require('./src/routes/index');
var userRouter = require('./src/routes/userRouter');
var privilegeRouter = require('./src/routes/privilegeRouter');
var subjectRouter = require('./src/routes/subjectRouter');
var timelineRouter = require('./src/routes/timelineRouter');
var informationRouter = require('./src/routes/informationRouter');
var forumRouter = require('./src/routes/forumRouter');
var discussionRouter = require('./src/routes/discussionRouter');
var assignmentRouter = require('./src/routes/assignmentRouter');
var examRouter = require('./src/routes/examRouter');
var topicRouter = require('./src/routes/topicRouter');
var quizBankRouter = require('./src/routes/quizBankRouter');
var surveyRouter = require('./src/routes/surveyRouter');
var surveyBankRouter = require('./src/routes/surveyBankRouter');
/** Config database */
const dbConfig = process.env.MONGODB_URL;
const mongoose = require("mongoose");

var app = express();
mongoose.Promise = global.Promise;

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'jade');

//Config passport
// app.use(cookieSession({
//     // milliseconds of a day
//     maxAge: 24 * 60 * 60 * 1000,
//     keys: [process.env.HCMUTEUnversityHCMC]
// }));
// app.use(passport.initialize());
// app.use(passport.session());

//Config server
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Config router
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/privilege', privilegeRouter);
app.use('/subject', subjectRouter);
app.use('/timeline', timelineRouter);
app.use('/information', informationRouter);
app.use('/forum', forumRouter);
app.use('/discussion', discussionRouter);
app.use('/assignment', assignmentRouter);
app.use('/exam', examRouter);
app.use('/topic', topicRouter);
app.use('/quiz', quizBankRouter);
app.use('/survey', surveyRouter);
app.use('/questionnaire', surveyBankRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// Connecting to the database
mongoose
    .connect(dbConfig, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Successfully connected to the database");
    })
    .catch((err) => {
        console.log("Could not connect to the database. Exiting now...", err);
        process.exit();
    });

module.exports = app;