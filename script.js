// ===== MOCK API DATA =====
const projects = [
    { id: 1, project: "Project A", status: "Completed", tasks: 25 },
    { id: 2, project: "Project B", status: "In Progress", tasks: 15 },
    { id: 3, project: "Project C", status: "Pending", tasks: 30 }
];

let currentData = [...projects];
let nameAsc = true;
let taskAsc = true;

// ===== RENDER TABLE =====
function renderTable(data) {
    const body = document.getElementById("tableBody");
    body.innerHTML = "";

    data.forEach(p => {
        const row = document.createElement("tr");
        row.className = p.status.toLowerCase().replace(" ", "-");

        row.innerHTML = `
            <td>${p.project}</td>
            <td>${p.status}</td>
            <td>${p.tasks}</td>
        `;

        body.appendChild(row);
    });
}

// ===== SORTING =====
function sortByName() {
    currentData.sort((a, b) =>
        nameAsc ? a.project.localeCompare(b.project) : b.project.localeCompare(a.project)
    );
    nameAsc = !nameAsc;
    renderTable(currentData);
}

function sortByTasks() {
    currentData.sort((a, b) =>
        taskAsc ? a.tasks - b.tasks : b.tasks - a.tasks
    );
    taskAsc = !taskAsc;
    renderTable(currentData);
}

// ===== FILTER =====
document.getElementById("statusFilter").addEventListener("change", e => {
    const value = e.target.value;
    currentData = value === "All"
        ? [...projects]
        : projects.filter(p => p.status === value);

    renderTable(currentData);
    updateChart(currentData);
});

// ===== SEARCH =====
document.getElementById("searchInput").addEventListener("input", e => {
    const text = e.target.value.toLowerCase();
    const filtered = currentData.filter(p =>
        p.project.toLowerCase().includes(text)
    );
    renderTable(filtered);
});

// ===== CHART =====
let chart;
function updateChart(data) {
    const ctx = document.getElementById("taskChart");
    const labels = data.map(p => p.project);
    const values = data.map(p => p.tasks);

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Number of Tasks",
                data: values
            }]
        }
    });
}

// ===== INIT =====
renderTable(projects);
updateChart(projects);
