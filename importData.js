const mongoose = require("mongoose");
require("dotenv").config();

const persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const url = process.env.MONGO_URI || "";
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("person", personSchema);

mongoose
  .connect(url)
  .then(() => {
    console.log("Connect db success");
  })
  .catch((error) => {
    console.log("Cannot connect to db");
  });

Person.insertMany(persons)
  .then(() => {
    console.log("finish save persons");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error(error);
    console.log("Cannot save persons");
    mongoose.connection.close();
  });
