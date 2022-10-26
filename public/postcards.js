/**
 * @author Jay Siri
 *
 * This is the postcards.js file for adding/filtering
 * cards on the Post website.
 */

(function () {
  "use strict";

  const BASE_URL = "https://post-jjf0.onrender.com/";

  /**
   * Initialize a sessionStorage for the cart.
   * Display all postcards.
   * Initialzie listeners to get the active continent filter.
   */
  function init() {
    if (!window.sessionStorage.getItem("cart")) {
      let cart = [];
      window.sessionStorage.setItem("cart", JSON.stringify(cart));
    }
    fetchData("All");
    activeContinent();
  }

  /**
   * Add listeners to the continent "buttons" to get the active
   * continent. Then call fetchData for that continent.
   */
  function activeContinent() {
    let btns = id("buttonPanel").querySelectorAll("p");
    for (let i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        let current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace("active", "");
        this.className += "active";
        id("cards").innerHTML = "";
        fetchData(this.textContent);
      });
    }
  }

  /**
   * @ @param {Object} continent- the current active continent for the filter.
   * Called by activeContinent(). Fetches the data from a GET endpoint
   * for that continent and displays it.
   */
  async function fetchData(continent) {
    try {
      continent = formatContinent(continent);
      let urlCards = BASE_URL + "postcards";
      if (continent != "/all") {
        urlCards = BASE_URL + "postcards" + continent;
      }
      // Fetch, process, display postcards
      let respCards = await fetch(urlCards, { method: "GET" });
      respCards = checkStatus(respCards);
      const dataCards = await respCards.json();
      processCardData(dataCards);
    } catch (err) {
      handleRequestError(err);
    }
  }

  /**
   * Processes the response to display the right cards on the page.
   * @param {Object} txt - the list of locations from fetchData(continent).
   */
  function processCardData(txt) {
    for (let i = 0; i < txt.length; i++) {
      let cardItem = document.createElement("div");

      let title = document.createElement("p");
      let name = formatTitle(txt[i]);
      title.textContent = name;
      cardItem.appendChild(title);

      let image = document.createElement("img");
      image.src = "postcards/" + txt[i];
      cardItem.appendChild(image);

      let button = document.createElement("p");
      button.textContent = "Buy";
      button.setAttribute("id", "buyButton");
      button.addEventListener("click", function () {
        id("mainBody").className = "hidden";
        showContent(txt[i]);
      });

      cardItem.appendChild(button);
      id("cards").appendChild(cardItem);
    }
  }


  /**
   * Shows the content for the INDIVIDUAL card page.
   * @param {Object} txt - the card name that was clicked to buy.
   */
  async function showContent(txt) {
    // Create Title
    let title = document.createElement("h2");
    title.textContent = formatTitle(txt);
    id("prodInfo").appendChild(title);

    // Create Image
    let prodInfoContainer = document.createElement("div");
    let image = document.createElement("img");
    image.src = "postcards/" + txt;
    prodInfoContainer.appendChild(image);

    // Create and Retrieve Description
    let urlDescription = BASE_URL + "descriptions/" + txt.slice(0, -4);
    let respDescription = await fetch(urlDescription, { method: "GET" });
    respDescription = checkStatus(respDescription);
    const dataDescription = await respDescription.json();
    let description = document.createElement("p");
    description.textContent = dataDescription;
    prodInfoContainer.appendChild(description);

    // Create buy/add to cart button, with listener
    let buyItemDiv = document.createElement("div");
    buyItemDiv.setAttribute("id", "buyItemDiv");
    let buyItemButton = document.createElement("p");
    buyItemButton.textContent = "Buy";
    buyItemButton.setAttribute("id", "buyItemButton");

    buyItemButton.addEventListener("click", function () {
      let boughtText = document.createElement("p");
      boughtText.textContent = "Added to Cart!";
      boughtText.setAttribute("id", "confirmationText");
      if (!id("confirmationText")) {
        id("prodInfo").appendChild(boughtText);
      }
      // If added to cart, then input item into sessionStorage cart.
      let currCart = JSON.parse(window.sessionStorage.getItem("cart"));
      currCart.push(txt);
      window.sessionStorage.setItem("cart", JSON.stringify(currCart));
      console.log(window.sessionStorage);
    });

    // Append and display.
    buyItemDiv.appendChild(buyItemButton);
    id("prodInfo").appendChild(prodInfoContainer);
    id("prodInfo").appendChild(buyItemDiv);
  }

  // ----- HELPER/DOM STANDARD FUNCTIONS ------

  /**
   * Formats the continent name to be used in retrieving data from GET endpoint.
   * @param {*} txt continent name from fetchData().
   * @returns txt to use as a parameter for the GET endpoint URL.
   */
     function formatContinent(txt) {
      txt = txt.toLowerCase();
      for (let i = 0; i < txt.length; i++) {
        if (txt[i] === " ") {
          txt = txt.slice(0, i) + "_" + txt.slice(i + 1);
        }
      }
      return "/" + txt;
    }

  /**
   * Formats the location name to be used in retrieving data from GET endpoint.
   * @param {*} txt postcard location name.
   * @returns txt to use as a parameter for the GET endpoint URL.
   */
  function formatTitle(title) {
    let temp = title.slice(0, -4);
    for (let i = 0; i < temp.length; i++) {
      if (i === 0) {
        temp = temp.charAt(0).toUpperCase() + temp.slice(1);
      }
      if (temp.charAt(i) === "_") {
        temp =
          temp.slice(0, i) +
          " " +
          temp.charAt(i + 1).toUpperCase() +
          temp.slice(i + 2);
      }
    }
    return temp;
  }

  /**
   * This function returns a DOM element with the given id.
   *
   * @param {string} idName - id to be used to find a DOM element
   * @returns {HTMLElement} - DOM element with the given id
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * This function returns the first DOM element with the given CSS query selector.
   *
   * @param {string} selector - A CSS query selector to find a DOM element with
   * @returns {HTMLElement} - The first DOM element with the given CSS query selector
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * This function returns a list of all DOM elements with the given CSS query selector.
   *
   * @param {string} selector - A CSS query selector to find DOM elements with
   * @returns {DOMList} - A list of all DOM elements with the given CSS query selector.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * This function creates a new DOM element of the given element type and returns it.
   *
   * @param {string} elType - The type of DOM element to create
   * @returns {HTMLElement} - A new DOM element of the given element type
   */
  function gen(elType) {
    return document.createElement(elType);
  }

  /**
   * This function is called when an error occurs in the fetch call chain
   * (e.g. the request returns a non-200 error code, such as when either API
   * service is down). Displays a user-friendly error message on the page and
   * re-enables the get cat button.
   * @param {Error} err - the error details of the request.
   */
  function handleRequestError(err) {
    let response = document.createElement("p");
    let msg = "There was an error requesting the data. Please try again later.";
    response.textContent = msg;
    id("cards").appendChild(response);
  }

  /**
   * (Copied from helpers.js for reference in lecture)
   * Helper function to return the Response data if successful, otherwise
   * returns an Error that needs to be caught.
   * @param {object} response - response with status to check for success/error.
   * @returns {object} - The Response object if successful, otherwise an Error that
   * needs to be caught.
   */
  function checkStatus(response) {
    if (!response.ok) {
      throw Error("Error in request: " + response.statusText);
    }
    return response;
  }

  init();
})();
