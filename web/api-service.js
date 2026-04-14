export class ApiService {
    #baseURL;

    constructor(){
        this.#baseURL = "http://localhost:4200";
    }

    async getArticles(){
        let articles = await fetch(
            this.#baseURL + '/articles'
        );

        return await articles.json();
    }
}