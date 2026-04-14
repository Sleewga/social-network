export class PostManager{
    #articlesElement;

    constructor(articlesElement){
        this.#articlesElement = articlesElement;
    }

    generateArticles(articles){
        // console.log(articles);
        // console.log(articles[0]);
        for (let i = 0; i < articles.length; i++){
            let articleElement = this.getArticleElement(articles[i]);

            this.#articlesElement.appendChild(articleElement);
        }
    }

    getArticleElement(article){
        const articleElement = document.createElement("li")
        articleElement.classList.add("article", "container");


        const title = document.createElement("h2");

        const articleQuickInfo = document.createElement("div")
        articleQuickInfo.classList.add("article-quick-info");

        const author = document.createElement("a");
        const date = document.createElement("span");

        author.innerText = article.username;
        let dateFormat = new Date(article.creation_time);
        date.innerText = dateFormat;
        articleQuickInfo.appendChild(author);
        articleQuickInfo.appendChild(date);

        const content = document.createElement("p");

        title.innerText = article.title;
        content.innerText = article.content;

        articleElement.appendChild(title);
        articleElement.appendChild(articleQuickInfo);
        articleElement.appendChild(content);

        return articleElement;
    }
}