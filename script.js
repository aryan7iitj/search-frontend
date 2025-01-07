const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("resultsContainer");
const modal = document.getElementById("userDetailsModal");
const closeModal = document.getElementById("closeModal");

let typingTimer;
const debounceDelay = 300;

// Event listeners
searchInput.addEventListener("input", () => {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(fetchResults, debounceDelay);
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// Fetch results
async function fetchResults() {
  const query = searchInput.value.trim();
  if (!query) {
    resultsContainer.innerHTML = "";
    return;
  }

  try {
    const response = await fetch(
      `https://scared-demeter-girman-7b78fd95.koyeb.app/api/search_users?q=${query}`
    );
    const data = await response.json();
    renderResults(data.results || []);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function renderResults(results) {
  resultsContainer.innerHTML = "";

  if (results.length === 0) {
    resultsContainer.innerHTML = `
      <div class="no-results">
        <img src="no_res.png" alt="No Results">
        <p>No results found.</p>
      </div>`;
    return;
  }

  results.forEach((user) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${user.profile_image || "https://via.placeholder.com/80"}" alt="User Avatar">
      <h3>${user.first_name} ${user.last_name}</h3>
      <p><i class="fas fa-map-marker-alt"></i> ${user.city || "Location not available"}</p>
      <button>Fetch Details</button>
    `;

    card.querySelector("button").addEventListener("click", () => {
      document.getElementById("userName").textContent = `${user.first_name} ${user.last_name}`;
      document.getElementById("userLocation").textContent = user.city || "Location not available";
      document.getElementById("userContact").textContent = user.contact_number || "Contact not available";
      document.getElementById("userImage").src = user.profile_image || "https://via.placeholder.com/150";

      modal.style.display = "flex";
    });

    resultsContainer.appendChild(card);
  });
}
