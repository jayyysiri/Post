
# CS132 Post API Documentation
**Author:** Jay Siri
**Last Updated:** 10/19/22

The Post API provides functionality to retrieve and post data for my postcard store.

Clients can retrieve information for current items available on store, such as categories, products, and images. Functionality is also provided to send "contact us" messages.

Summary of endpoints:
* GET /promos
* GET /faqs
* GET /postcards
* GET /postcards/:continent
* GET /descriptions/:locations
* POST /contact
...

In the current version of this API, all error responses are returned as plain text. Any 500 errors represent a server-side issue and include a generic error message. Any 400-level errors represent an invalid request by a client, and are documented appropriately for any parameterized endpoint.

Contact the author at jsiri@caltech.edu for any bug reports or feature requests!

## *GET /promos*
**Returned Data Format**: JSON

**Description:**
Returns a JSON collection of promotions for the Post website.

**Example Request:** `promos`

**Example Response:**
```json
[
  "Bangkok Bonus: Buy any 5 postcards, get the Bangkok postcard for free.",
  "North America Deal: Buy 5 postcards located in North America for a reduced price of $7.50...",
]
```

## *GET /faqs*
**Returned Data Format**: JSON

**Description:**
Returns a JSON collection of FAQs for the Post website.

**Example Request:** `faqs`

**Example Response:**
```json
[
  "What is Post?",
  "Post specializes in selling aesthetic, and-sometimes-uncommon postcards.",
  "How do I customize a postcard?",
  "At this time, postcards are not customizable..."
]
```

## *GET /postcards*
**Returned Data Format**: JSON

**Description:**
Returns a JSON collection of all postcards for the Post website.

**Example Request:** `postcards`

**Example Response:**
```json
[
  "abuja.png", "bangkok.png", "cancun.png..."
]
```

## *GET /postcards/:continent*
**Returned Data Format**: JSON

**Description:**
Returns a JSON collection of a continent's postcards.

**Example Request:** `postcards/asia`

**Example Response:**
```json
[
  "bangkok.png", "dubai.png", "seoul.png", "tokyo.png"
]
```

## *GET /descriptions/:location*
**Returned Data Format**: JSON

**Description:**
Returns a JSON collection of a location description.

**Example Request:** `descriptions/bangkok`

**Example Response:**
```json
[
  "Bangkok, Thailand’s capital, is a large city known for ornate shrines...."
]
```

## *POST /contact*
**Returned Data Format**: Plain Text

**Description:** 
Sends information to the Cafe web service for a "Contact Us" endpoint, including the name of the user, their email, and a text message. Returns a response about whether the information was successfully sent, otherwise provides details about an erroneous request.

**Supported Parameters**
* POST body parameters: 
  * `message` (required) - contact message
  * `email` (required) - email of customer

**Example Request:** `/contact`
* POST body parameters: 
  * `message='Jay says hi!'`
  * `email='jsiri@caltech.edu'`

**Example Response:**
```Thank you for your message! We will take a look at get back to you as soon as possible.```

**Error Handling:**
* 400: Invalid request missing required `message` or `email` parameter.

**Example Request:** `/contact`
* POST body parameters: 
  * `email='jsiri@caltech.edu'`
  * `message='Jay says Hi!'`

**Example Response:**
```Missing required POST parameters for /contact: email.```