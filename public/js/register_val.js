const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const userName = document.getElementById("userName");
const password = document.getElementById("password");
const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  let messages = {
    userNameError: "length must be between 6 and 20 characters",
    passwordError: "password is too small",
  };

  isFaulty = false;
  if (userName.value.length < 6 || userName.value.length >= 20) {
    isFaulty = true;
    document.getElementById("userNameError").innerText = messages.userNameError;
  }

  if (password.value.length < 6) {
    isFaulty = true;
    document.getElementById("passwordError").innerText = messages.passwordError;
  }

  if (isFaulty) {
    e.preventDefault();
  }
});
