    import { ApiService } from "./../api-service.js";
    const api = new ApiService();

    const loginBtn = document.getElementById("login-btn");
    const errorMsg = document.getElementById("error-msg");

    function showError(msg) {
      errorMsg.textContent = msg;
      errorMsg.classList.remove("hidden");
    }

    loginBtn.addEventListener("click", async () => {
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;

      if (!username || !password) {
        showError("Please fill in all fields.");
        return;
      }

      loginBtn.disabled = true;
      loginBtn.textContent = "Signing in...";

      try {
        const data = await api.login(username, password);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "index.html";
      } catch (err) {
        showError(err.message || "Invalid credentials.");
        loginBtn.disabled = false;
        loginBtn.textContent = "Sign in";
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter") loginBtn.click();
    });