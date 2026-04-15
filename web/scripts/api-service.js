export class ApiService {
    #baseURL;
    constructor() {
        this.#baseURL = "http://localhost:4200";
    }

    async #request(method, path, body = null) {
        const token = localStorage.getItem("token");
        const options = { method, headers: {} };

        if (token) options.headers["Authorization"] = `Bearer ${token}`;

        if (body) {
            if (body instanceof FormData) {
                options.body = body;
            } else {
                options.headers["Content-Type"] = "application/json";
                options.body = JSON.stringify(body);
            }
        }

        const res = await fetch(this.#baseURL + path, options);
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || res.statusText);
        }

        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await res.json();
        }
        return null;
    }

    async login(username, password) {
        return await this.#request("POST", "/auth/login", { username, password });
    }

    async register(username, password, name, surname, pronouns) {
        return await this.#request("POST", "/auth/register", { 
            username, 
            password, 
            name, 
            surname, 
            pronouns 
        });
    }

    async getArticles() {
        const user = JSON.parse(localStorage.getItem("user"));
        return await this.#request("GET", `/articles?user_id=${user?.id || ""}`);
    }

    async getArticle(id) {
        const user = JSON.parse(localStorage.getItem("user"));
        return await this.#request("GET", `/articles/${id}?user_id=${user?.id || ""}`);
    }

    async uploadImage(file) {
        const formData = new FormData();
        formData.append('image', file);
        return await this.#request("POST", "/upload", formData);
    }

    async createArticle(title, content, image_path = null) {
        const user = JSON.parse(localStorage.getItem("user"));
        return await this.#request("POST", "/articles", {
            author_id: user.id,
            title,
            content,
            image_path
        });
    }

    async deleteArticle(articleId, authorId) {
        return await this.#request("DELETE", `/articles/${articleId}?author_id=${authorId}`);
    }

    async addReaction(article_id) {
        const user = JSON.parse(localStorage.getItem("user"));
        return await this.#request("POST", "/reactions", { article_id, account_id: user.id });
    }
async removeReaction(article_id) {
    const user = JSON.parse(localStorage.getItem("user"));
    return await this.#request("DELETE", `/reactions?article_id=${article_id}&account_id=${user.id}`);
}
    async getReplies(article_id) { return await this.#request("GET", `/replies/${article_id}`); }
    async createReply(article_id, content) {
        const user = JSON.parse(localStorage.getItem("user"));
        return await this.#request("POST", "/replies", { article_id, author_id: user.id, content });
    }
    async getUsers() { return await this.#request("GET", "/users"); }
    async getUser(id) {
        const user = JSON.parse(localStorage.getItem("user"));
        return await this.#request("GET", `/users/${id}?viewer_id=${user?.id || ""}`);
    }
}