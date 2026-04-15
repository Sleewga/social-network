import { ApiService } from "./api-service.js";
import { PostManager } from "./post-manager.js";
import { setupNavAndAuth } from "./profile/auth.js";

const user = setupNavAndAuth();
if (!user) throw new Error("Not authenticated");

const api = new ApiService();
const articlesListElement = document.getElementById("articles-list");
const postManager = new PostManager(articlesListElement);

const articles = await api.getArticles();
postManager.generateArticles(articles);

const titleInput = document.getElementById("post-title");
const contentInput = document.getElementById("post-content");
const imageInput = document.getElementById("post-image");
const imageNamePreview = document.getElementById("post-image-name");
const submitBtn = document.getElementById("post-submit-btn");
const postError = document.getElementById("post-error");

imageInput.addEventListener("change", () => {
    imageNamePreview.textContent = imageInput.files[0]?.name || "";
});

submitBtn.addEventListener("click", async () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    postError.classList.add("hidden");

    if (!title || !content) {
        postError.textContent = "Title and content are required.";
        postError.classList.remove("hidden");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Posting...";

    try {
        let imagePath = null;

        if (imageInput.files && imageInput.files[0]) {
            const uploadResult = await api.uploadImage(imageInput.files[0]);
            imagePath = uploadResult.filePath;
        }

        const result = await api.createArticle(title, content, imagePath);
        
        const newArticle = await api.getArticle(result.id);
        postManager.prependArticle(newArticle);

        titleInput.value = "";
        contentInput.value = "";
        imageInput.value = "";
        imageNamePreview.textContent = "";
    } catch (err) {
        postError.textContent = err.message || "Failed to post.";
        postError.classList.remove("hidden");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Post";
    }
});