export class PostManager{
    #articlesElement;

    constructor(articlesElement){
        this.#articlesElement = articlesElement;
    }

    generateArticles(articles){
        const articleElementsFragment = this.getArticleElementsFragment(articles);
        this.#articlesElement.appendChild(articleElementsFragment);
    }

    getArticleElementsFragment(articles){
        const articleElementsFragment = document.createDocumentFragment();

        for (let i = 0; i < articles.length; i++){
            const articleElement = this.getArticleElement(articles[i]);
            articleElementsFragment.appendChild(articleElement);
        }

        return articleElementsFragment;
    }

    getArticleElement(article){
        const content = document.createElement("p");

        const articleElement = document.createElement("li")
        articleElement.classList.add("article", "container");

        const articleHeaderElement = this.getArticleHeaderElement(article);

        content.innerText = article.content;

        articleElement.appendChild(articleHeaderElement);
        articleElement.appendChild(content);

        return articleElement;
    }

    getArticleHeaderElement(article){
        const title = document.createElement("h2");
        const author = document.createElement("a");
        const date = document.createElement("span");

        const articleHeader = document.createElement("section");
        articleHeader.classList.add("article-header");

        const articleQuickInfo = document.createElement("div")
        articleQuickInfo.classList.add("article-quick-info");

        title.innerText = article.title;
        author.innerText = article.username;
        let dateFormat = new Date(article.creation_time);
        date.innerText = dateFormat.toLocaleDateString();

        articleHeader.appendChild(title);
        articleHeader.appendChild(articleQuickInfo);
        articleQuickInfo.appendChild(author);
        articleQuickInfo.appendChild(date);

        return articleHeader;
    }
}