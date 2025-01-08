console.log("Start");

let suggestedLabels = [ "bug", "bug-1", "bug-2", "bug-3", "bug-4", "bug-5", "bug 1", "bug 1" ];

function getIssueData() {
    const issueTitle = document.getElementById('issue_title')?.value || '';
    const issueBody = document.getElementById('issue_body')?.value || '';
    return {
        title: issueTitle,
        body: issueBody
    };
}

function getSelectedLabels() {
    const labelMenuItems = document.querySelectorAll("#labels-select-menu .js-filterable-issue-labels .select-menu-item");
    let selectedLabels = [];

    for (const menuItem of labelMenuItems) {
        const isSelected = menuItem.getAttribute("aria-checked") === "true";
        const labelName = menuItem.getAttribute("data-prio-filter-value");

        if (isSelected) {
            selectedLabels.push(labelName);
        }
    }

    return selectedLabels;
}

function selectLabel(label) {
    const selectedLabels = getSelectedLabels();
    if (selectedLabels.includes(label)) return;

    const labelMenuItems = document.querySelectorAll("#labels-select-menu .js-filterable-issue-labels .select-menu-item");

    for (const menuItem of labelMenuItems) {
        const labelName = menuItem.getAttribute("data-prio-filter-value");

        if (labelName === label) {
            menuItem.click();
            document.querySelector("#labels-select-menu summary").click()
            document.querySelector("#labels-select-menu summary").click()
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

function createSuggestesLabelsContainer() {
    const suggestedLabelsContainer = document.createElement("div");
    suggestedLabelsContainer.setAttribute("class", "suggested-labels");
    return suggestedLabelsContainer;
}

function createSuggestedLabelItem(label) {
    const item = document.createElement("div");
    item.setAttribute("class", "suggested-labels__item");
    item.innerText = label;
    item.onclick = () => selectLabel(label);
    return item;
}

function setLabels(container, labels) {
    container.innerHTML = "";

    for (const label of labels) {
        const labelItem = createSuggestedLabelItem(label);
        container.appendChild(labelItem);
    }
}

function updateContainer(container, suggested, active) {
    let suggestedNotActive = [];

    for (const label of suggested) {
        if (!active.includes(label)) {
            suggestedNotActive.push(label);
        }
    }

    setLabels(container, suggestedNotActive);
}

function insertContainer(container) {
    const labelsSidebar = document.querySelector('.js-issue-sidebar-form[data-cache-name="labels"]');
    const lastElement = labelsSidebar.children[labelsSidebar.children.length - 1];
    labelsSidebar.insertBefore(container, lastElement);
}

const callback = (mutationsList, observer) => {
    console.log("Something changed");

    const container = document.getElementById("suggested-labels-container");
    if (container) return;

    console.log("Container was deleted!");

    const labelsContainer = createSuggestesLabelsContainer();
    labelsContainer.id = "suggested-labels-container";
    const activeLabel = getSelectedLabels();

    updateContainer(labelsContainer, suggestedLabels, activeLabel);
    insertContainer(labelsContainer);
  };


  const observer = new MutationObserver(callback);
  
  window.addEventListener("load", () => {
      console.log("Page loaded");
      console.log("Setup ...");
      setupInputListeners();
      console.log("Setup ... [ok]");
      
      const labelsContainer = createSuggestesLabelsContainer();
      labelsContainer.id = "suggested-labels-container";
      const activeLabel = getSelectedLabels();

      setLabels(labelsContainer, suggestedLabels);
      updateContainer(labelsContainer, suggestedLabels, activeLabel);
      insertContainer(labelsContainer);

      const labelsSidebar = document.querySelector('#new_issue');
      observer.observe(labelsSidebar, { childList: true, subtree: true });
});
