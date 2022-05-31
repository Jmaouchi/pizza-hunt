const $pizzaList = document.querySelector('#pizza-list');

// first we fetched the data from the /api/pizzas to get all the pizzas available in the database
// then we displayed it for the user on the clien side
const getPizzaList = () => {
  fetch('/api/pizzas')
    .then(response => response.json())
    .then(pizzaListArr => {
      // we used foreach here due to database might have many pizzas, so we will create this html template for every column in the database
      pizzaListArr.forEach(printPizza);
    })
    .catch(err => {
      console.log(err);
    });
};

const printPizza = ({ _id, pizzaName, toppings, size, commentCount, createdBy, createdAt }) => {
  const pizzaCard = `
    <div class="col-12 col-lg-6 flex-row">
      <div class="card w-100 flex-column">
        <h3 class="card-header">${pizzaName}</h3>
        <div class="card-body flex-column col-auto">
          <h4 class="text-dark">By ${createdBy}</h4>
          <p>On ${createdAt}</p>
          <p>${commentCount} Comments</p>
          <h5 class="text-dark">Suggested Size: ${size}
          <h5 class="text-dark">Toppings</h5>
          <ul>
            ${toppings
              .map(topping => {
                return `<li>${topping}</li>`;
              })
              .join('')}
          </ul>
          <a class="btn display-block w-100 mt-auto" href="/pizza?id=${_id}">See the discussion.</a>
        </div>
      </div>
    </div>
  `;

  $pizzaList.innerHTML += pizzaCard;
};


getPizzaList();