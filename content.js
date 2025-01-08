console.log("Start");

function getIssueData() {
    const issueTitle = document.getElementById('issue_title')?.value || '';
    const issueBody = document.getElementById('issue_body')?.value || '';
    return {
        title: issueTitle,
        body: issueBody
    };
}

function handleInputChange() {
    const issueData = getIssueData();
    console.log("Issue Data:", issueData);
}

function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }  

function setupInputListeners() {
    console.log("Setup input listeners...");

    const titleInput = document.getElementById('issue_title');
    const bodyInput = document.getElementById('issue_body');
    const debouncedHandleInputChange = debounce(handleInputChange, 500);

    if (titleInput) {
        titleInput.addEventListener("input", debouncedHandleInputChange);
    }

    if (bodyInput) {
        bodyInput.addEventListener("input", debouncedHandleInputChange);
    }

    console.log("Setup input listeners... [ok]");
}

window.addEventListener("load", () => {
    console.log("Page loaded");
    console.log("Setup ...");
    setupInputListeners();
    console.log("Setup ... [ok]");
});
