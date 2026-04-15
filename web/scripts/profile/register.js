    import { ApiService } from "./../api-service.js";
    const api = new ApiService();

    const registerBtn = document.getElementById("register-btn");
    const errorMsg = document.getElementById("error-msg");
    const successMsg = document.getElementById("success-msg");

    function showError(msg) {
      errorMsg.textContent = msg;
      errorMsg.classList.remove("hidden");
      successMsg.classList.add("hidden");
    }

    function showSuccess(msg) {
      successMsg.textContent = msg;
      successMsg.classList.remove("hidden");
      errorMsg.classList.add("hidden");
    }

    registerBtn.addEventListener("click", async () => {
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;
      const name = document.getElementById("name").value.trim();
      const surname = document.getElementById("surname").value.trim();
      const pronouns = document.getElementById("pronouns").value;
      const age = parseInt(document.getElementById("age").value);

      if (!username || !password || !pronouns) {
        showError("Username, password and pronouns are required.");
        return;
      }

      if (isNaN(age) || age < 13) {
        showError("You must be at least 13 years old to register.");
        return;
      }

      registerBtn.disabled = true;
      registerBtn.textContent = "Creating account...";

      try {
        await api.register(username, password, name, surname, pronouns);
        showSuccess("Account created! Redirecting to login...");
        setTimeout(() => window.location.href = "login.html", 1500);
      } catch (err) {
        showError(err.message || "Registration failed.");
        registerBtn.disabled = false;
        registerBtn.textContent = "Create account";
      }
    });