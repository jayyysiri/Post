/**
 * @author Jay Siri
 * CS 132 Spring 2022
 *
 * JS Script to display items in cart.
 */

"use strict";

(function () {
  async function init() {
    showCart();
  }
  /**
   * Populates the cart using the sessionStorage. Shows all items' images, names,
   * and price ($2). Calculates the total price and items can be removed
   * from the cart and sessionStorage.
   */
  async function showCart() {
    // Retrieve items from sessionStorage, calculate total.
    let cart = JSON.parse(window.sessionStorage.getItem("cart"));
    console.log(cart);
    let total = 2 * cart.length;
    id("total").textContent = "Total: $" + total + ".00";

    for (let item of cart) {
      // Create the title and price.
      let cartItem = document.createElement("div");
      let cartItemTxt = document.createElement("h3");
      cartItemTxt.textContent =
        item.slice(0, 1).toUpperCase() + item.slice(1, -4) + " - $2";

      // Create the image.
      let cartItemImg = document.createElement("img");
      cartItemImg.src = "postcards/" + item;

      // Create the Remove button.
      let removeButton = document.createElement("p");
      removeButton.textContent = "Remove";
      removeButton.setAttribute("id", "removeButton");
      removeButton.addEventListener("click", async () => {
        total -= 2;
        id("total").textContent = "Total: $" + total + ".00";
        id("cart").removeChild(cartItem);
        let indexToRemove = cart.indexOf(item);
        cart.splice(indexToRemove, 1);
        window.sessionStorage.setItem("cart", JSON.stringify(cart));
      });

      // Append all children for each item.
      cartItem.appendChild(cartItemTxt);
      cartItem.appendChild(cartItemImg);
      cartItem.appendChild(removeButton);
      id("cart").appendChild(cartItem);
    }
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
