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
  name: {
    type: String,
    minLength: [3, "Name needs to be at least 3 characters long"],
  },
  number: {
    type: String,
    minLength: [8, "Number needs to be at least 8 characters long"],
    validate: {
      validator: function (v) {
        let specialChar = "-";
        let isRightPosition = false;
        let dashNumber = 0;
        const characterArray = v.split("");
        characterArray.forEach((char, index) => {
          if (char === specialChar) {
            dashNumber += 1;

            if (index === 2 || index === 3) {
              isRightPosition = true;
            }
          }
        });

        if (dashNumber > 1 || isRightPosition === false) {
          return false;
        }

        return true;
      },
      message: (props) => `${props.value} is not a valid number`,
    },
  },
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
