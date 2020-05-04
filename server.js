const cors = require('cors');
const connectToDB = require('./config/db');
const UserRoute = require('./routes/api/users');
const AuthRoute = require('./routes/api/auth');
const PostsRoute = require('./routes/api/posts');
const ProfileRoute = require('./routes/api/profile');
const express = require('express');
const app = express();

app.use(cors());
app.use(express.json())

connectToDB()
app.use('/api/users', UserRoute)
app.use('/api/auth', AuthRoute)
app.use('/api/posts', PostsRoute)
app.use('/api/profile', ProfileRoute)

const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})