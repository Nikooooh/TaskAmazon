// Import necessary modules.
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors"); // Import the cors package

// Create a new Express application
const app = express();

// Enable CORS for all routes
app.use(cors());

// Define the endpoint for the scraping functionality
app.get("/api/scrape", (req, res) => {
  // Extract the search keyword from the query parameter
  const searchKeyword = req.query.keyword || "laptop"; // Default keyword is 'laptop' if no keyword is provided
  const searchUrl = `https://www.amazon.com/s?k=${searchKeyword}`;

  // Make a GET request to the provided search URL
  axios
    .get(searchUrl, { headers: { "User-Agent": "Mozilla/5.0" } })
    .then((response) => {
      // Load the HTML content of the response using Cheerio
      const $ = cheerio.load(response.data);
      const results = [];

      // Iterate through each product listing and extract the required details
      $("div[data-asin]").each((index, element) => {
        const title = $(element)
          .find("span.a-size-medium.a-color-base.a-text-normal")
          .text()
          .trim();
        const rating = $(element).find("span.a-icon-alt").text();
        const image = $(element).find("img.s-image").attr("src");
        let reviews = $(element).find("span.a-size-base").text();
        reviews = reviews.match(/\d+/) ? reviews.match(/\d+/)[0] : "";

        // Push the extracted details to the results array
        results.push({ title, rating, image, reviews });
      });

      // Send the results as JSON in the response
      res.json(results);
    })
    .catch((error) => {
      // Handle any errors that occur during the fetching and parsing process
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Error fetching and parsing data" });
    });
});

// Define the port for the server to listen on
const PORT = process.env.PORT || 3000;

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
