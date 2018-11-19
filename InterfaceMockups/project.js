$(document).ready(function (){
    loadList();
    loadProjects();
});
displayed = null;
projects = [];
function loadList(){
        $.getJSON("projects.json", function (data) {
        $.each( data, function( key, val ) {
            let node = document.createElement("li");
            let button = document.createElement("button");

            let info = document.createTextNode(val);
            button.appendChild(info);
            button.addEventListener("click", ()=>{buttonPress(val)}, button);
            node.appendChild(button);
            document.getElementById("projects").appendChild(node);
        });
    });
}
function loadProjects() {
    $.getJSON("projectInfo.json", function (data) {
        $.each( data, function( key, val ) {
            projects.push(val);

        });
    });
}

function buttonPress(value) {
    for(i in projects){
        if(projects[i].name == value){
            displayed = projects[i];
        }
    }
    displayInformation();
}

function displayInformation(){
    let mainDiv = document.createElement("div");

    // Project name
    let title = document.createElement("h1");
    let edit = document.createElement("i");
    edit.classList.add("fa");
    edit.classList.add("fa-edit");
    edit.addEventListener("click", ()=>{editInformation()});
    title.appendChild(document.createTextNode(displayed.name + " "));
    title.appendChild(edit);
    mainDiv.appendChild(title);

    // Client
    let client = document.createElement("h2");
    client.appendChild(document.createTextNode(displayed.client));
    mainDiv.appendChild(client);

    // Project Id
    let pid = document.createElement("h3");
    pid.appendChild(document.createTextNode(displayed.projectId));
    mainDiv.appendChild(pid);

    // Manager
    let manager = document.createElement("h3");
    manager.appendChild(document.createTextNode("Project Manager: " + displayed.projectManager));
    mainDiv.appendChild(manager);

    // Budget
    let budget = document.createElement("div");
    budget.appendChild(document.createTextNode("Budget: $" + parseFloat(displayed.budget * 100 / 100).toFixed(2)));
    mainDiv.appendChild(budget);

    // Expenses
    let expenses = document.createElement("div");
    let list = document.createElement("table");
    let head = document.createElement("tr");
    let descTitle = document.createElement("th");
    descTitle.appendChild(document.createTextNode("Expense"));
    head.appendChild(descTitle);
    let valueTitle = document.createElement("th");
    valueTitle.appendChild(document.createTextNode("Value"));
    head.appendChild(valueTitle);
    list.appendChild(head);
    for(i in displayed.expenses){
        let row = document.createElement("tr");
        let desc = document.createElement("td");
        desc.appendChild(document.createTextNode(displayed.expenses[i].description));
        row.appendChild(desc);
        let val = document.createElement("td");
        val.appendChild(document.createTextNode("$" + parseFloat(displayed.expenses[i].value * 100 / 100).toFixed(2)));
        row.appendChild(val);
        list.appendChild(row);
    }
    expenses.appendChild(list);
    mainDiv.appendChild(expenses);

    // Expense Button
    let expenseButton = document.createElement("button");
    expenseButton.appendChild(document.createTextNode("Add Expense"));
    mainDiv.appendChild(expenseButton);

    mainDiv.setAttribute("id", "contentPane");
    document.getElementById("infoPane").removeChild(document.getElementById("contentPane"));
    document.getElementById("infoPane").appendChild(mainDiv);


    let teamDiv = document.createElement("div");
    let teamTitle = document.createElement("h2");
    teamTitle.appendChild(document.createTextNode("Team"));
    teamDiv.appendChild(document.createElement("br"));
    teamDiv.appendChild(document.createElement("br"));
    teamDiv.appendChild(teamTitle);

    let teamTable = document.createElement("table");
    let teamHead = document.createElement("tr");
    let teamHeadData = document.createElement("th");
    teamHeadData.appendChild(document.createTextNode("Team Member"));
    teamHead.appendChild(teamHeadData);
    teamTable.appendChild(teamHead);

    for (i in displayed.teamMembers){
        let row = document.createElement("tr");
        let td = document.createElement("td");
        td.appendChild(document.createTextNode(displayed.teamMembers[i]));
        row.appendChild(td);
        teamTable.appendChild(row);
    }

    teamDiv.appendChild(teamTable);

    // Add team Member button
    let teamButton = document.createElement("button");
    teamButton.appendChild(document.createTextNode("Add team Member"));
    teamDiv.appendChild(teamButton);
    teamDiv.setAttribute("id", "teamPane");
    document.getElementById("infoPane").removeChild(document.getElementById("teamPane"));
    document.getElementById("infoPane").appendChild(teamDiv);

}

function editInformation(){
    let mainDiv = document.createElement("div");
    let form = document.createElement("form");
    form.setAttribute("action", "none");

    // Project name
    let titleInput = document.createElement("input");
    titleInput.setAttribute("name", "projectName");
    titleInput.setAttribute("value", displayed.name);
    titleInput.classList.add("h1Input");
    form.appendChild(titleInput);
    form.appendChild(document.createElement("br"));

    // Client
    let clientInput = document.createElement("input");
    clientInput.setAttribute("name", "clientName");
    clientInput.setAttribute("value", displayed.client);
    clientInput.classList.add("h2Input");
    form.appendChild(clientInput);

    // Project Id
    let pid = document.createElement("h3");
    pid.appendChild(document.createTextNode(displayed.projectId));
    form.appendChild(pid);

    // Manager
    let manager = document.createElement("input");
    manager.setAttribute("value", displayed.projectManager);
    manager.classList.add("h3Input");
    form.appendChild(manager);

    // Budget
    let budget = document.createElement("div");
    budget.appendChild(document.createTextNode("Budget: $"));
    let budgetInput = document.createElement("input");
    budgetInput.setAttribute("value",parseFloat(displayed.budget * 100 / 100).toFixed(2));
    budget.appendChild(budgetInput);
    form.appendChild(budget);

    // Expenses
    let expenses = document.createElement("div");
    let list = document.createElement("table");
    let head = document.createElement("tr");
    let descTitle = document.createElement("th");
    descTitle.appendChild(document.createTextNode("Expense"));
    head.appendChild(descTitle);
    let valueTitle = document.createElement("th");
    valueTitle.appendChild(document.createTextNode("Value"));
    head.appendChild(valueTitle);
    list.appendChild(head);

    mainDiv.appendChild(form);

    for(i in displayed.expenses){
        let row = document.createElement("tr");
        let desc = document.createElement("td");
        desc.appendChild(document.createTextNode(displayed.expenses[i].description));
        row.appendChild(desc);
        let val = document.createElement("td");
        val.appendChild(document.createTextNode("$" + parseFloat(displayed.expenses[i].value * 100 / 100).toFixed(2)));
        row.appendChild(val);
        list.appendChild(row);
    }
    expenses.appendChild(list);
    mainDiv.appendChild(expenses);

    // Expense Button
    let expenseButton = document.createElement("button");
    expenseButton.appendChild(document.createTextNode("Add Expense"));
    mainDiv.appendChild(expenseButton);

    mainDiv.setAttribute("id", "contentPane");
    document.getElementById("infoPane").removeChild(document.getElementById("contentPane"));
    document.getElementById("infoPane").appendChild(mainDiv);


    let teamDiv = document.createElement("div");
    let teamTitle = document.createElement("h2");
    teamTitle.appendChild(document.createTextNode("Team"));
    teamDiv.appendChild(document.createElement("br"));
    teamDiv.appendChild(document.createElement("br"));
    teamDiv.appendChild(teamTitle);


    let teamTable = document.createElement("table");
    let teamHead = document.createElement("tr");
    let teamHeadData = document.createElement("th");
    teamHeadData.appendChild(document.createTextNode("Team Member"));
    teamHead.appendChild(teamHeadData);
    teamTable.appendChild(teamHead);

    for (i in displayed.teamMembers){
        let row = document.createElement("tr");
        let td = document.createElement("td");
        td.appendChild(document.createTextNode(displayed.teamMembers[i]));
        row.appendChild(td);
        teamTable.appendChild(row);
    }

    teamDiv.appendChild(teamTable);

    // Add team Member button
    let teamButton = document.createElement("button");
    teamButton.appendChild(document.createTextNode("Add team Member"));
    teamDiv.appendChild(teamButton);
    teamDiv.setAttribute("id", "teamPane");
    document.getElementById("infoPane").removeChild(document.getElementById("teamPane"));
    document.getElementById("infoPane").appendChild(teamDiv);

}

function hideMenu(){
    document.getElementById("visibleMenu").classList.add("hidden");
    document.getElementById("hiddenMenu").classList.remove("hidden");
    document.getElementById("infoPane").classList.add("middleBig");
    document.getElementById("infoPane").classList.remove("middle");
}

function showMenu(){
    document.getElementById("visibleMenu").classList.remove("hidden");
    document.getElementById("hiddenMenu").classList.add("hidden");
    document.getElementById("infoPane").classList.remove("middleBig");
    document.getElementById("infoPane").classList.add("middle");
}