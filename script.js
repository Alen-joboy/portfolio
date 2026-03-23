
const form = document.getElementById("contactForm");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get values from the form
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  const data = { name, email, message };

  // Send data to the backend running on port 5000
  fetch("http://localhost:5000/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(async function (response) {
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err);
    }
    return response.json();
  })
  .then(function (result) {
    alert("Message sent succesfully  ");
    form.reset();
  })
  .catch(function (err) {
    console.error(err);
    alert("Error occurred ");
  });
});