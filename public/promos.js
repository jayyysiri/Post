/**
 * @author Jay Siri
 * CS 132 Spring 2022
 *
 * JS Script to display promotions.
 */
"use strict";
(function () {
  const BASE_URL = "http://localhost:8000/";

  function init() {
    fetchData();
  }

  /**
   * Fetch all promotions from the promo GET endpoint, process them.
   */
  async function fetchData() {
    try {
      // Fetch, process, display promos
      let urlPromos = BASE_URL + "promos";
      let respPromos = await fetch(urlPromos, { method: "GET" });
      respPromos = checkStatus(respPromos);
      const dataPromos = await respPromos.json();
      processPromoData(dataPromos);
    } catch (err) {
      handleRequestError(err);
    }
  }

  /**
   * Processes the response to display the promotion on the page.
   * @param {Object} txt - the parsed JSON object that is was returned
   * from the request.
   */
  function processPromoData(txt) {
    for (let i = 0; i < txt.length; i++) {
      let promotion = document.createElement("p");
      promotion.textContent = i + 1 + ". " + txt[i];
      id("promotions").appendChild(promotion);
    }
  }

  // ----- HELPER FUNCTIONS -----

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
    id("promotions").appendChild(response);
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

  /**
   * This function returns a DOM element with the given id.
   *
   * @param {string} idName - id to be used to find a DOM element
   * @returns {HTMLElement} - DOM element with the given id
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  init();
})();
