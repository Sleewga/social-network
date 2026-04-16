export function requireAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return null;
    }
    return JSON.parse(localStorage.getItem("user"));
}

export function getCurrentUser() {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

export function setupNavAndAuth() {
    const user = requireAuth();
    if (!user) return null;

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            logout();
        });
    }

    const navUserLink = document.getElementById("nav-user-link");
    if (navUserLink) {
        navUserLink.querySelector("a").href = `profile.html?id=${user.id}`;
    }

    return user;
}