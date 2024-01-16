const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());


let initialSuggestions = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    name: `Sample User ${index + 1}`,
    email: `sample${index + 1}@example.com`,
    img: `https://picsum.photos/${index + 100}`
  }));

let suggestions = [...initialSuggestions]; 


app.post('/api/suggestions', (req, res) => {
  const { query } = req.query;
  let {selectedItems}  = req.body ||{} ;

  selectedItems = selectedItems ? selectedItems:[];

  let localSuggestions = suggestions;
  if(query === '' || query == null){
    localSuggestions = localSuggestions.filter(item => !selectedItems.some(item1 => item1.id === item.id));

    return res.json(localSuggestions);
  }

  let filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.name.toLowerCase().includes(query.toLowerCase()) ||
      suggestion.email.toLowerCase().includes(query.toLowerCase())
  );

  filteredSuggestions = filteredSuggestions.filter(item => !selectedItems.some(item1 => item1.id === item.id));

  res.json(filteredSuggestions);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});