const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String
    },
    createdBy: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
      type: String,
      default: 'Large'
    },
    toppings: [],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ]
  },
  { // this will allow us to add virtuals
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false //We set id to false because this is a virtual that Mongoose returns, and we don’t need it.
  }
);
// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
  // this is a virtual that can be added to the response by default, everytime a user checks to see a pizza data
  return this.comments.length;
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;