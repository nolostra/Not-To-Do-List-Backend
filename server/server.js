const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/auth');
const routes2 = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);
app.use('/api', routes2);

mongoose.connect(process.env.MONGODB_URI)
.catch(error => console.log(error));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
