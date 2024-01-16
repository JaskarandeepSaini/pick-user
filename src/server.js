const express = require('express');
const cors = require('cors');

const app = express();
const port = 5001;

app.use(cors());

let initialSuggestions = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    name: `Sample User ${index + 1}`,
    email: `sample${index + 1}@example.com`,
    img: `https://picsum.photos/${index + 100}`
  }));

let suggestions = [...initialSuggestions]; 

app.get('/api/suggestions', (req, res) => {
  const { query } = req.query;

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.name.toLowerCase().includes(query.toLowerCase()) ||
      suggestion.email.toLowerCase().includes(query.toLowerCase())
  );

  res.json(filteredSuggestions);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});