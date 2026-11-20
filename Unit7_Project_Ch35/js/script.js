"use strict";
const cases = [
    { name: "Wrong selector", type: "Elements / Console", description: "A button is present, but the script looks for a different ID.", hint: "Inspect the button ID in Elements.", code: 'document.getElementById("send-btn").textContent = "Sent";', error: "TypeError: Cannot set properties of null", fix: 'document.getElementById("send-button").textContent = "Sent";' },
    { name: "Missing element", type: "Elements / Console", description: "An update tries to access an element that has not been added to the page.", hint: "Check the HTML before editing the JavaScript.", code: 'document.getElementById("status-message").textContent = "Ready";', error: "TypeError: Cannot set properties of null", fix: 'Add <p id="status-message"></p> to the HTML first.' },
    { name: "Undefined variable", type: "Console / Sources", description: "A calculation uses a misspelled variable name.", hint: "Compare variable names, including capitalization.", code: 'const totalPrice = 25;\nconsole.log(totalprice * 2);', error: "ReferenceError: totalprice is not defined", fix: 'const totalPrice = 25;\nconsole.log(totalPrice * 2);' },
    { name: "Broken CSS rule", type: "Elements / Styles", description: "A heading should be green but its style declaration has a typo.", hint: "Inspect computed styles on the heading.", code: '.heading { colr: green; }', error: "No JavaScript error: CSS ignores unknown 'colr' property.", fix: '.heading { color: green; }' },
    { name: "Incorrect file path", type: "Network / Console", description: "The browser cannot find a referenced JavaScript file.", hint: "Open Network and check the request path.", code: '<script src="scripts/main.js"></script>', error: "Failed to load resource: 404 Not Found (if the path is wrong on a server)", fix: '<script src="js/script.js"></script>' }
];
let selected = 0;
const caseButtons = document.getElementById("case-buttons");
let reports = [];
try {
    const stored = JSON.parse(localStorage.getItem("debug-bureau-reports"));
    if (Array.isArray(stored)) reports = stored;
} catch (error) { console.log("Could not load reports."); }

cases.forEach(function (item, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Case " + (index + 1);
    button.addEventListener("click", function () { selected = index; displayCase(); });
    caseButtons.appendChild(button);
});
function displayCase() {
    const item = cases[selected];
    document.getElementById("case-type").textContent = item.type;
    document.getElementById("case-name").textContent = item.name;
    document.getElementById("case-description").textContent = item.description;
    document.getElementById("case-hint").textContent = "Investigation hint: " + item.hint;
    document.getElementById("case-code").textContent = item.code;
    document.getElementById("case-fix").textContent = item.fix;
    document.getElementById("case-fix").hidden = true;
    document.getElementById("test-result").textContent = "";
    document.querySelectorAll("#case-buttons button").forEach(function (button, index) { button.classList.toggle("active", index === selected); });
}
document.getElementById("run-test").addEventListener("click", function () {
    const item = cases[selected];
    console.error("Case " + (selected + 1) + ": " + item.error);
    document.getElementById("test-result").textContent = "Example issue logged. Open F12 → Console and inspect the message.";
});
document.getElementById("reveal").addEventListener("click", function () {
    document.getElementById("case-fix").hidden = false;
});
function displayReports() {
    const list = document.getElementById("report-list");
    list.innerHTML = "";
    if (reports.length === 0) { list.textContent = "No reports saved yet."; return; }
    reports.forEach(function (report, index) {
        const box = document.createElement("div"); box.className = "tile";
        const title = document.createElement("h3"); title.textContent = report.caseName; box.appendChild(title);
        ["What happened: "+report.happened,"Console: "+report.console,"Cause: "+report.cause,"Fix: "+report.fix].forEach(function (line) {
            const paragraph = document.createElement("p"); paragraph.textContent = line; box.appendChild(paragraph);
        });
        const remove = document.createElement("button"); remove.textContent = "Delete report";
        remove.addEventListener("click", function () { reports.splice(index,1); saveReports(); });
        box.appendChild(remove); list.appendChild(box);
    });
}
function saveReports() { localStorage.setItem("debug-bureau-reports",JSON.stringify(reports)); displayReports(); }
document.getElementById("report-form").addEventListener("submit", function (event) {
    event.preventDefault();
    reports.push({ caseName: cases[selected].name, happened: document.getElementById("report-happened").value.trim(), console: document.getElementById("report-console").value.trim(), cause: document.getElementById("report-cause").value.trim(), fix: document.getElementById("report-fix").value.trim() });
    saveReports();
    event.target.reset();
    document.getElementById("report-message").textContent = "Case report saved.";
});
document.getElementById("clear-reports").addEventListener("click", function () { if (confirm("Delete all reports?")) { reports = []; saveReports(); } });
displayCase(); displayReports();
