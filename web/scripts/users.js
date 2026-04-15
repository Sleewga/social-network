import { ApiService } from "./api-service.js";
import { setupNavAndAuth } from "./profile/auth.js";

setupNavAndAuth();

const api = new ApiService();
const list = document.getElementById("users-list");

try {
    const users = await api.getUsers();
    for (const user of users) {
        const li = document.createElement("li");
        li.classList.add("user-item", "container");

        const avatar = document.createElement("div");
        avatar.classList.add("user-avatar");
        avatar.innerHTML = `<i class="fa-solid fa-circle-user"></i>`;

        const info = document.createElement("div");
        info.classList.add("user-info");

        const nameLink = document.createElement("a");
        nameLink.href = `profile.html?id=${user.id}`;
        nameLink.classList.add("user-name");
        nameLink.innerText = [user.name, user.surname].filter(Boolean).join(" ") || user.username;

        const username = document.createElement("span");
        username.classList.add("user-username");
        username.innerText = "@" + user.username;

        const pronouns = document.createElement("span");
        pronouns.classList.add("user-pronouns");
        pronouns.innerText = user.pronouns;

        info.appendChild(nameLink);
        info.appendChild(username);
        info.appendChild(pronouns);

        li.appendChild(avatar);
        li.appendChild(info);
        list.appendChild(li);
    }
} catch (err) {
    list.innerHTML = `<p class="error-msg">Failed to load users.</p>`;
}