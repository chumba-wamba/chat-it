const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

form.addEventListener("submit", (e) => {
  if (password.value !== confirmPassword.value) {
    e.preventDefault();
    document.getElementById("passwordError").textContent =
      "Passwords don't match 😔. Try again!";
  }
});
