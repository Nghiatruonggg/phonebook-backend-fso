const mongoose = require("mongoose");

const url = process.env.MONGO_URI || "";

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.log("Error connecting to the database", error);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const PersonModel = mongoose.model("person", personSchema);

personSchema.set("toJSON", {
  transform: (document, returnedObjects) => {
    returnedObjects.id = returnedObjects._id.toString();
    delete returnedObjects._id;
    delete returnedObjects.__v;
  },
});

module.exports = PersonModel;
