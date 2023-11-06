function scrapeData() {
  const keyword = document.getElementById("searchInput").value;
  fetch(`http://localhost:3000/api/scrape?keyword=${keyword}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const resultsContainer = document.getElementById("resultsContainer");
      resultsContainer.innerHTML = "";
      if (data.length === 0) {
        resultsContainer.innerHTML = "No results found.";
      } else {
        data.forEach((item) => {
          if (item.title) {
            const resultDiv = document.createElement("div");
            resultDiv.innerHTML = `
                <p><strong>Title:</strong> ${item.title}</p>
                <p><strong>Rating:</strong> ${item.rating}</p>
                <p><strong>Reviews:</strong> ${item.reviews}</p>
                <img src="${item.image}" alt="Product Image" style="max-width: 100px; max-height: 100px; margin-bottom: 10px;">
              `;
            resultsContainer.appendChild(resultDiv);
          }
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      const resultsContainer = document.getElementById("resultsContainer");
      resultsContainer.innerHTML =
        "Error fetching data. Please try again later.";
    });
}
