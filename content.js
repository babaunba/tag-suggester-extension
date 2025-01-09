/* Constants */

const SUGGESTED_LABELS_CONTAINER_ID = "suggested-labels-container";

/* Global state */

let suggestedLabels = [];

/* Labels module */

function __createLabelItem(name, callback) {
    const element = document.createElement("div");
    element.setAttribute("class", "suggested-labels__item");
    element.innerText = name;
    element.onclick = () => callback(name);

    return element;
}

function createSuggestedLabelsContainer(names, callback) {
    const suggestedLabelsContainer = document.createElement("div");
    suggestedLabelsContainer.setAttribute("class", "suggested-labels");

    for (const name of names) {
        const item = __createLabelItem(name, callback);
        suggestedLabelsContainer.appendChild(item);
    }

    return suggestedLabelsContainer;
}

/* Main */

function getIssueData() {
    const issueTitle = document.getElementById('issue_title')?.value || '';
    const issueBody = document.getElementById('issue_body')?.value || '';
    return {
        title: issueTitle,
        body: issueBody
    };
}

/* Labels */

function getLabelMenuItems() {
    let menuItems = [];
    const labelMenuItems = document.querySelectorAll("#labels-select-menu .js-filterable-issue-labels .select-menu-item");

    for (const menuItem of labelMenuItems) {
        menuItems.push({
            name: menuItem.getAttribute("data-prio-filter-value"),
            isSelected: menuItem.getAttribute("aria-checked") === "true",
            element: menuItem,
        });
    }

    return menuItems;
}

function getActiveLabels() {
    let selectedLabels = [];

    for (const menuItem of getLabelMenuItems()) {
        if (menuItem.isSelected) {
            selectedLabels.push(menuItem.name);
        }
    }

    return selectedLabels;
}

function selectLabel(name) {
    if (getActiveLabels().includes(name)) {
        return;
    }

    const selectMenu = document.querySelector("#labels-select-menu summary");

    for (const menuItem of getLabelMenuItems()) {
        if (menuItem.name === name) {
            menuItem.element.click();
            selectMenu.click();
            selectMenu.click();
            return;
        }
    }
}

function handleInputChange() {
    const issueData = getIssueData();
    console.log("Issue Data:", issueData);
}

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
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

function getSuggestedNotActiveLabels() {
    const activeLabels = getActiveLabels();
    let result = [];

    for (const label of suggestedLabels) {
        if (!activeLabels.includes(label)) {
            result.push(label);
        }
    }

    return result;
}

function insertContainer(container) {
    const labelsSidebar = document.querySelector('.js-issue-sidebar-form[data-cache-name="labels"]');
    const lastElement = labelsSidebar.children[labelsSidebar.children.length - 1];
    labelsSidebar.insertBefore(container, lastElement);
}

function initSuggestedLabelsContainer() {
    const labels = getSuggestedNotActiveLabels();
    const container = createSuggestedLabelsContainer(labels, selectLabel);
    container.id = SUGGESTED_LABELS_CONTAINER_ID;
    insertContainer(container);
}

const callback = (mutationsList, observer) => {
    if (document.getElementById(SUGGESTED_LABELS_CONTAINER_ID)) return;
    console.log("Container was deleted!");
    initSuggestedLabelsContainer();
};

console.log("Start");

window.addEventListener("load", () => {
    console.log("Page loaded");
    console.log("Setup ...");
    setupInputListeners();
    console.log("Setup ... [ok]");

    console.log("Init container ...");
    initSuggestedLabelsContainer();

    const observer = new MutationObserver(callback);
    const labelsSidebar = document.querySelector('#new_issue');
    observer.observe(labelsSidebar, { childList: true, subtree: true });
    console.log("Init container ... [ok]");

    chrome.runtime.sendMessage(
        {
            action: "api.GetLabels",
            data: {
                title: "a",
                description: "b",
            }
        },
        labels => {
            console.log("Got suggested labels: ", labels);
            suggestedLabels = labels;
            initSuggestedLabelsContainer();
        },
    );
});
