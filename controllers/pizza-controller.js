// require the pizza model or table (mysql)
const { Pizza } = require('../models');

const pizzaController = {
  // get all pizzas
  getAllPizza(req, res) {
    Pizza.find({}) // empty object will find evrything 
      // this populate is to get all the column from the comments model, same as include in mysql
      .populate({
        path: 'comments',
        select: '-__v'
      })
      // this wiill take off the _v that is coming from the data (this is a mongoose field by default)
      .select('-__v')
      // this method will sort the data from newest to oldest
      .sort({ _id: -1 })
      //then display the data
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get one pizza by id
  getPizzaById({ params }, res) {
    Pizza.findOne({ _id: params.id })
      // this populate is to get all the column from the comments model, same as include in mysql
      .populate({
      path: 'comments',
      select: '-__v'
      })
      .select('-__v')
      .then(dbPizzaData => {
        // If no pizza is found, send 404
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },


  // createPizza
  createPizza({ body }, res) {  // usaly its (req,res) but here we used body instead of req, this is just an object destructring, 
    // cause we need only body in this case
    Pizza.create(body)
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => res.status(400).json(err));
},


  // update pizza by id
  updatePizza({ params, body }, res) {
    // here we have id then body, then true
    //With Mongoose, the "where" clause is used first ({ _id: params.id }), then the data that we want to updat is (body), 
    // if we want to update only the pizza name then we can change the body to {$set:{pizzaName: body.pizzaName}}
    // then options for how the data should be returned ({ new: true })
    Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true , runValidators: true})// this {new: true } will return the original document. 
    //By setting the parameter to true, we're instructing Mongoose to return the new version of the document
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.status(400).json(err));
  },


  // delete pizza
  deletePizza({ params }, res) {
    Pizza.findOneAndDelete({ _id: params.id })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        console.log(dbPizzaData);
        res.json({message: `Pizza with id of ${dbPizzaData.createdBy} created at ${dbPizzaData.createdAt} is been deleted`});
      })
      .catch(err => res.status(400).json(err));
  }
}




module.exports = pizzaController;