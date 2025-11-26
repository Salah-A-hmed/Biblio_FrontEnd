// Auto-detect current page and set active state
document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split("/").pop().replace(".html", "");

  // Remove active class from all nav links
  const navLinks = document.querySelectorAll(".nav-link[data-page]");
  navLinks.forEach((link) => link.classList.remove("active"));

  // Find and activate the current page link
  let activeLink = null;

  // Check for exact page match
  activeLink = document.querySelector(`[data-page="${currentPage}"]`);

  // Fallback mappings for different URL patterns
  if (!activeLink) {
    const pageMap = {
      index: "library",
      home: "library",
      dashboard: "library",
      books: "library",
      "add-book": "add-items",
      "add-item": "add-items",
      "new-item": "add-items",
      collection: "add-collection",
      collections: "add-collection",
      "new-collection": "add-collection",
      publishing: "publish",
      upload: "publish",
      share: "publish",
      stats: "dashboards",
      analytics: "dashboards",
      reports: "dashboards",
      "borrowed-books": "borrowed-books",
    };

    if (pageMap[currentPage]) {
      activeLink = document.querySelector(
        `[data-page="${pageMap[currentPage]}"]`
      );
    }
  }

  // If still no match, default to library (first item)
  if (!activeLink) {
    activeLink = document.querySelector('[data-page="library"]');
  }

  // Add active class to the determined link
  if (activeLink) {
    activeLink.classList.add("active");
  }
});


// Sample returned books data
const returnedBooks = [
  {
    id: 1,
    bookImage:
      "https://images-na.ssl-images-amazon.com/images/I/51XZCZ9Q6EL._SX331_BO1,204,203,200_.jpg",
    bookName: "Bourne Identity",
    visitorName: "Ahmed Hassan",
    dueDate: "2025-10-25",
    returnDate: "2025-10-24",
    fine: 0,
  },
  {
    id: 2,
    bookImage:
      "https://images-na.ssl-images-amazon.com/images/I/51QVXQZ9W8L._SX331_BO1,204,203,200_.jpg",
    bookName: "The Hunt for Red October",
    visitorName: "Sara Mohamed",
    dueDate: "2025-10-30",
    returnDate: "2025-11-05",
    fine: 15,
  },
  {
    id: 3,
    bookImage:
      "https://images-na.ssl-images-amazon.com/images/I/51MZQVXQZ9L._SX331_BO1,204,203,200_.jpg",
    bookName: "Day of the Jackal",
    visitorName: "Omar Ali",
    dueDate: "2025-11-01",
    returnDate: "2025-11-01",
    fine: 0,
  },
  {
    id: 4,
    bookImage:
      "https://images-na.ssl-images-amazon.com/images/I/51NZQVXQZ9L._SX331_BO1,204,203,200_.jpg",
    bookName: "The Gray Man",
    visitorName: "Layla Ibrahim",
    dueDate: "2025-10-20",
    returnDate: "2025-10-28",
    fine: 24,
  },
  {
    id: 5,
    bookImage:
      "https://images-na.ssl-images-amazon.com/images/I/51fZH7VQRML._SX331_BO1,204,203,200_.jpg",
    bookName: "The Bourne Supremacy",
    visitorName: "Khaled Mahmoud",
    dueDate: "2025-10-15",
    returnDate: "2025-10-14",
    fine: 0,
  },
  {
    id: 6,
    bookImage:
      "https://images-na.ssl-images-amazon.com/images/I/51AZCZ9Q6EL._SX331_BO1,204,203,200_.jpg",
    bookName: "Red Storm Rising",
    visitorName: "Fatima Ali",
    dueDate: "2025-11-03",
    returnDate: "2025-11-08",
    fine: 10,
  },
];

// Check if returned late
function wasReturnedLate(dueDate, returnDate) {
  const due = new Date(dueDate);
  const returned = new Date(returnDate);
  return returned > due;
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Render table
function renderTable() {
  const tbody = document.getElementById("returnedTableBody");
  const emptyState = document.getElementById("emptyState");

  if (returnedBooks.length === 0) {
    tbody.innerHTML = "";
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  tbody.innerHTML = returnedBooks
    .map((book) => {
      const late = wasReturnedLate(book.dueDate, book.returnDate);
      const fineClass = book.fine > 0 ? "fine-badge has-fine" : "fine-badge";
      const rowStyle = late
        ? 'style="background-color: #fff3cd !important;"'
        : "";

      return `
                    <tr data-book-id="${book.id}" ${rowStyle}>
                        <td class="book-image-cell" data-label="Image">
                            <img src="${book.bookImage}" alt="${
        book.bookName
      }" class="book-thumbnail" 
                                 onerror="this.src='https://via.placeholder.com/60x80/4bc1d2/white?text=Book'">
                        </td>
                        <td data-label="Book Name">
                            <p class="book-title">${book.bookName}</p>
                        </td>
                        <td data-label="Visitor Name">
                            <span class="visitor-name">${book.visitorName}</span>
                        </td>
                        <td data-label="Due Date">
                            <span class="date-badge">${formatDate(
                              book.dueDate
                            )}</span>
                        </td>
                        <td data-label="Return Date">
                            <span class="date-badge">${formatDate(
                              book.returnDate
                            )}</span>
                        </td>
                        <td data-label="Fine">
                            <span class="${fineClass}">
                                ${
                                  book.fine > 0
                                    ? "$" + book.fine
                                    : "No Fine"
                                }
                            </span>
                        </td>
                    </tr>
                `;
    })
    .join("");

  updateStats();
}

// Update statistics
function updateStats() {
  const total = returnedBooks.length;
  const onTimeCount = returnedBooks.filter(
    (book) => !wasReturnedLate(book.dueDate, book.returnDate)
  ).length;
  const totalFinesAmount = returnedBooks.reduce(
    (sum, book) => sum + book.fine,
    0
  );

  document.getElementById("totalReturned").textContent = total;
  document.getElementById("onTime").textContent = onTimeCount;
  document.getElementById("totalFines").textContent = "$" + totalFinesAmount;
}

// User dropdown functionality
const userInfo = document.getElementById("userInfo");
const userDropdown = document.getElementById("userDropdown");

userInfo.addEventListener("click", function (e) {
  e.stopPropagation();
  userDropdown.classList.toggle("show");
});

document.addEventListener("click", function (e) {
  if (!userInfo.contains(e.target)) {
    userDropdown.classList.remove("show");
  }
});

// Initialize table on page load
document.addEventListener("DOMContentLoaded", function () {
  renderTable();
});
