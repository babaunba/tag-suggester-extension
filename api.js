export class BackendAPI {
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
};
