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
        loadFinancialStatistics() // Refresh statistics and charts
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
  loadCategories() // Load existing categories when modal opens
}

closeCategoryBtn.onclick = () => {
  categoryModal.style.display = "none"
  document.getElementById("categoryMsg").innerText = ""
  document.getElementById("addCategoryForm").reset()
}

// Add Category Form Submission
document.getElementById("addCategoryForm").onsubmit = function (e) {
  e.preventDefault()
  const formData = new FormData()
  formData.append("name", document.getElementById("newCategory").value.trim())

  fetch("/public/add_category.php", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      const msg = document.getElementById("categoryMsg")
      if (data.success) {
        msg.style.color = "green"
        msg.innerText = data.message
        this.reset()
        loadCategories() // Reload categories from database
        setTimeout(() => {
          msg.innerText = ""
        }, 2000)
      } else {
        msg.style.color = "red"
        msg.innerText = data.error || "Failed to add category."
      }
    })
    .catch(() => {
      const msg = document.getElementById("categoryMsg")
      msg.style.color = "red"
      msg.innerText = "An error occurred."
    })
}

// Function to add category to the list
function addCategoryToList(categoryName, categoryId = null) {
  const categoryList = document.getElementById("categoryList")
  const li = document.createElement("li")

  // Set data-id attribute for database operations
  if (categoryId) {
    li.setAttribute("data-id", categoryId)
  }

  li.innerHTML = `
    <span class="category-name">${categoryName}</span>
    <div class="category-actions">
      <button class="edit-category" onclick="editCategory(this)">✏️</button>
      <button class="delete-category" onclick="deleteCategory(this)">🗑️</button>
    </div>
  `

  categoryList.appendChild(li)

  // Remove any empty state classes
  categoryList.classList.remove("no-categories")

  // Also add to the expense form select dropdowns
  addCategoryToSelects(categoryName, categoryId)
}

// Function to add category to select dropdowns
function addCategoryToSelects(categoryName, categoryId) {
  const addExpenseSelect = document.getElementById("category")

  if (addExpenseSelect) {
    const option = document.createElement("option")
    option.value = categoryId
    option.textContent = categoryName
    addExpenseSelect.appendChild(option)
  }
}

// Function to edit category
function editCategory(button) {
  const li = button.parentElement.parentElement
  const categoryName = li.querySelector(".category-name")
  const currentName = categoryName.textContent
  const categoryId = li.getAttribute("data-id")

  const newName = prompt("Edit category name:", currentName)
  if (newName && newName.trim() && newName.trim() !== currentName) {
    // Send update request to database
    const formData = new FormData()
    formData.append("id", categoryId)
    formData.append("name", newName.trim())

    fetch("/public/edit_category.php", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          categoryName.textContent = newName.trim()
          // Also update the select dropdowns
          updateCategoryInSelects(categoryId, newName.trim())
        } else {
          alert("Failed to update category: " + (data.error || "Unknown error"))
        }
      })
      .catch(() => {
        alert("An error occurred while updating the category.")
      })
  }
}

// Function to update category in select dropdowns
function updateCategoryInSelects(categoryId, newName) {
  const addExpenseSelect = document.getElementById("category")

  if (addExpenseSelect) {
    const option = addExpenseSelect.querySelector(`option[value="${categoryId}"]`)
    if (option) {
      option.textContent = newName
    }
  }
}

// Function to delete category
function deleteCategory(button) {
  if (confirm("Are you sure you want to delete this category?")) {
    const li = button.parentElement.parentElement
    const categoryId = li.getAttribute("data-id")
    const categoryName = li.querySelector(".category-name").textContent

    // Send delete request to database
    const formData = new FormData()
    formData.append("id", categoryId)

    fetch("/public/delete_category.php", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          li.style.transition = "opacity 0.3s ease-out"
          li.style.opacity = "0"
          setTimeout(() => {
            li.remove()
            // Also remove from the select dropdowns
            removeCategoryFromSelects(categoryId)
          }, 300)
        } else {
          alert("Failed to delete category: " + (data.error || "Unknown error"))
        }
      })
      .catch(() => {
        alert("An error occurred while deleting the category.")
      })
  }
}

// Function to remove category from select dropdowns
function removeCategoryFromSelects(categoryId) {
  const addExpenseSelect = document.getElementById("category")

  if (addExpenseSelect) {
    const option = addExpenseSelect.querySelector(
      `option[value="${categoryId}"]`
    )
    if (option) {
      option.remove()
    }
  }
}

// Function to load existing categories from database
function loadCategories() {
  const categoryList = document.getElementById("categoryList")

  // Show loading state
  categoryList.innerHTML = ""
  categoryList.classList.add("loading")

  fetch("/public/get_categories.php")
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        // Clear loading state
        categoryList.classList.remove("loading")

        if (data.data.length === 0) {
          categoryList.classList.add("no-categories")
        } else {
          // Add categories to the list
          data.data.forEach((category) => {
            addCategoryToList(category.name, category.id)
          })

          // Also populate the category select dropdowns in expense forms
          populateCategorySelects(data.data)
        }
      } else {
        console.error("Failed to load categories:", data.error)
        categoryList.classList.remove("loading")
        categoryList.classList.add("no-categories")
      }
    })
    .catch((error) => {
      console.error("Error loading categories:", error)
      categoryList.classList.remove("loading")
      categoryList.classList.add("no-categories")
    })
}

// Function to populate category select dropdowns
function populateCategorySelects(categories) {
  const addExpenseSelect = document.getElementById("category")

  // Clear existing options (except the first placeholder)
  if (addExpenseSelect) {
    addExpenseSelect.innerHTML = '<option value="">Select a category</option>'
    categories.forEach((category) => {
      const option = document.createElement("option")
      option.value = category.id
      option.textContent = category.name
      addExpenseSelect.appendChild(option)
    })
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

      // Fetch expense details with category_id
      fetch(`/public/get_expense_details.php?id=${expenseId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const expense = data.data
            // Populate the edit modal with current values
            document.getElementById("editExpenseId").value = expense.id
            document.getElementById("editAmount").value = expense.amount
            document.getElementById("editCategory").value = expense.category_id
            document.getElementById("editDate").value = expense.expense_date
            document.getElementById("editDescription").value = expense.description || ""

            // Show the edit modal
            document.getElementById("editExpenseModal").style.display = "block"
          } else {
            alert("Failed to load expense details: " + (data.error || "Unknown error"))
          }
        })
        .catch((error) => {
          console.error("Error loading expense details:", error)
          alert("An error occurred while loading expense details.")
        })
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
  loadCategories() // Load categories to populate select dropdowns
  loadFinancialStatistics() // Load financial statistics and charts

  // Add refresh button event listener
  document.getElementById("refreshStats").addEventListener("click", () => {
    loadFinancialStatistics()
  })
})

// Financial Statistics and Charts Functions
let categoryPieChart = null
let monthlyTrendChart = null

function loadFinancialStatistics() {
  fetch("/public/get_expenses.php")
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        updateStatistics(data.data)
        createCategoryPieChart(data.data)
        createMonthlyTrendChart(data.data)
        updateCategoryTable(data.data)
      }
    })
    .catch((error) => {
      console.error("Error loading financial statistics:", error)
    })
}

function updateStatistics(expenses) {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  // Filter expenses for current month
  const currentMonthExpenses = expenses.filter((exp) => {
    const expDate = new Date(exp.expense_date)
    return (
      expDate.getMonth() === currentMonth &&
      expDate.getFullYear() === currentYear
    )
  })

  // Calculate total expenses for current month
  const totalAmount = currentMonthExpenses.reduce(
    (sum, exp) => sum + parseFloat(exp.amount),
    0
  )

  // Calculate average daily spending
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const avgDaily = totalAmount / daysInMonth

  // Find top spending category
  const categoryTotals = {}
  currentMonthExpenses.forEach((exp) => {
    categoryTotals[exp.category] =
      (categoryTotals[exp.category] || 0) + parseFloat(exp.amount)
  })

  const topCategory =
    Object.keys(categoryTotals).reduce(
      (a, b) => (categoryTotals[a] > categoryTotals[b] ? a : b),
      Object.keys(categoryTotals)[0]
    ) || "-"

  // Update statistics display
  document.getElementById(
    "totalExpenses"
  ).textContent = `৳${totalAmount.toFixed(2)}`
  document.getElementById("avgDaily").textContent = `৳${avgDaily.toFixed(2)}`
  document.getElementById("topCategory").textContent = topCategory
  document.getElementById("totalEntries").textContent =
    currentMonthExpenses.length
}

function createCategoryPieChart(expenses) {
  const ctx = document.getElementById("categoryPieChart").getContext("2d")

  // Calculate category totals
  const categoryTotals = {}
  expenses.forEach((exp) => {
    categoryTotals[exp.category] =
      (categoryTotals[exp.category] || 0) + parseFloat(exp.amount)
  })

  const labels = Object.keys(categoryTotals)
  const data = Object.values(categoryTotals)

  // Generate colors for categories
  const colors = generateColors(labels.length)

  if (categoryPieChart) {
    categoryPieChart.destroy()
  }

  categoryPieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: colors,
          borderColor: "#fff",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 20,
            usePointStyle: true,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = ((context.parsed / total) * 100).toFixed(1)
              return `${context.label}: ৳${context.parsed.toFixed(
                2
              )} (${percentage}%)`
            },
          },
        },
      },
    },
  })
}

function createMonthlyTrendChart(expenses) {
  const ctx = document.getElementById("monthlyTrendChart").getContext("2d")

  // Group expenses by month for the last 6 months
  const monthlyData = {}
  const currentDate = new Date()

  for (let i = 5; i >= 0; i--) {
    const month = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    )
    const monthKey = month.toLocaleString("default", {
      month: "short",
      year: "2-digit",
    })
    monthlyData[monthKey] = 0
  }

  expenses.forEach((exp) => {
    const expDate = new Date(exp.expense_date)
    const monthKey = expDate.toLocaleString("default", {
      month: "short",
      year: "2-digit",
    })
    if (monthlyData.hasOwnProperty(monthKey)) {
      monthlyData[monthKey] += parseFloat(exp.amount)
    }
  })

  const labels = Object.keys(monthlyData)
  const data = Object.values(monthlyData)

  if (monthlyTrendChart) {
    monthlyTrendChart.destroy()
  }

  monthlyTrendChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Monthly Spending",
          data: data,
          borderColor: "#3182ce",
          backgroundColor: "rgba(49, 130, 206, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#3182ce",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return "৳" + value.toFixed(0)
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return "৳" + context.parsed.y.toFixed(2)
            },
          },
        },
      },
    },
  })
}

function updateCategoryTable(expenses) {
  const tbody = document.getElementById("categoryTableBody")
  tbody.innerHTML = ""

  // Calculate category statistics
  const categoryStats = {}
  expenses.forEach((exp) => {
    if (!categoryStats[exp.category]) {
      categoryStats[exp.category] = { amount: 0, count: 0 }
    }
    categoryStats[exp.category].amount += parseFloat(exp.amount)
    categoryStats[exp.category].count += 1
  })

  // Calculate total for percentage
  const totalAmount = Object.values(categoryStats).reduce(
    (sum, stat) => sum + stat.amount,
    0
  )

  // Sort categories by amount (descending)
  const sortedCategories = Object.entries(categoryStats).sort(
    (a, b) => b[1].amount - a[1].amount
  )

  sortedCategories.forEach(([category, stats]) => {
    const percentage = ((stats.amount / totalAmount) * 100).toFixed(1)

    const row = document.createElement("tr")
    row.innerHTML = `
      <td><strong>${category}</strong></td>
      <td>৳${stats.amount.toFixed(2)}</td>
      <td>${percentage}%</td>
      <td>${stats.count}</td>
    `
    tbody.appendChild(row)
  })
}

function generateColors(count) {
  const colors = [
    "#3182ce",
    "#38a169",
    "#d69e2e",
    "#e53e3e",
    "#805ad5",
    "#dd6b20",
    "#319795",
    "#d53f8c",
    "#2d3748",
    "#4a5568",
  ]

  const result = []
  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length])
  }
  return result
}
