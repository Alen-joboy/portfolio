const form = document.getElementById("contactForm");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  try {
    const response = await fetch("https://portfolio-backend-ubsz.onrender.com/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, message })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    const data = await response.json();
    alert("Message sent successfully ✅");

  } catch (error) {
    console.error("ERROR:", error);
    alert("Error: " + error.message);
  }
});