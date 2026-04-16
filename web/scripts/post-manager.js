import { ApiService } from "./api-service.js";
import { getCurrentUser } from "./profile/auth.js";

const api = new ApiService();
const currentUser = getCurrentUser();

export class PostManager {
    #articlesListElement;

    constructor(articlesListElement) {
        this.#articlesListElement = articlesListElement;
    }

    generateArticles(articles) {
        this.#articlesListElement.innerHTML = "";
        if (articles.length === 0) {
            this.#articlesListElement.innerHTML = "<p class='empty-msg'>No posts found.</p>";
            return;
        }

        const fragment = document.createDocumentFragment();
        for (const article of articles) {
            fragment.appendChild(this.getArticleElement(article));
        }
        this.#articlesListElement.appendChild(fragment);
    }

    prependArticle(article) {
        const firstChild = this.#articlesListElement.firstChild;
        const newElem = this.getArticleElement(article);
        
        if (firstChild && this.#articlesListElement.querySelector('.empty-msg')) {
            this.#articlesListElement.innerHTML = "";
            this.#articlesListElement.appendChild(newElem);
        } else {
            this.#articlesListElement.prepend(newElem);
        }
    }

    getArticleElement(article) {
        const li = document.createElement("li");
        li.classList.add("article", "container");
        li.dataset.id = article.id;

        li.appendChild(this.getArticleHeaderElement(article, li));

        const content = document.createElement("p");
        content.classList.add("article-content");
        content.innerText = article.content;
        li.appendChild(content);

        if (article.image_path) {
            const img = document.createElement("img");
            img.src = `http://localhost:4200/images/${article.image_path}`;
            img.classList.add("article-image");
            img.alt = article.title;
            li.appendChild(img);
        }

        li.appendChild(this.getArticleFooterElement(article));
        li.appendChild(this.getRepliesSection(article));

        return li;
    }

    getArticleHeaderElement(article, parentLi) {
        const header = document.createElement("section");
        header.classList.add("article-header");

        const title = document.createElement("h2");
        title.innerText = article.title;
        header.appendChild(title);

        const info = document.createElement("div");
        info.classList.add("article-quick-info");
        info.innerHTML = `
            <a href="profile.html?id=${article.author_id}">${article.username}</a> 
            <span>• ${new Date(article.creation_time).toLocaleDateString()}</span>
        `;
        header.appendChild(info);

        if (currentUser && article.author_id === currentUser.id) {
            const deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
            deleteBtn.classList.add("delete-btn");

            deleteBtn.onclick = async (e) => {
                e.preventDefault();
                if (confirm("Are you sure you want to delete this post?")) {
                    try {
                        await api.deleteArticle(article.id, currentUser.id);
                        parentLi.remove();
                        if (this.#articlesListElement.children.length === 0) {
                            this.#articlesListElement.innerHTML = "<p class='empty-msg'>No posts found.</p>";
                        }
                    } catch (err) {
                        alert("Error: Could not delete post.");
                    }
                }
            };
            header.appendChild(deleteBtn);
        }

        return header;
    }

    getArticleFooterElement(article) {
        const footer = document.createElement("section");
        footer.classList.add("article-footer");

        const interactions = document.createElement("div");
        interactions.classList.add("interactions");

        const likeBtn = document.createElement("button");
        const isLikedInitial = article.user_liked === 1 || article.user_liked === true;
        likeBtn.className = `like-btn ${isLikedInitial ? 'liked' : ''}`;
        
        likeBtn.innerHTML = `
            <span><i class="fa-solid fa-heart"></i></span>
            <span class="like-count">${article.reaction_count || 0}</span>
        `;

        likeBtn.onclick = async () => {
            if (!currentUser) return alert("Log in to like posts.");
            
            const isCurrentlyLiked = likeBtn.classList.contains("liked");
            const countSpan = likeBtn.querySelector(".like-count");
            let currentCount = parseInt(countSpan.innerText);

            try {
                if (isCurrentlyLiked) {
                    await api.removeReaction(article.id);
                    likeBtn.classList.remove("liked");
                    countSpan.innerText = Math.max(0, currentCount - 1);
                } else {
                    await api.addReaction(article.id);
                    likeBtn.classList.add("liked");
                    countSpan.innerText = currentCount + 1;
                }
            } catch (err) {
                console.error("Like error:", err);
                alert("Could not update reaction.");
            }
        };

        interactions.appendChild(likeBtn);
        footer.appendChild(interactions);
        return footer;
    }

    getRepliesSection(article) {
        const section = document.createElement("div");
        section.classList.add("replies-section");

        const toggleBtn = document.createElement("button");
        toggleBtn.classList.add("toggle-replies-btn");
        toggleBtn.innerHTML = `<i class="fa-solid fa-comment"></i> Comments`;

        const container = document.createElement("div");
        container.classList.add("replies-container", "hidden");

        const form = document.createElement("div");
        form.classList.add("reply-form");
        form.innerHTML = `
            <input type="text" placeholder="Write a comment..." />
            <button class="btn btn-small">Send</button>
        `;

        const input = form.querySelector("input");
        const sendBtn = form.querySelector("button");

        toggleBtn.onclick = async () => {
            const isHidden = container.classList.toggle("hidden");
            if (!isHidden && container.innerHTML === "") {
                await this.loadReplies(article.id, container);
            }
        };

        sendBtn.onclick = async () => {
            const content = input.value.trim();
            if (!content) return;
            try {
                await api.createReply(article.id, content);
                input.value = "";
                await this.loadReplies(article.id, container);
                container.classList.remove("hidden");
            } catch (err) {
                alert("Failed to post comment.");
            }
        };

        section.appendChild(toggleBtn);
        section.appendChild(container);
        section.appendChild(form);
        return section;
    }

    async loadReplies(articleId, container) {
        container.innerHTML = "<p class='loading-msg'>Loading comments...</p>";
        try {
            const replies = await api.getReplies(articleId);
            container.innerHTML = "";
            if (!replies || replies.length === 0) {
                container.innerHTML = "<p class='empty-msg'>No comments yet.</p>";
                return;
            }
            const ul = document.createElement("ul");
            ul.classList.add("replies-list");
            replies.forEach(reply => {
                const li = document.createElement("li");
                li.classList.add("reply");
                li.innerHTML = `
                    <div class="reply-meta">
                        <a href="profile.html?id=${reply.author_id}">${reply.username}</a>
                        <span>${new Date(reply.creation_time).toLocaleDateString()}</span>
                    </div>
                    <p>${reply.content}</p>
                `;
                ul.appendChild(li);
            });
            container.appendChild(ul);
        } catch (err) {
            container.innerHTML = "<p class='error-msg'>Could not load comments.</p>";
        }
    }
}