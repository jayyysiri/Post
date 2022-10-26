/**
 * @author Jay Siri
 * CS 132 Spring 2022
 *
 * JS Script to retrieve information from the contact form.
 */

"use strict";
(function () {
  const DEBUG = false;
  const BASE_URL = "https://post-jjf0.onrender.com/";
  const CONTACT_URL = BASE_URL + "contact";

  function init() {
    id("msg-form").addEventListener("submit", (evt) => {
      evt.preventDefault();
      submitMsg();
      id("msg-form").className = "hidden";
    });
  }

  async function submitMsg() {
    id("response").innerHTML = "";
    let params = new FormData(id("msg-form"));
    try {
      let resp = await fetch(CONTACT_URL, { method: "POST", body: params });
      await checkStatus(resp);
      resp = await resp.text();
      id("response").textContent = resp;
    } catch (err) {
      handleError(err);
    }
  }

  /**
   * Displays an error to the user if server goes wrong.
   * @param {Error} err error
   */
  function handleError(err) {
    id("response").textContent = "Your message could not be submitted.";
    if (DEBUG) {
      console.error(err);
    }
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
