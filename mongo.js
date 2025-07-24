const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGODB_URI || "";

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("person", personSchema);

mongoose.connect(url);

if (process.argv.length === 5) {
  const personObj = {
    name: process.argv[3],
    number: process.argv[4],
  };

  const newPerson = new Person(personObj);

  newPerson.save().then(() => {
    console.log(
      `added ${personObj.name} number ${personObj.number} to phonebook`
    );
    mongoose.connection.close();
  });
} else if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}
