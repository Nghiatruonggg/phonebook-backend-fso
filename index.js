const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const app = express();
const PersonModel = require("./models/person");

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

app.get("/api/persons", (req, res) => {
  PersonModel.find()
    .then((person) => {
      res.json(person);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Cannot find person" });
    });
});

app.get("/info", (req, res) => {
  PersonModel.find().then((person) => {
    const personLength = person.length;
    const time = new Date();
    const html = `<div>
    <p>Phonebook has info for ${personLength} people</p>
    <p>${time}</p>
    </div>`;
    res.send(html);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  PersonModel.findById(id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  PersonModel.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => {
      console.log(error);
      res.status(500).end();
    });
});

app.post("/api/persons", async (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "Missing fields",
    });
  }

  const person = new PersonModel({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((newPerson) => {
      return res.json(newPerson);
    })
    .catch((error) => {
      return next(error);
    });
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  PersonModel.findById(request.params.id)
    .then((person) => {
      if (!person) {
        return response.status(404).end();
      }

      person.name = name;
      person.number = number;

      return person.save({ runValidators: true }).then((updatedPerson) => {
        response.json(updatedPerson);
      });
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  console.log(error);

  switch (error.name) {
    case "CastError": {
      return response.status(400).send({
        error: "malformatted id",
      });
    }
    case "ValidationError": {
      return response.status(400).json({ error: error.message });
    }
    default: {
      return response.status(500).json({ error: error.message });
    }
  }
};

app.use(errorHandler);

const API_PORT = process.env.API_PORT || 3001;

app.listen(API_PORT);
console.log(`Server is running on ${API_PORT}`);
