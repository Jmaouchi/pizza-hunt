const $backBtn = document.querySelector('#back-btn');
const $pizzaName = document.querySelector('#pizza-name');
const $createdBy = document.querySelector('#created-by');
const $createdAt = document.querySelector('#created-at');
const $size = document.querySelector('#size');
const $toppingsList = document.querySelector('#toppings-list');
const $commentSection = document.querySelector('#comment-section');
const $newCommentForm = document.querySelector('#new-comment-form');

let pizzaId;

function getPizza() {
  // get id of pizza
  const searchParams = new URLSearchParams(document.location.search.substring(1));
  const pizzaId = searchParams.get('id');

  // get pizzaInfo
  fetch(`/api/pizzas/${pizzaId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error({ message: 'Something went wrong!' });
      }

      return response.json();
    })
    .then(printPizza)
    .catch(err => {
      console.log(err);
      alert('Cannot find a pizza with this id! Taking you back.');
      // any error takes the user back to the home page
      //The window history API exposes methods that let us control the state of the browser's session. 
      //As long as this particular browser session has a previous page, 
      //it will behave as if the user had clicked on the "Back" button.
      window.history.back();
    });
}

function printPizza(pizzaData) {
  console.log(pizzaData);

  pizzaId = pizzaData._id;

  const { pizzaName, createdBy, createdAt, size, toppings, comments } = pizzaData;

  $pizzaName.textContent = pizzaName;
  $createdBy.textContent = createdBy;
  $createdAt.textContent = createdAt;
  $size.textContent = size;
  $toppingsList.innerHTML = toppings
    .map(topping => `<span class="col-auto m-2 text-center btn">${topping}</span>`)
    .join(''); // this will map on every topping 

  // loop through the comments if they exist or not
  if (comments && comments.length) {
    // if there is comments, then use the printComment function to display them
    comments.forEach(printComment);
  } else {
    // if there is no comments then add this h4, with no comments yet as a text content 
    $commentSection.innerHTML = '<h4 class="bg-dark p-3 rounded">No comments yet!</h4>';
  }
}

function printComment(comment) {
  // make div to hold comment and subcomments
  const commentDiv = document.createElement('div');
  commentDiv.classList.add('my-2', 'card', 'p-2', 'w-100', 'text-dark', 'rounded');

  const commentContent = `
      <h5 class="text-dark">${comment.writtenBy} commented on ${comment.createdAt}:</h5>
      <p>${comment.commentBody}</p>
      <div class="bg-dark ml-3 p-2 rounded" >
        ${
          comment.replies && comment.replies.length
            ? `<h5>${comment.replies.length} ${
                comment.replies.length === 1 ? 'Reply' : 'Replies'
              }</h5>
        ${comment.replies.map(printReply).join('')}`
            : '<h5 class="p-1">No replies yet!</h5>'
        }
      </div>
      <form class="reply-form mt-3" data-commentid='${comment._id}'>
        <div class="mb-3">
          <label for="reply-name">Leave Your Name</label>
          <input class="form-input" name="reply-name" required />
        </div>
        <div class="mb-3">
          <label for="reply">Leave a Reply</label>
          <textarea class="form-textarea form-input"  name="reply" required></textarea>
        </div>

        <button class="mt-2 btn display-block w-100">Add Reply</button>
      </form>
  `;

  commentDiv.innerHTML = commentContent;
  //The Element.prepend() method inserts a set of Node objects or
  // string objects before the first child of the Element (parent element). String objects are inserted as equivalent Text nodes
  $commentSection.prepend(commentDiv);
}


function printReply(reply) {
  return `
  <div class="card p-2 rounded bg-secondary">
    <p>${reply.writtenBy} replied on ${reply.createdAt}:</p>
    <p>${reply.replyBody}</p>
  </div>
`;
}


// handle the add comments method 
function handleNewCommentSubmit(event) {
  event.preventDefault();

  const commentBody = $newCommentForm.querySelector('#comment').value;
  const writtenBy = $newCommentForm.querySelector('#written-by').value;

  if (!commentBody || !writtenBy) {
    return false;
  }

  const formData = { commentBody, writtenBy };

  fetch(`/api/comments/${pizzaId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      response.json();
    })
    .then(commentResponse => {
      console.log(commentResponse);
      location.reload();
    })
    .catch(err => {
      console.log(err);
    });
}


// handle the reply method 
function handleNewReplySubmit(event) {
  event.preventDefault();

  if (!event.target.matches('.reply-form')) {
    return false;
  }

  const commentId = event.target.getAttribute('data-commentid');

  const writtenBy = event.target.querySelector('[name=reply-name]').value;
  const replyBody = event.target.querySelector('[name=reply]').value;

  if (!replyBody || !writtenBy) {
    return false;
  }

  const formData = { writtenBy, replyBody };

  fetch(`/api/comments/${pizzaId}/${commentId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      response.json();
    })
    .then(commentResponse => {
      console.log(commentResponse);
      location.reload();
    })
    .catch(err => {
      console.log(err);
    });
};

$backBtn.addEventListener('click', function() {
  window.history.back();
});

$newCommentForm.addEventListener('submit', handleNewCommentSubmit);
$commentSection.addEventListener('submit', handleNewReplySubmit);
getPizza();
