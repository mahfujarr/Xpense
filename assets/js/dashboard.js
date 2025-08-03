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
      // Ensure exp.id is a valid number
      entry.innerHTML = `
        <div>
          <strong>${exp.category}</strong> — ৳${parseFloat(exp.amount).toFixed(
        2
      )} on ${exp.expense_date}<br>
          <em>${exp.description || "No description"}</em>
        </div>
        <button class="delete-btn" data-id="${
          exp.id !== undefined ? exp.id : ""
        }">🗑️</button>
      `
      container.appendChild(entry)
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
        }).then((response) => {
          if (response.ok) {
            // Fade out the deleted item
            const entry = this.parentElement
            entry.style.transition = "opacity 0.5s ease-out"
            entry.style.opacity = 0
            setTimeout(() => entry.remove(), 500)
          } else {
            alert("Failed to delete expense.")
          }
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
