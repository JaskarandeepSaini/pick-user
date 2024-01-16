import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './searchInput.css';

const InputField = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [flag, setFlag] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/suggestions?query=${inputValue}`);
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    fetchSuggestions();
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    const filteredSuggestions = suggestions.filter(
      (suggestion) =>
        suggestion.name.toLowerCase().includes(value.toLowerCase()) ||
        suggestion.email.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  const handleSelectItem = (item) => {
    setSelectedItems([...selectedItems, item]);
    setSuggestions((prevSuggestions) => prevSuggestions.filter((suggestion) => suggestion.id !== item.id));
    setInputValue('');
  };

  const handleRemoveItem = (id) => {
    const removedItem = selectedItems.find((item) => item.id === id);
    setSelectedItems((prevItems) => prevItems.filter((item) => item.id !== id));
    setSuggestions((prevSuggestions) => [...prevSuggestions, removedItem]);
  };

  const calculateDropdownPosition = () => {
    const inputRect = inputRef.current.getBoundingClientRect();
    return {
      top: inputRect.bottom + window.scrollY,
      left: inputRect.left + window.scrollX,
    };
  };

  useEffect(() => {
    const handleDocumentKeyDown = (event) => {
        if (flag && event.key === 'Backspace' && document.activeElement !== inputRef.current) {
          const lastSelectedItem = selectedItems[selectedItems.length - 1];
          if (lastSelectedItem && !inputValue.trim()) {
            event.preventDefault(); 
            setSelectedItems((prevItems) => prevItems.slice(0, -1)); 
            setSuggestions((prevSuggestions) => [...prevSuggestions, lastSelectedItem]);
          }
          setFlag(false);
        }
        else{
         setFlag(true);
        }
      };
    document.addEventListener('keydown', handleDocumentKeyDown);

    return () => {
      document.removeEventListener('keydown', handleDocumentKeyDown);
    };
  }, [selectedItems, flag])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="inputContainer" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', marginBottom: '4px' }}>
        {selectedItems.map((item) => (
          <div key={item.id} className="selected-item">
            <div className="avatar"><img src={item.img} alt="pic"/></div>
            <div>
              <span>{item.name}</span>
              <span className="remove-item" onClick={() => handleRemoveItem(item.id)}>
                &#10006;
              </span>
            </div>
          </div>
        ))}
        <input
          className='searchInput'
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Add new user..."
          style={{ border: 'none', outline: 'none', marginLeft: '5px' }}
          ref={inputRef}
        />
      </div>
      {inputValue.trim() !== '' && suggestions.length > 0 && (
        <div
          className="dropdown"
          style={{
            position: 'absolute',
            top: calculateDropdownPosition().top + 'px',
            left: calculateDropdownPosition().left + 'px',
            zIndex: 1,
          }}
        >
          {suggestions.map((item) => (
            <div className="dropdownOption" key={item.id} onClick={() => handleSelectItem(item)}>
              <div className="avatar"><img src={item.img} alt="pic"/></div>
              <div>
                <span>{item.name}</span>
                <span className="email">{item.email}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InputField;