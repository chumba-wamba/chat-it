const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const userName = document.getElementById("userName");
const password = document.getElementById("password");
const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  let messages = {
    lengthError: "length must be between 6 and 20 characters",
  };

  isFaulty = false;
  if (userName.value.length < 6 || userName.value.length >= 20) {
    isFaulty = true;
    document.getElementById("userNameError").innerText = messages.lengthError;
  }

  if (isFaulty) {
    e.preventDefault();
  }
});
