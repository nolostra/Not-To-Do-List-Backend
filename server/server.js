const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { routesAuth, routesTask } = require('./routes');
require('dotenv-flow').config();
const app = express();
const PORT = process.env.PORT || 5000
// NODE_ENV=development node server.js


app.use(cors());
app.use(bodyParser.json());
app.use('/api', routesAuth);
app.use('/api', routesTask);

console.log("uri=>",process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI)
.catch(error => console.log(error));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
