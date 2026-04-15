import { ApiService } from "./../api-service.js";
import { PostManager } from "./../post-manager.js";
import { setupNavAndAuth } from "./auth.js";

const currentUser = setupNavAndAuth();
if (!currentUser) throw new Error("Not authenticated");

const api = new ApiService();

const params = new URLSearchParams(window.location.search);
const userId = params.get("id") || currentUser.id;

const ownList = document.getElementById("own-articles-list");
const interactedList = document.getElementById("interacted-articles-list");
const ownEmpty = document.getElementById("own-empty");
const interactedEmpty = document.getElementById("interacted-empty");

const ownManager = new PostManager(ownList);
const interactedManager = new PostManager(interactedList);

try {
    const data = await api.getUser(userId);
    const { user, own_articles, interacted_articles } = data;

    document.getElementById("profile-name").innerText =
        [user.name, user.surname].filter(Boolean).join(" ") || user.username;
    document.getElementById("profile-username").innerText = "@" + user.username;
    document.getElementById("profile-pronouns").innerText = user.pronouns;
    document.getElementById("profile-since").innerText =
        "Member since " + new Date(user.creation_time).toLocaleDateString();
    document.title = user.username;

    if (own_articles.length === 0) {
        ownEmpty.classList.remove("hidden");
    } else {
        ownManager.generateArticles(own_articles);
    }

    if (interacted_articles.length === 0) {
        interactedEmpty.classList.remove("hidden");
    } else {
        interactedManager.generateArticles(interacted_articles);
    }
} catch (err) {
    document.getElementById("profile-name").innerText = "User not found";
    console.error(err);
}