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
  addCategoryToSelects(categoryName)
}

// Function to add category to select dropdowns
function addCategoryToSelects(categoryName) {
  const addExpenseSelect = document.getElementById("category")
  const editExpenseSelect = document.getElementById("editCategory")

  if (addExpenseSelect) {
    const option = document.createElement("option")
    option.value = categoryName
    option.textContent = categoryName
    addExpenseSelect.appendChild(option)
  }

  if (editExpenseSelect) {
    const option = document.createElement("option")
    option.value = categoryName
    option.textContent = categoryName
    editExpenseSelect.appendChild(option)
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
          updateCategoryInSelects(currentName, newName.trim())
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
function updateCategoryInSelects(oldName, newName) {
  const addExpenseSelect = document.getElementById("category")
  const editExpenseSelect = document.getElementById("editCategory")

  if (addExpenseSelect) {
    const option = addExpenseSelect.querySelector(`option[value="${oldName}"]`)
    if (option) {
      option.value = newName
      option.textContent = newName
    }
  }

  if (editExpenseSelect) {
    const option = editExpenseSelect.querySelector(`option[value="${oldName}"]`)
    if (option) {
      option.value = newName
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
            removeCategoryFromSelects(categoryName)
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
function removeCategoryFromSelects(categoryName) {
  const addExpenseSelect = document.getElementById("category")
  const editExpenseSelect = document.getElementById("editCategory")

  if (addExpenseSelect) {
    const option = addExpenseSelect.querySelector(
      `option[value="${categoryName}"]`
    )
    if (option) {
      option.remove()
    }
  }

  if (editExpenseSelect) {
    const option = editExpenseSelect.querySelector(
      `option[value="${categoryName}"]`
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
          populateCategorySelects(data.data.map((cat) => cat.name))
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
  const editExpenseSelect = document.getElementById("editCategory")

  // Clear existing options (except the first placeholder)
  if (addExpenseSelect) {
    addExpenseSelect.innerHTML = '<option value="">Select a category</option>'
    categories.forEach((category) => {
      const option = document.createElement("option")
      option.value = category
      option.textContent = category
      addExpenseSelect.appendChild(option)
    })
  }

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
