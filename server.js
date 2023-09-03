const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Import the path module
const { log } = require('console');
const Ajv = require("ajv");
const schema = require("./schema.json");
const fs = require("fs");

const app = express();
const port = 3000;


const ajv = new Ajv();
const validate = ajv.compile(schema);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect('/index.html'); // Redirect to index.html
});

app.get('/logout.php', (req, res) => {
  res.redirect('/index.html'); // Redirect to index.html
});

app.get('/webservice', (req, res) => {
  fs.readFile("./list.json", "utf8", (err, jsonString) => {
    if (err)
      res.json({items: []});
    else
      res.json(JSON.parse(jsonString))
  });
  
});

app.post('/login', (req, res) => {
  const { uname, upass } = req.body;
  if (String(uname) === "user123" && String(upass) === "12345") {
    res.json(1); // Successful login
  } else {
    res.json(0); // Failed login
  }
});

app.post('/logout.php', (req, res) => {
  res.json(1);
});

app.post('/webservice', (req, res) => {
  const valid = validate(req.body);
  if (!valid) {
    return res.status(400).json({ errors: validate.errors });
  }
  const items = req.body;
  fs.writeFileSync('./list.json', JSON.stringify(items), function(err) {
    if (err)
      fs.appendFile('./list.json', JSON.stringify(items));
  })
  res.json(items);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});