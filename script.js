const form = document.getElementById("contactForm");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  const data = { name, email, message };

  fetch("https://portfolio-backend-ubez.onrender.com/contact", {
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
    alert("Message sent successfully");
    form.reset();
  })
  .catch(function (err) {
    console.error(err);
    alert("Error occurred");
  });
});