/**
 * @author Jay Siri
 * CS 132 Spring 2022
 *
 * JS Script to display FAQs.
 */
"use strict";
(function () {
  const BASE_URL = "https://post-jjf0.onrender.com/";

  function init() {
    fetchData();
  }

  /**
   * Fetch all FAQ data from the GET endpoint; display errors appropriately.
   */
  async function fetchData() {
    try {
      // Fetch, process, display FAQs
      let urlFAQ = BASE_URL + "faqs";
      let respFAQ = await fetch(urlFAQ, { method: "GET" });
      respFAQ = checkStatus(respFAQ);
      const dataFAQ = await respFAQ.json();
      processFAQData(dataFAQ);
    } catch (err) {
      handleRequestError(err);
    }
  }

  /**
   * Processes the response to display the FAQs on the page.
   * @param {Object} json - the parsed JSON object (random data name) that is was returned
   * from the request.
   */
  function processFAQData(txt) {
    for (let i = 0; i < txt.length - 1; i++) {
      console.log(txt[i]);
      if (i % 2 == 0) {
        let question = document.createElement("p");
        question.textContent = "Q: " + txt[i];
        id("FAQ").appendChild(question);
        let answer = document.createElement("p");
        answer.textContent = "A: " + txt[i + 1];
        id("FAQ").appendChild(answer);
      }
    }
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
    id("FAQ").appendChild(response);
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

  /* Helper functions for DOM access and manipulation */

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
