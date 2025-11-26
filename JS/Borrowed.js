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


        // Sample borrowed books data
        const borrowedBooks = [
            {
                id: 1,
                bookImage: "https://images-na.ssl-images-amazon.com/images/I/51XZCZ9Q6EL._SX331_BO1,204,203,200_.jpg",
                bookName: "Bourne Identity",
                visitorName: "Ahmed Hassan",
                borrowDate: "2025-10-15",
                dueDate: "2025-11-05"
            },
            {
                id: 2,
                bookImage: "https://images-na.ssl-images-amazon.com/images/I/51QVXQZ9W8L._SX331_BO1,204,203,200_.jpg",
                bookName: "The Hunt for Red October",
                visitorName: "Sara Mohamed",
                borrowDate: "2025-11-03",
                dueDate: "2025-11-14"
            },
            {
                id: 3,
                bookImage: "https://images-na.ssl-images-amazon.com/images/I/51MZQVXQZ9L._SX331_BO1,204,203,200_.jpg",
                bookName: "Day of the Jackal",
                visitorName: "Omar Ali",
                borrowDate: "2025-10-20",
                dueDate: "2025-12-05"
            },
            {
                id: 4,
                bookImage: "https://images-na.ssl-images-amazon.com/images/I/51NZQVXQZ9L._SX331_BO1,204,203,200_.jpg",
                bookName: "The Gray Man",
                visitorName: "Layla Ibrahim",
                borrowDate: "2025-11-01",
                dueDate: "2025-12-15"
            },
            {
                id: 5,
                bookImage: "https://images-na.ssl-images-amazon.com/images/I/51fZH7VQRML._SX331_BO1,204,203,200_.jpg",
                bookName: "The Bourne Supremacy",
                visitorName: "Khaled Mahmoud",
                borrowDate: "2025-10-05",
                dueDate: "2025-10-30"
            }
        ];

        // Check if date is overdue
        function isOverdue(dueDate) {
            const today = new Date();
            const due = new Date(dueDate);
            return due < today;
        }

        // Check if due soon (within 7 days)
        function isDueSoon(dueDate) {
            const today = new Date();
            const due = new Date(dueDate);
            const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
            return diffDays <= 7 && diffDays > 0;
        }

        // Format date
        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        }

        // Render table
        function renderTable() {
            const tbody = document.getElementById('borrowedTableBody');
            const emptyState = document.getElementById('emptyState');

            if (borrowedBooks.length === 0) {
                tbody.innerHTML = '';
                emptyState.style.display = 'block';
                return;
            }

            emptyState.style.display = 'none';

            tbody.innerHTML = borrowedBooks.map(book => {
                const overdue = isOverdue(book.dueDate);
                const dueSoon = isDueSoon(book.dueDate);
                const dueDateClass = overdue ? 'due-date-badge overdue' : (dueSoon ? 'due-date-badge' : 'date-badge');
                const rowStyle = overdue ? 'style="background-color: #fef2f2 !important;"' : '';

                return `
                    <tr data-book-id="${book.id}" ${rowStyle}>
                        <td class="book-image-cell" data-label="Image">
                            <img src="${book.bookImage}" alt="${book.bookName}" class="book-thumbnail" 
                                 onerror="this.src='https://via.placeholder.com/60x80/4bc1d2/white?text=Book'">
                        </td>
                        <td data-label="Book Name">
                            <p class="book-title">${book.bookName}</p>
                        </td>
                        <td data-label="Visitor Name">
                            <span class="visitor-name">${book.visitorName}</span>
                        </td>
                        <td data-label="Borrow Date">
                            <span class="date-badge">${formatDate(book.borrowDate)}</span>
                        </td>
                        <td data-label="Due Date">
                            <span class="${dueDateClass}">
                                ${formatDate(book.dueDate)}
                                ${overdue ? '<i class="fas fa-exclamation-circle ms-1"></i>' : ''}
                            </span>
                        </td>
                        <td class="text-center" data-label="Action">
                            <button class="return-btn" onclick="returnBook(${book.id})">
                                <i class="fas fa-undo me-1"></i> Return
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');

            updateStats();
        }

        // Update statistics
        function updateStats() {
            const total = borrowedBooks.length;
            const dueSoonCount = borrowedBooks.filter(book => isDueSoon(book.dueDate)).length;
            const overdueCount = borrowedBooks.filter(book => isOverdue(book.dueDate)).length;

            document.getElementById('totalBorrowed').textContent = total;
            document.getElementById('dueSoon').textContent = dueSoonCount;
            document.getElementById('overdue').textContent = overdueCount;
        }

        // Return book function
        function returnBook(bookId) {
            if (confirm('Are you sure you want to mark this book as returned?')) {
                const index = borrowedBooks.findIndex(book => book.id === bookId);
                if (index !== -1) {
                    const book = borrowedBooks[index];
                    borrowedBooks.splice(index, 1);
                    renderTable();

                    // Show success message
                    alert(`"${book.bookName}" has been returned successfully!`);
                }
            }
        }

        // User dropdown functionality
        const userInfo = document.getElementById('userInfo');
        const userDropdown = document.getElementById('userDropdown');

        userInfo.addEventListener('click', function (e) {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });

        document.addEventListener('click', function (e) {
            if (!userInfo.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        });

        // Initialize table on page load
        document.addEventListener('DOMContentLoaded', function () {
            renderTable();
        });
