import { BackendAPI } from "./api.js"

/* Init */

console.log("[background] Init ...");

console.log("[background] Init API ...");
const api = new BackendAPI("http://localhost:8000")
console.log("[background] Init API ... [ok]");

console.log("[background] Init ... [ok]");

/* Handlers */

chrome.runtime.onMessage.addListener((message, sender, callback) => {
    console.log("[background] Got event");

    if (message.action === "api.GetLabels") {
        api.getPredictedLabels(message.data)
            .then(callback)
            .catch(error => console.error("[background] Error :", error))
            
        return true;
    }
});
