const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(express.static("dist"));
app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const isValidId = (id) => {
  if (id < 0 || id > persons.length) return false;
  return true;
};

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const personsLength = persons.length;
  const time = new Date();
  const html = `<div>
  <p>Phonebook has info for ${personsLength} people</p>
  <p>${time}</p>
  </div>`;
  res.send(html);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  if (!isValidId(id)) {
    return res.status(404).json({
      error: "person not found",
    });
  }

  const person = persons.find((person) => person.id === id);
  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  if (!isValidId(id)) {
    return res.status(404).json({
      error: "person not found",
    });
  }

  persons = persons.filter((person) => person.id !== id);
  console.log(persons);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  const isExist = persons.some((person) => person.name === body.name);

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "Missing fields",
    });
  }

  if (isExist) {
    return res.status(409).json({
      error: "The contact is already existed",
    });
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);

  return res.json(newPerson);
});

const API_PORT = process.env.API_PORT || 3001;

app.listen(API_PORT);
console.log(`Server is running on ${API_PORT}`);

const generateId = () => {
  return Math.floor(Math.random() * 1000);
};
