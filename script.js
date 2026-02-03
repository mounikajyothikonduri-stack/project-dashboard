let projects = JSON.parse(localStorage.getItem("projects")) ||[
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

let selectedProjectId = null; // Stores the ID of the project being edited
let mode = "add"; // "add" or "edit"
// Save to localStorage
function saveToStorage() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

/* ===== RENDER TABLE ===== */
function renderTable(data = projects) {
  tableBody.innerHTML = "";

  data.forEach(p => {
    tableBody.innerHTML += `
      <tr>
        <td>${p.project}</td>
        <td>${p.desc}</td>
        <td>${p.status}</td>
        <td>${p.tasks}</td>
        <td>${p.startDate || ""}</td>
        <td>${p.endDate || ""}</td>
        <td>
          <i class="fa-solid fa-eye" onclick="viewProject(${p.id})"></i>
          <i class="fa-solid fa-pen" onclick="editProject(${p.id})"></i>
          <i class="fa-solid fa-trash" onclick="deleteProject(${p.id})"></i>
        </td>
      </tr>
    `;
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
  const project = projects.find(p => p.id === id);
  if (!project) return;

  selectedProjectId = id;
  mode = "edit";

  // Fill modal inputs with project data
  document.getElementById("projectName").value = project.project;
  document.getElementById("projectDesc").value = project.desc;
  document.getElementById("projectStatus").value = project.status;
  document.getElementById("projectTasks").value = project.tasks;
  document.getElementById("projectStartDate").value = project.startDate;
  document.getElementById("projectEndDate").value = project.endDate;

  // Set modal title
  document.getElementById("modalTitle").innerText = "Edit Project";

  // Show modal
  document.getElementById("crudModal").style.display = "flex";
}


function deleteProject(id) {
    if (confirm("Delete this project?")) {
        const index = projects.findIndex(p => p.id === id);
        projects.splice(index, 1);
        saveToStorage();
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

/*=== Open Edit Profile ====*/
function openEditModal(event) {
  event.preventDefault(); // stop page refresh

  // Get current profile values
  const nameText = document.querySelector(".profile-dropdown p strong")
    .parentElement.innerText.replace("Name:", "").trim();

  const contactText = document.querySelectorAll(".profile-dropdown p")[1]
    .innerText.replace("Contact:", "").trim();

  // Set values in modal inputs
  document.getElementById("editName").value = nameText;
  document.getElementById("editMobile").value = contactText;

  // Show modal
  document.getElementById("editModal").style.display = "flex";
}
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("editModal").style.display = "none";
});
document.getElementById("saveProfile").addEventListener("click", () => {
  const newName = document.getElementById("editName").value;
  const newMobile = document.getElementById("editMobile").value;

  const profileInfo = document.querySelectorAll(".profile-dropdown p");
  profileInfo[0].innerHTML = `<strong>Name:</strong> ${newName}`;
  profileInfo[1].innerHTML = `<strong>Contact:</strong> ${newMobile}`;

  document.getElementById("editModal").style.display = "none";
});

function saveProject() {
    const name = document.getElementById("projectName").value.trim();
    const desc = document.getElementById("projectDesc").value.trim();
    const status = document.getElementById("projectStatus").value;
      const tasks = document.getElementById("projectTasks").value.trim();
        const startDate= document.getElementById("projectStartDate").value.trim();
    const endDate = document.getElementById("projectEndDate").value;


    if (!name || !desc) {
        alert("Please fill all fields");
        return;
    }

    if (mode === "edit") {
        const project = projects.find(p => p.id === selectedProjectId);
        if (project) {
            project.project = name;
            project.desc = desc;
            project.status = status;
            project.tasks = tasks;
            project.startDate = startDate;
            project.endDate = endDate;
            saveToStorage();

        }
    } else if (mode === "add") {
        const newProject = {
            id: projects.length ? projects[projects.length - 1].id + 1 : 1,
            project: name,
            desc,
            status: status,
            tasks: tasks,
            startDate: startDate,
            endDate: endDate
        };
        projects.push(newProject);
        saveToStorage();

    }

    currentData = [...projects];
    renderTable(currentData);
    updateChart(currentData);

    closeModal(); // close the modal
}

function closeModal() {
    document.getElementById("crudModal").style.display = "none";
}

document.getElementById("addProjectBtn").addEventListener("click", () => {
    mode = "add";
    selectedProjectId = null;

    
    document.getElementById("projectStatus").value = "Pending";

    document.getElementById("crudModal").style.display = "flex";
});

document.getElementById("csvInput").addEventListener("change", e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = evt => {
        projects = parseCSV(evt.target.result);
        renderTable();
    };

    reader.readAsText(file);
});

/* ===== CSV PARSER ===== */
function parseCSV(csv) {
    const lines = csv.split("\n");
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
data.push({
  id: Number(id),
  project: project?.trim(),
  desc: desc?.trim(),
  status: status?.trim(),
  tasks: Number(tasks) || 0,
  startDate: startDate?.replace(/"/g, "").trim(),
  endDate: endDate?.replace(/"/g, "").trim()
});
        
    }
    return data;
}


/* ===== INIT ===== */
renderTable(projects);
updateChart(projects);
