const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Import the path module
const { log } = require('console');
const Ajv = require("ajv");
const schema = require("./schema.json");
const fs = require("fs");
const cookieParser = require('cookie-parser')

const app = express();
const port = 3000;


const ajv = new Ajv();
const validate = ajv.compile(schema);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// this object stores the users sessions. For larger scale applications, you can use a database or cache for this purpose
const sessions = {}

const validateCookies = (req, res) => {
  if (!req.cookies) {
      return false
  }

  const sessionToken = req.cookies['session_token']
  if (!sessionToken) {
      return false
  }
  console.log(sessions)
  userSession = sessions[sessionToken]
  if (!userSession) {
    return false
  }
  // if the session has expired, return an unauthorized error, and delete the 
  // session from our map
  if (userSession.isExpired()) {
      delete sessions[sessionToken]
    return false
  }

  return true
}

const deleteCookies = (req, res) => {
  if (!req.cookies) {
      return;
  }

  const sessionToken = req.cookies['session_token']
  if (!sessionToken) {
      return;
  }
  console.log(sessions);
  userSession = sessions[sessionToken];
  if (!userSession) {
    return;
  }
  delete sessions[sessionToken];
  return;
}


// each session contains the username of the user and the time at which it expires
class Session {
  constructor(username, expiresAt) {
      this.username = username
      this.expiresAt = expiresAt
  }

  // we'll use this method later to determine if the session has expired
  isExpired() {
      this.expiresAt < (new Date())
  }
}


app.get('/', (req, res) => {
  res.redirect('/index.html'); // Redirect to index.html
});

app.get('/logout.php', (req, res) => {
  deleteCookies(req,res)
  res.redirect('/index.html'); // Redirect to index.html
});

app.get('/todolist', (req, res) => {
  console.log('5');
  if (!validateCookies(req, res))
    res.redirect('/index.html'); // Redirect to index.html
  res.redirect('/todolist.html')
});


app.get('/webservice', (req, res) => {
  if (!validateCookies(req, res))
  {
    console.log("7");
    res.status(401)
    res.end();
    return;
  }
  fs.readFile("./list.json", "utf8", (err, jsonString) => {
    if (err)
      res.json({items: []});
    else
      res.json(JSON.parse(jsonString))
  });
  }
);

app.post('/login', (req, res) => {

  const { uname, upass } = req.body;
  if (String(uname) === "user123" && String(upass) === "12345") {
    // generate a random UUID as the session token
    const sessionToken = Math.random()

    // set the expiry time as 15m after the current time
    const now = new Date()
    const expiresAt = new Date(+now + 15 * 60 * 1000)

    // create a session containing information about the user and expiry time
    const session = new Session(uname, expiresAt)
    // add the session information to the sessions map
    sessions[sessionToken] = session

    res.cookie("session_token", sessionToken, { expires: expiresAt })
    res.json(1); // Successful login
    res.end();
  } else {
    res.json(0); // Failed login
  }
});

app.post('/logout.php', (req, res) => {
  res.json(1);
});

app.post('/webservice', (req, res) => {
  if (!validateCookies(req, res))
  {
    console.log("6");
    res.status(401)
    res.end();
    return;
  }
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
