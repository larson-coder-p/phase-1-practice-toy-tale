let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.querySelector("#toy-collection");

  // Fetch Andy's Toys when DOM is loaded
  fetchToys();

  // Toggle form visibility
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Add New Toy Form Submission
  const toyForm = document.querySelector(".add-toy-form");
  toyForm.addEventListener("submit", event => {
    event.preventDefault();

    const toyName = event.target.name.value;
    const toyImage = event.target.image.value;

    createToy(toyName, toyImage);
    event.target.reset();
  });

  // Like Button Event Listener
  toyCollection.addEventListener("click", event => {
    if (event.target.classList.contains("like-btn")) {
      const toyId = event.target.dataset.id;
      const likeDisplay = event.target.previousElementSibling;

      updateLikes(toyId, likeDisplay);
    }
  });

  // Function to fetch toys from the server
  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => {
          renderToy(toy);
        });
      });
  }

  // Function to create a new toy
  function createToy(name, image) {
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        name: name,
        image: image,
        likes: 0
      })
    })
    .then(response => response.json())
    .then(newToy => {
      renderToy(newToy);
    });
  }

  // Function to update likes for a toy
  function updateLikes(toyId, likeDisplay) {
    const currentLikes = parseInt(likeDisplay.textContent);
    const newLikes = currentLikes + 1;

    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        likes: newLikes
      })
    })
    .then(response => response.json())
    .then(updatedToy => {
      likeDisplay.textContent = `${updatedToy.likes} Likes`;
    });
  }

  // Function to render a single toy card
  function renderToy(toy) {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
    `;

    toyCollection.appendChild(card);
  }
});
