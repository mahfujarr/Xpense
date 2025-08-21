// Edit Expense Modal
const editModal = document.getElementById("editExpenseModal")
const closeEditBtn = document.getElementById("closeEditExpenseModal")

closeEditBtn.onclick = () => {
  editModal.style.display = "none"
  document.getElementById("editExpenseMsg").innerText = ""
}

// Close modal when clicking outside
window.onclick = (event) => {
  if (event.target === editModal) {
    editModal.style.display = "none"
    document.getElementById("editExpenseMsg").innerText = ""
  }
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

// Function to load existing categories from database
function loadCategories() {
  fetch("/public/get_categories.php")
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        // Populate the category select dropdowns in expense forms
        populateCategorySelects(data.data.map((cat) => cat.name))
      } else {
        console.error("Failed to load categories:", data.error)
      }
    })
    .catch((error) => {
      console.error("Error loading categories:", error)
    })
}

// Function to populate category select dropdowns
function populateCategorySelects(categories) {
  const editExpenseSelect = document.getElementById("editCategory")

  if (editExpenseSelect) {
    editExpenseSelect.innerHTML = '<option value="">Select a category</option>'
    categories.forEach((category) => {
      const option = document.createElement("option")
      option.value = category
      option.textContent = category
      editExpenseSelect.appendChild(option)
    })
  }
}

// Function to update category in select dropdowns
function updateCategoryInSelects(oldName, newName) {
  const editExpenseSelect = document.getElementById("editCategory")

  if (editExpenseSelect) {
    const option = editExpenseSelect.querySelector(`option[value="${oldName}"]`)
    if (option) {
      option.value = newName
      option.textContent = newName
    }
  }
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
  loadCategories() // Load categories to populate select dropdowns
  document
    .getElementById("groupFormat")
    .addEventListener("change", loadExpenseHistory)
})
