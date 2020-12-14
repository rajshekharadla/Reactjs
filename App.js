import "./App.css";
import React, { useState } from "react";
function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  const updateSearch = (e) => {
    e.preventDefault(); // prevents form re-rendering
    let searchedKey = e.target.value;
    console.log(searchedKey);
    if (searchedKey !== "") {
      // calling getSuggestions API
      setSearchKey(searchedKey);
      getSuggestions(searchedKey);
    } else {
      // Nullifying search
      setSearchKey("");
    }
  };

  const getHighlightedText = (text, highlight) => {
    // Split on highlight term and include term into parts, ignore case
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {" "}
        {parts.map((part, i) => (
          // converting highlited text into bold
          <span
            key={i}
            style={
              part.toLowerCase() === highlight.toLowerCase()
                ? { fontWeight: "bold" }
                : {}
            }
          >
            {part}
          </span>
        ))}{" "}
      </span>
    );
  };

  var FAILURE_COEFF = 10;
  var MAX_SERVER_LATENCY = 200;

  function getRandomBool(n) {
    var maxRandomCoeff = 1000;
    if (n > maxRandomCoeff) n = maxRandomCoeff;
    return Math.floor(Math.random() * maxRandomCoeff) % n === 0;
  }

  function getSuggestions(text) {
    var pre = "pre";
    var post = "post";
    var results = [];
    if (getRandomBool(2)) {
      results.push(pre + text);
    }
    if (getRandomBool(2)) {
      results.push(text);
    }
    if (getRandomBool(2)) {
      results.push(text + post);
    }
    if (getRandomBool(2)) {
      results.push(pre + text + post);
    }
    return new Promise((resolve, reject) => {
      var randomTimeout = Math.random() * MAX_SERVER_LATENCY;
      setTimeout(() => {
        if (getRandomBool(FAILURE_COEFF)) {
          reject();
        } else {
          resolve(results);
          console.log(results);
          setSearchResults(results);
        }
      }, randomTimeout);
    }).catch(function (error) {
      console.log("The error is handled, continue normally");
    });
  }

  const renderSuggestions = () => {
    //rendering list of suggestions onto UI
    if (searchKey.trim().length === 0) {
      return null;
    }
    return (
      <ul>
        {searchResults.map((result) => (
          <li
            key={Math.random() * 1000}
            onClick={() => suggestionSelected(result)}
          >
            {" "}
            <div>{getHighlightedText(result, searchKey)}</div>
          </li>
        ))}
      </ul>
    );
  };

  const suggestionSelected = (item) => {
    if (item.length !== 0) {
      //whenever we select any suggestion , add extra space and replace the word in text box
      setSearchKey(item + " ");
      //also remove other suggestions
      setSearchResults([]);
    }
  };
  return (
    <div className="App">
      <form
        className="search-form"
        onMouseDown={() => {
          suggestionSelected(searchKey);
        }}
      >
        <div className="AutoCompleteText">
          <h1>ABC Search Engine</h1>
          <input
            value={searchKey}
            type="text"
            placeholder="Please Search here..."
            onChange={updateSearch}
            onClick={updateSearch}
          ></input>
          {renderSuggestions()}
        </div>
      </form>
    </div>
  );
}

export default App;
