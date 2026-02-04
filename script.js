/***********************
 * GLOBAL STATE
 ***********************/
let projects = JSON.parse(localStorage.getItem("projects")) || [];
let currentData = [...projects];
let nameAsc = true;
let taskAsc = true;

const tableBody = document.getElementById("tableBody");
const filter = document.getElementById("statusFilter");

const REQUIRED_HEADERS = [
  "id",
  "project",
  "desc",
  "status",
  "tasks",
  "startDate",
  "endDate"
];
function validateCSVHeaders(headers) {
  return REQUIRED_HEADERS.every(h =>
    headers.includes(h)
  );
}
reader.onload = e => {
  const csvText = e.target.result.trim();
  const rows = csvText.split("\n");
  const headers = rows[0].split(",").map(h => h.trim());

  if (!validateCSVHeaders(headers)) {
    alert("Invalid CSV format. Please upload a valid file.");
    return;
  }

  projects = parseCSV(csvText);
  currentData = [...projects];

  saveToStorage();
  renderTable(currentData);
  updateChart(currentData);
};


/***********************
 * STORAGE
 ***********************/
function saveToStorage() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

/***********************
 * STATUS HELPERS
 ***********************/
function normalizeStatus(status) {
  return status.trim().toLowerCase().replace(/\s+/g, "-");
}

function displayStatus(status) {
  return status.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase());
}

/***-----Profile---******/
function toggleProfile(event) {
  event.stopPropagation(); // prevent body click
  const dropdown = document.getElementById("profileDropdown");

  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}
document.body.addEventListener("click", () => {
  const dropdown = document.getElementById("profileDropdown");
  dropdown.style.display = "none";
});
function openEditModal(event) {
  event.preventDefault();

  const nameText = document.querySelector(
    "#profileDropdown p:nth-child(1)"
  ).innerText.replace("Name:", "").trim();

  const contactText = document.querySelector(
    "#profileDropdown p:nth-child(2)"
  ).innerText.replace("Contact:", "").trim();

  document.getElementById("editName").value = nameText;
  document.getElementById("editMobile").value = contactText;

  document.getElementById("editModal").style.display = "flex";
}
document.getElementById("saveProfile").addEventListener("click", () => {
  const newName = document.getElementById("editName").value.trim();
  const newMobile = document.getElementById("editMobile").value.trim();

  if (!newName || !newMobile) {
    alert("Please fill all fields");
    return;
  }

  const profileInfo = document.querySelectorAll("#profileDropdown p");
  profileInfo[0].innerHTML = `<strong>Name:</strong> ${newName}`;
  profileInfo[1].innerHTML = `<strong>Contact:</strong> ${newMobile}`;

  document.getElementById("editModal").style.display = "none";
});
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("editModal").style.display = "none";
});
function saveProfileToStorage(name, mobile) {
  localStorage.setItem(
    "adminProfile",
    JSON.stringify({ name, mobile })
  );
}

function loadProfileFromStorage() {
  const profile = JSON.parse(localStorage.getItem("adminProfile"));
  if (!profile) return;

  const profileInfo = document.querySelectorAll("#profileDropdown p");
  profileInfo[0].innerHTML = `<strong>Name:</strong> ${profile.name}`;
  profileInfo[1].innerHTML = `<strong>Contact:</strong> ${profile.mobile}`;
}
document.getElementById("logoutBtn").onclick = () => {
  localStorage.clear();
  window.location.href = "login.html";
};


loadProfileFromStorage();



/***********************
 * RENDER TABLE
 ***********************/
function renderTable(data = projects) {
  tableBody.innerHTML = "";

  data.forEach(p => {
    tableBody.innerHTML += `
      <tr class="${p.status}">
        <td>${p.project}</td>
        <td>${p.desc}</td>
        <td>${displayStatus(p.status)}</td>
        <td>${p.tasks}</td>
        <td>${p.startDate}</td>
        <td>${p.endDate}</td>
        <td class="actions">
          <i class="fa fa-eye view" title="View"
             onclick="viewProject(${p.id})"></i>

          <i class="fa fa-pen edit" title="Edit"
             onclick="editProject(${p.id})"></i>

          <i class="fa fa-trash delete" title="Delete"
             onclick="deleteProject(${p.id})"></i>
        </td>
      </tr>
    `;
  });
}


/***********************
 * SORT
 ***********************/
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

/***********************
 * FILTER (FIXED)
 ***********************/
filter.addEventListener("change", e => {
  const value = normalizeStatus(e.target.value);

  currentData =
    value === "all"
      ? [...projects]
      : projects.filter(p => p.status === value);

  renderTable(currentData);
  updateChart(currentData);
});

/***********************
 * SEARCH
 ***********************/
document.getElementById("searchInput").addEventListener("input", e => {
  const text = e.target.value.toLowerCase();

  renderTable(
    currentData.filter(p =>
      p.project.toLowerCase().includes(text)
    )
  );
});
function viewProject(id) {
  const p = projects.find(p => p.id === id);
  if (!p) return;

  alert(
    `Project : ${p.project}
Description : ${p.desc}
Status : ${displayStatus(p.status)}
Tasks : ${p.tasks}
Start Date : ${p.startDate}
End Date : ${p.endDate}`
  );
}
let selectedProjectId = null;
let mode = "add";

function editProject(id) {
  const p = projects.find(p => p.id === id);
  if (!p) return;

  selectedProjectId = id;
  mode = "edit";

  document.getElementById("modalTitle").innerText = "Edit Project";

  document.getElementById("projectName").value = p.project;
  document.getElementById("projectDesc").value = p.desc;
  document.getElementById("projectStatus").value = displayStatus(p.status);
  document.getElementById("projectTasks").value = p.tasks;
  document.getElementById("projectStartDate").value = p.startDate;
  document.getElementById("projectEndDate").value = p.endDate;

  document.getElementById("crudModal").style.display = "flex";
}
function closeModal() {
  document.getElementById("crudModal").style.display = "none";
}


function openAddModal() {
  mode = "add";
  selectedProjectId = null;

  document.getElementById("modalTitle").innerText = "Add Project";

  document.getElementById("projectName").value = "";
  document.getElementById("projectDesc").value = "";
  document.getElementById("projectStatus").value = "Completed";
  document.getElementById("projectTasks").value = "";
  document.getElementById("projectStartDate").value = "";
  document.getElementById("projectEndDate").value = "";

  document.getElementById("crudModal").style.display = "flex";
}


function saveProject() {
  const name = document.getElementById("projectName").value.trim();
  const desc = document.getElementById("projectDesc").value.trim();
  const status = normalizeStatus(
    document.getElementById("projectStatus").value
  );
  const tasks = Number(document.getElementById("projectTasks").value);
  const startDate = document.getElementById("projectStartDate").value;
  const endDate = document.getElementById("projectEndDate").value;

  if (!name || !desc) {
    alert("Please fill all required fields");
    return;
  }

  if (mode === "add") {
    const newProject = {
      id: projects.length
        ? Math.max(...projects.map(p => p.id)) + 1
        : 1,
      project: name,
      desc,
      status,
      tasks,
      startDate,
      endDate
    };

    projects.push(newProject);
  }

  if (mode === "edit") {
    const p = projects.find(p => p.id === selectedProjectId);
    if (!p) return;

    p.project = name;
    p.desc = desc;
    p.status = status;
    p.tasks = tasks;
    p.startDate = startDate;
    p.endDate = endDate;
  }

  

  saveToStorage();
  currentData = [...projects];
  renderTable(currentData);
  updateChart(currentData);
  closeModal();
}

/***********************
 * DELETE
 ***********************/
function deleteProject(id) {
  projects = projects.filter(p => p.id !== id);
  saveToStorage();
  currentData = [...projects];
  renderTable(currentData);
  updateChart(currentData);
}

/***********************
 * CSV UPLOAD
 ***********************/
document.getElementById("csvInput").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = evt => {
    projects = parseCSV(evt.target.result);
    saveToStorage();

    currentData = [...projects];
    renderTable(currentData);
    updateChart(currentData);

    e.target.value = "";
  };

  reader.readAsText(file);
});

/***********************
 * CSV PARSER
 ***********************/
function parseCSV(csv) {
  const lines = csv.trim().split("\n");
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const [
      id,
      project,
      desc,
      status,
      tasks,
      startDate,
      endDate
    ] = lines[i].split(",");

    data.push({
      id: Number(id),
      project: project.trim(),
      desc: desc.trim(),
      status: normalizeStatus(status),
      tasks: Number(tasks),
      startDate: startDate.trim(),
      endDate: endDate.trim()
    });
  }
  return data;
}

/***********************
 * CHART
 ***********************/
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
function downloadCSV() {
  if (!currentData.length) {
    alert("No data available to download");
    return;
  }

  const headers = [
    "id",
    "project",
    "desc",
    "status",
    "tasks",
    "startDate",
    "endDate"
  ];

  let csvContent = headers.join(",") + "\n";

  currentData.forEach(p => {
    csvContent += [
      p.id,
      `"${p.project}"`,
      `"${p.desc}"`,
      displayStatus(p.status),
      p.tasks,
      p.startDate,
      p.endDate
    ].join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "projects.csv";

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/***********************
 * INIT
 ***********************/
renderTable(currentData);
updateChart(currentData);
