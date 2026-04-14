import { ApiService } from "./api-service.js";
import { PostManager } from "./post-manager.js";

const apiService = new ApiService();

const articlesElement = document.getElementById("articles");
const postManager = new PostManager(articlesElement);


// let test = document.querySelector("body");

let articles = await apiService.getArticles();
postManager.generateArticles(articles);


// for (let i = 0; i < articles.length; i++){
//     let testsss = document.createElement("div");
//     testsss.innerText = articles[i].title;
//     test.appendChild(testsss);

//     console.log(articles[i].title);
// }