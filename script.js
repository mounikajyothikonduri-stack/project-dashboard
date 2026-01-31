const projects = [
    {
        id: 1,
        project: "Project A",
        desc: "Website redesign",
        status: "Completed",
        tasks: 25,
        startDate: "2024-01-10",
        endDate: "2024-03-20"
    },
    {
        id: 2,
        project: "Project B",
        desc: "Mobile app development",
        status: "In Progress",
        tasks: 15,
        startDate: "2024-02-05",
        endDate: "2024-05-30"
    },
    {
        id: 3,
        project: "Project C",
        desc: "CRM integration",
        status: "Pending",
        tasks: 30,
        startDate: "2024-04-01",
        endDate: "2024-07-15"
    }
];

let currentData = [...projects];
let nameAsc = true;
let taskAsc = true;

/* ===== RENDER TABLE ===== */
function renderTable(data) {
    const body = document.getElementById("tableBody");
    body.innerHTML = "";

    data.forEach(p => {
        const row = document.createElement("tr");
        row.className = p.status.toLowerCase().replace(" ", "-");

        row.innerHTML = `
            <td>${p.project}</td>
            <td>${p.desc}</td>
            <td>${p.status}</td>
            <td>${p.tasks}</td>
            <td>${p.startDate}</td>
            <td>${p.endDate}</td>
            <td class="actions">
                <i class="fa-solid fa-eye view" onclick="viewProject(${p.id})"></i>
                <i class="fa-solid fa-pen edit" onclick="editProject(${p.id})"></i>
                <i class="fa-solid fa-trash delete" onclick="deleteProject(${p.id})"></i>
            </td>
        `;
        body.appendChild(row);
    });
}

/* ===== SORT ===== */
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

/* ===== FILTER ===== */
document.getElementById("statusFilter").addEventListener("change", e => {
    const value = e.target.value;
    currentData = value === "All" ? [...projects] : projects.filter(p => p.status === value);
    renderTable(currentData);
    updateChart(currentData);
});

/* ===== SEARCH ===== */
document.getElementById("searchInput").addEventListener("input", e => {
    const text = e.target.value.toLowerCase();
    renderTable(currentData.filter(p => p.project.toLowerCase().includes(text)));
});

/* ===== CRUD ===== */
function viewProject(id) {
    const p = projects.find(x => x.id === id);
    alert(`${p.project}\n${p.desc}\nStatus: ${p.status}`);
}

function editProject(id) {
    alert("Edit project ID: " + id);
}

function deleteProject(id) {
    if (confirm("Delete this project?")) {
        const index = projects.findIndex(p => p.id === id);
        projects.splice(index, 1);
        currentData = [...projects];
        renderTable(currentData);
        updateChart(currentData);
    }
}

/* ===== PROFILE ===== */
function toggleProfile(e) {
    e.stopPropagation();
    const dropdown = document.getElementById("profileDropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

document.body.addEventListener("click", () => {
    document.getElementById("profileDropdown").style.display = "none";
});
/*====logout =====*/
document.getElementById("logout_btn").addEventListener("click", function () {

    window.location.href = "login.html";
});

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        window.location.href = "login.html";
    }
}
/* ===== CHART ===== */
let chart;
function updateChart(data) {
    const ctx = document.getElementById("taskChart");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: data.map(p => p.project),
            datasets: [{
                label: "Tasks",
                data: data.map(p => p.tasks)
            }]
        }
    });
}

/* ===== INIT ===== */
renderTable(projects);
updateChart(projects);
