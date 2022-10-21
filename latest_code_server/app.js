require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const port = process.env.PORT || 3050;
const errorHandler = require('./src/utils/errorHandler');
const userRouter = require('./src/routers/User.router');
const tokenRouter = require('./src/routers/Token.router');
const dictionaryRouter = require('./src/routers/Dictionary.router');
const markRouter = require('./src/routers/Mark.router');
const classStoryRouter = require('./src/routers/ClassStory.router');
const instructorRouter = require('./src/routers/Instructors.router');
const feeRouter = require('./src/routers/Fee.router');
const quizRouter = require('./src/routers/Quiz.router');
const uploadFileRouter = require('./src/routers/upload.router');
const feedback = require('./src/routers/Feedback.router');
const studentPortfolio = require('./src/routers/StudentPortfolio.router');
const testPaper = require('./src/routers/TestPaper.router');
//const searchFilter = require('./src/routers/search/search.router');
/**socket io */
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});
/** Middleware */
app.use(express.json());
app.use(helmet());
app.use(morgan('tiny'));
app.use(cors({ origin: '*' }));
//app.use(express.urlencoded());

/** Connect to mongoDB */
mongoose.connect(process.env.MONGO_URL_PRO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

if (process.env.NODE_ENV !== 'production') {
  mongoose.connection.on('open', () => {
    console.log('mongodb connected...');
  });
  mongoose.connection.on('error', (error) => {
    console.log(error);
  });
}

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

io.on('connection', (socket) => {
  socket.on('join', ({ user }) => {
    console.log({ user });

    socket.emit('sendData', { msg: `You get ${user}` });
  });
});

/** All Routers */
app.use('/v2/user/', userRouter);
//app.use('/v2/search/', searchFilter);
app.use('/v2/token/', tokenRouter); //generate new accessJWT using refreshJWT
app.use('/v2/dictionary/', dictionaryRouter);
app.use('/v2/mark/', markRouter);
app.use('/v2/class_story/', classStoryRouter);
app.use('/v2/instructor/', instructorRouter);
app.use('/v2/fee/', feeRouter);
app.use('/v2/quiz/', quizRouter);
app.use('/v2/file/', uploadFileRouter);
app.use('/v2/feedback/', feedback);
app.use('/v2/student_portfolio/', studentPortfolio);
app.use('/v2/test_paper/', testPaper);

/** Error handler */
app.use((req, res, next) => {
  const error = new Error('Resource Not Found!');
  error.status = 404;
  next(error);
});
app.use((error, req, res) => {
  errorHandler(error, res);
});

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
