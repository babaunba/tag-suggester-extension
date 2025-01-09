/* API Module */

class BackendAPI {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }

    async getPredictedLabels(issueDescription) {
        return await this.#sendPostRequest("get-tags", "POST", issueDescription);
    }

    async #sendPostRequest(endpoint, method, payload) {
        let details = {
            method: method,
            headers: {
                "Content-Type": "application/json"
            }
        };

        if (payload !== null) {
            details.body = JSON.stringify(payload);
        }

        const response = await fetch(`${this.apiUrl}/${endpoint}`, details);

        if (!response.ok) {
            throw new Error(`HTTP Error:\n\tEndpoint: ${endpoint}\n\tStatus:${response.status}`);
        }

        return await response.json();
    }
}

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
