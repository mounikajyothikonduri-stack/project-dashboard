function generatePayslip() {

  // ===== Read Text Fields =====
  const companyName = document.getElementById("companyName").value.trim();
  const companyAddress = document.getElementById("companyAddress").value.trim();
  const employeeName = document.getElementById("employeeName").value.trim();
  const employeeId = document.getElementById("employeeId").value.trim();
  const department = document.getElementById("department").value.trim();
  const designation = document.getElementById("designation").value.trim();
  const joiningDate = document.getElementById("joiningDate").value;
  const payMonth = document.getElementById("payMonth").value;

  // ===== Mandatory Validation =====
  if (
    !companyName || !companyAddress || !employeeName || !employeeId ||
    !department || !designation || !joiningDate || !payMonth
  ) {
    alert("All fields are mandatory");
    return;
  }

  // ===== Employee ID Validation =====
  const empIdRegex = /^[a-zA-Z0-9]+$/;
  if (!empIdRegex.test(employeeId)) {
    alert("Employee ID must be alphanumeric");
    return;
  }

  // ===== Date Validation =====
  if (new Date(joiningDate) > new Date()) {
    alert("Date of joining cannot be in the future");
    return;
  }

  // ===== Earnings =====
  const basic = Number(document.getElementById("basic").value) || 0;
  const hra = Number(document.getElementById("hra").value) || 0;
  const special = Number(document.getElementById("special").value) || 0;
  const conveyance = Number(document.getElementById("conveyance").value) || 0;
  const otherAllowance = Number(document.getElementById("otherAllowance").value) || 0;

  // ===== Deductions =====
  const pf = Number(document.getElementById("pf").value) || 0;
  const pt = Number(document.getElementById("pt").value) || 0;
  const tax = Number(document.getElementById("tax").value) || 0;
  const otherDeduction = Number(document.getElementById("otherDeduction").value) || 0;

  // ===== Negative Validation =====
  if (
    basic < 0 || hra < 0 || special < 0 || conveyance < 0 || otherAllowance < 0 ||
    pf < 0 || pt < 0 || tax < 0 || otherDeduction < 0
  ) {
    alert("Values cannot be negative");
    return;
  }

  // ===== Calculations =====
  const totalEarnings = basic + hra + special + conveyance + otherAllowance;
  const totalDeductions = pf + pt + tax + otherDeduction;

  if (totalDeductions > totalEarnings) {
    alert("Deductions cannot exceed earnings");
    return;
  }

  const netSalary = totalEarnings - totalDeductions;

  // ===== Analytics =====
  const deductionPercent = ((totalDeductions / totalEarnings) * 100).toFixed(2);
  const netSalaryPercent = ((netSalary / totalEarnings) * 100).toFixed(2);

  // ===== Output =====
  document.getElementById("payslipOutput").innerHTML = `
    <h2>${companyName}</h2>
    <p>${companyAddress}</p>
    <hr>

    <p><strong>Employee:</strong> ${employeeName} (${employeeId})</p>
    <p><strong>Department:</strong> ${department}</p>
    <p><strong>Designation:</strong> ${designation}</p>
    <p><strong>Pay Month:</strong> ${payMonth}</p>

    <table>
      <tr>
        <th>Earnings</th><th>₹</th>
        <th>Deductions</th><th>₹</th>
      </tr>
      <tr><td>Basic</td><td>${basic}</td><td>PF</td><td>${pf}</td></tr>
      <tr><td>HRA</td><td>${hra}</td><td>PT</td><td>${pt}</td></tr>
      <tr><td>Special</td><td>${special}</td><td>Tax</td><td>${tax}</td></tr>
      <tr><td>Conveyance</td><td>${conveyance}</td><td>Other</td><td>${otherDeduction}</td></tr>
      <tr><td>Other</td><td>${otherAllowance}</td><td></td><td></td></tr>
      <tr>
        <th>Total</th><th>${totalEarnings}</th>
        <th>Total</th><th>${totalDeductions}</th>
      </tr>
    </table>

    <div class="net-salary">
      Net Salary: ₹ ${netSalary}
    </div>

    <p><strong>Deduction %:</strong> ${deductionPercent}%</p>
    <p><strong>Net Salary %:</strong> ${netSalaryPercent}%</p>
  `;
}
