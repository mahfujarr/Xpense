//Add expense Modal
const openBtn = document.getElementById("openAddExpenseModal")
const modal = document.getElementById("addExpenseModal")
const closeBtn = document.getElementById("closeAddExpenseModal")

function setTodayDate() {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, "0")
  const dd = String(today.getDate()).padStart(2, "0")
  const formattedDate = `${yyyy}-${mm}-${dd}`
  document.getElementById("date").value = formattedDate
}

openBtn.onclick = () => {
  modal.style.display = "block"
  setTodayDate()
}
closeBtn.onclick = () => {
  modal.style.display = "none"
  // document.getElementById("expenseMsg").innerText = ""
}
window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none"
    document.getElementById("expenseMsg").innerText = ""
  }
  //edit Modal
  if (event.target === editModal) {
    editModal.style.display = "none"
    document.getElementById("editExpenseMsg").innerText = ""
  }
  //category Modal
  if (event.target === categoryModal) {
    categoryModal.style.display = "none"
  }
}

// AJAX form submission
document.getElementById("addExpenseForm").onsubmit = function (e) {
  e.preventDefault()
  const formData = new FormData(this)
  fetch("/public/add_expense.php", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      const msg = document.getElementById("expenseMsg")
      if (data.success) {
        msg.style.color = "green"
        msg.innerText = "Expense added successfully!"
        loadExpenseHistory()
        setTimeout(() => {
          this.reset()
          msg.innerText = ""
          modal.style.display = "none"
        }, 2000)
      } else {
        msg.style.color = "red"
        msg.innerText = data.error || "Failed to add expense."
      }
    })
    .catch(() => {
      const msg = document.getElementById("expenseMsg")
      msg.style.color = "red"
      msg.innerText = "An error occurred."
    })
}

// AJAX form submission for edit expense
document.getElementById("editExpenseForm").onsubmit = function (e) {
  e.preventDefault()
  const formData = new FormData(this)
  fetch("/public/edit_expense.php", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      const msg = document.getElementById("editExpenseMsg")
      if (data.success) {
        msg.style.color = "green"
        msg.innerText = "Expense updated successfully!"
        loadExpenseHistory()
        setTimeout(() => {
          msg.innerText = ""
          editModal.style.display = "none"
        }, 2000)
      } else {
        msg.style.color = "red"
        msg.innerText = data.error || "Failed to update expense."
      }
    })
    .catch(() => {
      const msg = document.getElementById("editExpenseMsg")
      msg.style.color = "red"
      msg.innerText = "An error occurred."
    })
}

// Edit Expense Modal
const editModal = document.getElementById("editExpenseModal")
const closeEditBtn = document.getElementById("closeEditExpenseModal")

closeEditBtn.onclick = () => {
  editModal.style.display = "none"
  document.getElementById("editExpenseMsg").innerText = ""
}

// Manage Categories Modal
const openCategoryBtn = document.getElementById("openManageCategoriesModal")
const categoryModal = document.getElementById("manageCategoriesModal")
const closeCategoryBtn = document.getElementById("closeManageCategoriesModal")
openCategoryBtn.onclick = () => {
  categoryModal.style.display = "block"
}
closeCategoryBtn.onclick = () => {
  categoryModal.style.display = "none"
}

// Expense history
function groupByDay(expenses) {
  const grouped = {}
  let total = 0

  expenses.forEach((exp) => {
    const dateKey = new Date(exp.expense_date).toLocaleDateString("default", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    if (!grouped[dateKey]) grouped[dateKey] = []
    grouped[dateKey].push(exp)
    total += parseFloat(exp.amount)
  })

  return { grouped, total }
}

function groupByMonth(expenses) {
  const grouped = {}
  let total = 0

  expenses.forEach((exp) => {
    const monthKey = new Date(exp.expense_date).toLocaleString("default", {
      month: "long",
      year: "numeric",
    })
    if (!grouped[monthKey]) grouped[monthKey] = []
    grouped[monthKey].push(exp)
    total += parseFloat(exp.amount)
  })

  return { grouped, total }
}

function renderExpenseHistory(data) {
  const container = document.getElementById("expenseGroupedList")
  container.innerHTML = ""

  Object.entries(data.grouped).forEach(([month, entries]) => {
    const monthTitle = document.createElement("h3")
    monthTitle.className = "expense-month"
    monthTitle.innerText = month
    container.appendChild(monthTitle)

    entries.forEach((exp) => {
      const entry = document.createElement("div")
      entry.className = "expense-entry"

      entry.innerHTML = `
        <div>
          <strong>${exp.category}</strong> — ৳${parseFloat(exp.amount).toFixed(
        2
      )} on ${exp.expense_date}<br>
          <em>${exp.description || "No description"}</em>
        </div>
        <div class="expense-actions">
          <button class="edit-btn" data-id="${
            exp.id !== undefined ? exp.id : ""
          }" data-amount="${exp.amount}" data-category="${
        exp.category
      }" data-date="${exp.expense_date}" data-description="${
        exp.description || ""
      }">✏️</button>
          <button class="delete-btn" data-id="${
            exp.id !== undefined ? exp.id : ""
          }">🗑️</button>
        </div>
      `
      container.appendChild(entry)
    })
  })

  // Add event listeners for edit buttons
  container.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const expenseId = this.getAttribute("data-id")
      const amount = this.getAttribute("data-amount")
      const category = this.getAttribute("data-category")
      const date = this.getAttribute("data-date")
      const description = this.getAttribute("data-description")

      // Defensive: check for valid id
      if (!expenseId || isNaN(expenseId)) {
        alert("Invalid expense ID. Cannot edit.")
        return
      }

      // Populate the edit modal with current values
      document.getElementById("editExpenseId").value = expenseId
      document.getElementById("editAmount").value = amount
      document.getElementById("editCategory").value = category
      document.getElementById("editDate").value = date
      document.getElementById("editDescription").value = description

      // Show the edit modal
      document.getElementById("editExpenseModal").style.display = "block"
    })
  })

  container.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const expenseId = this.getAttribute("data-id")
      // Defensive: check for valid id before sending request
      if (!expenseId || isNaN(expenseId)) {
        alert("Invalid expense ID. Cannot delete.")
        return
      }
      if (confirm("Delete this expense?")) {
        fetch("/public/delete_expense.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `id=${encodeURIComponent(expenseId)}`,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              // Fade out the deleted item
              const entry = this.parentElement.parentElement
              entry.style.transition = "opacity 0.5s ease-out"
              entry.style.opacity = 0
              setTimeout(() => entry.remove(), 500)
            } else {
              alert(
                `Failed to delete expense: ${data.error || "Unknown error"}`
              )
            }
          })
          .catch((error) => {
            console.error("Delete error:", error)
            alert("Network error occurred while deleting expense.")
          })
      }
    })
  })
}

function loadExpenseHistory() {
  fetch("/public/get_expenses.php")
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        const format = document.getElementById("groupFormat").value
        const groupedData =
          format === "day" ? groupByDay(data.data) : groupByMonth(data.data)
        renderExpenseHistory(groupedData)
      } else {
        document.getElementById("expenseGroupedList").innerHTML = `<p>${
          data.error || "Failed to load expenses."
        }</p>`
      }
    })
}

document.addEventListener("DOMContentLoaded", () => {
  loadExpenseHistory()
  document
    .getElementById("groupFormat")
    .addEventListener("change", loadExpenseHistory)
})
