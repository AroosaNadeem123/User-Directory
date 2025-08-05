// DOM elements ko access kia gaya
const userList = document.getElementById('userList');
const searchBox = document.getElementById('searchBox');
const pageNumber = document.getElementById('pageNumber');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentPage = 1; // Initial page

// 🔵 GET Request – Server se Users lana
function fetchUsers(page = 1) {
  fetch(`https://reqres.in/api/users?page=${page}`)
    .then(res => res.json())
    .then(data => {
      userList.innerHTML = ''; // Purana data clear karo

      // Har user ka card create karo
      data.data.forEach(user => {
        const card = document.createElement('div');
        card.className = 'user-card';
        card.innerHTML = `
          <img src="${user.avatar}" alt="${user.first_name}">
          <h3 class="user-name">${user.first_name} ${user.last_name}</h3>
          <p class="user-email">${user.email}</p>
          <button class="edit-btn" data-id="${user.id}">Edit</button>
          <button class="delete-btn" data-id="${user.id}">Delete</button>
        `;
        userList.appendChild(card);
      });

      // ✅ Pagination info
      pageNumber.textContent = `Page ${data.page} of ${data.total_pages}`;

      // 🔴 DELETE button functionality
      document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => {
          const userId = button.getAttribute('data-id');
          deleteUser(userId);
        });
      });

      // ✏️ EDIT button functionality
      document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', () => {
          const userId = button.getAttribute('data-id');
          updateUser(userId);
        });
      });
    })
    .catch(error => {
      console.error('Error fetching users:', error);
    });
}

// 🟢 POST Request – Naya User Add karna
function addUser(name, job) {
  fetch('https://reqres.in/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, job })
  })
  .then(response => response.json())
  .then(data => {
    alert(`User "${data.name}" added successfully!`);
    fetchUsers(currentPage); // List refresh
  })
  .catch(error => {
    console.error('Error adding user:', error);
  });
}

// 🟠 PUT Request – User Update karna
function updateUser(userId) {
  const updatedName = prompt("Enter updated name:");
  const updatedJob = prompt("Enter updated job:");

  if (updatedName && updatedJob) {
    fetch(`https://reqres.in/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: updatedName, job: updatedJob })
    })
    .then(response => response.json())
    .then(data => {
      alert(`User updated to "${data.name}"`);
      fetchUsers(currentPage);
    })
    .catch(error => {
      console.error('Error updating user:', error);
    });
  }
}
// 🔴 DELETE Request – User Delete karna
function deleteUser(userId) {
  if (confirm("Are you sure you want to delete this user?")) {
    fetch(`https://reqres.in/api/users/${userId}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        alert("User deleted successfully.");
        fetchUsers(currentPage);
      } else {
        alert("Failed to delete user.");
      }
    })
    .catch(error => {
      console.error('Error deleting user:', error);
    });
  }
}
// 🔍 Search Functionality (by name or email)
searchBox.addEventListener('input', function () {
  const query = this.value.toLowerCase();
  const userCards = document.querySelectorAll('.user-card');

  userCards.forEach(card => {
    const name = card.querySelector('.user-name').textContent.toLowerCase();
    const email = card.querySelector('.user-email').textContent.toLowerCase();

    if (name.includes(query) || email.includes(query)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
});

// ⬅️ Previous Page
prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchUsers(currentPage);
  }
});

// ➡️ Next Page
nextBtn.addEventListener('click', () => {
  currentPage++;
  fetchUsers(currentPage);
});

// 🟦 Page Load par pehla data fetch
fetchUsers(currentPage);

// 🟩 Example add button trigger (you can link this to a real form later)
// addUser("Ali", "Frontend Developer");