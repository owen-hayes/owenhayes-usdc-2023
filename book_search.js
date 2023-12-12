/**
 * Searches for matches in scanned text.
 *
 * @param {string} searchTerm The word or term we're searching for.
 * @param {{
 *    Title: string, ISBN: string,
 *    Content: {Page: number, Line: number, Text: string}[]
 *  }[]} books An array of books, where each book is represented by a JSON object.
 * @returns {{
 *    SearchTerm: string, Results: {ISBN: string, Page: number, Line: number
 * }[]}} Search results.
 * @throws Error if searchTerm is not a string or books is malformed
 * */
function findSearchTermInBooks(searchTerm, books) {
  // Ensure searchTerm is string
  if (typeof searchTerm !== "string") {
    throw new Error("searchTerm is not a string");
  }

  // Ensure books is array
  if (!Array.isArray(books)) {
    throw new Error("books is not an array");
  }

  const result = {
    SearchTerm: searchTerm,
    Results: [],
  };

  // Look thru each book in input array
  books.forEach((book) => {
    // Make sure book has Content (empty array is fine)
    if (book.Content === undefined) {
      throw new Error("book is missing Content");
    }

    // Look thru each piece of content in content array
    book.Content.forEach((contentPiece) => {
      // Make sure content has Text and Text is a string
      if (
        contentPiece.Text === undefined ||
        !(typeof contentPiece.Text === "string")
      ) {
        throw new Error("content is missing Text or Text is not a string");
      }

      // If text in this piece of content contains search term, add to result
      if (contentPiece.Text.includes(searchTerm)) {
        result.Results.push({
          ISBN: book.ISBN,
          Page: contentPiece.Page,
          Line: contentPiece.Line,
        });
      }
    });
  });

  return result;
}

/** Example input object. */
const twentyLeaguesIn = [
  {
    Title: "Twenty Thousand Leagues Under the Sea",
    ISBN: "9780000528531",
    Content: [
      {
        Page: 31,
        Line: 8,
        Text: "now simply went on by her own momentum.  The dark-",
      },
      {
        Page: 31,
        Line: 9,
        Text: "ness was then profound; and however good the Canadian's",
      },
      {
        Page: 31,
        Line: 10,
        Text: "eyes were, I asked myself how he had managed to see, and",
      },
    ],
  },
];

/** Example output object */
const twentyLeaguesOut = {
  SearchTerm: "the",
  Results: [
    {
      ISBN: "9780000528531",
      Page: 31,
      Line: 9,
    },
  ],
};

/*
 _   _ _   _ ___ _____   _____ _____ ____ _____ ____  
| | | | \ | |_ _|_   _| |_   _| ____/ ___|_   _/ ___| 
| | | |  \| || |  | |     | | |  _| \___ \ | | \___ \ 
| |_| | |\  || |  | |     | | | |___ ___) || |  ___) |
 \___/|_| \_|___| |_|     |_| |_____|____/ |_| |____/ 
                                                      
 */

/* We have provided two unit tests. They're really just `if` statements that
 * output to the console. We've provided two tests as examples, and
 * they should pass with a correct implementation of `findSearchTermInBooks`.
 *
 * Please add your unit tests below.
 * */

/**
 * Runs a test by comparing the expected and actual values by checking if
 * stringified versions of the expected and actual values are equal. Logs a
 * success or failure message to the console in a nice green or red color.
 *
 * @param {string} testName The name of the test.
 * @param {*} expected The expected value.
 * @param {*} actual The actual value.
 */
function runEqualityTest(testName, expected, actual) {
  if (JSON.stringify(expected) === JSON.stringify(actual)) {
    // Log green success message if test passes
    console.log("%cPASS", "color: green; font-weight: bold;", testName);
  } else {
    // Log red error message if test fails; show expected & actual values for debugging
    console.error(
      "%cFAIL",
      "color: red; font-weight: bold",
      testName,
      `\nExpected ${JSON.stringify(expected)}, Received: ${JSON.stringify(
        actual
      )}`
    );
  }
}

/** We can check that, given a known input, we get a known output. */
const test1result = findSearchTermInBooks("the", twentyLeaguesIn);

/** We could choose to check that we get the right number of results. */
const test2result = findSearchTermInBooks("the", twentyLeaguesIn);

// Twenty leagues searches
{
  // Test 1 (given)
  runEqualityTest(
    "Twenty leagues: Search for 'the' returns expected result",
    JSON.stringify(twentyLeaguesOut),
    JSON.stringify(test1result)
  );

  // Test 2 (given)
  runEqualityTest(
    "Twenty leagues: Search for 'the' has length of 1",
    test2result.Results.length,
    1
  );

  // Search for however (lowercase)
  runEqualityTest(
    "Twenty leagues: Search for 'however' returns 1 result",
    {
      SearchTerm: "however",
      Results: [
        {
          ISBN: "9780000528531",
          Page: 31,
          Line: 9,
        },
      ],
    },
    findSearchTermInBooks("however", twentyLeaguesIn)
  );

  // Search for However (with a capital H)
  runEqualityTest(
    "Twenty leagues: Search for 'However' (uppercase) returns 0 results",
    {
      SearchTerm: "However",
      Results: [],
    },
    findSearchTermInBooks("However", twentyLeaguesIn)
  );

  runEqualityTest(
    "Twenty leagues: Search for 'ask' returns 1 result",
    {
      SearchTerm: "ask",
      Results: [
        {
          ISBN: "9780000528531",
          Page: 31,
          Line: 10,
        },
      ],
    },
    findSearchTermInBooks("ask", twentyLeaguesIn)
  );
}

// Search for non-strings
{
  // Try number as search term
  try {
    findSearchTermInBooks(123, [
      {
        Title: "ASDF",
        ISBN: "9876",
        Content: [],
      },
    ]);

    // We expect an error to be thrown, so test fails
    runEqualityTest("Non-string search term: number", false, true);
  } catch (e) {
    // An error was thrown, so test passes
    runEqualityTest("Non-string search term: number", true, true);
  }

  // Try array as search term
  try {
    findSearchTermInBooks(
      [],
      [
        {
          Title: "ASDF",
          ISBN: "9876",
          Content: [],
        },
      ]
    );

    // We expect an error to be thrown, so test fails
    runEqualityTest("Non-string search term: array", false, true);
  } catch (e) {
    // An error was thrown, so test passes
    runEqualityTest("Non-string search term: array", true, true);
  }
}

// Search with malformed books array
{
  // Try searching when book has no content
  try {
    findSearchTermInBooks("abcd", [
      {
        Title: "ASDF",
        ISBN: "9876",
      },
    ]);

    // We expect an error to be thrown, so test fails
    runEqualityTest("Malformed books array: Book has no content", false, true);
  } catch (e) {
    // An error was thrown, so test passes
    runEqualityTest("Malformed books array: Book has no content", true, true);
  }

  // Try searching when book Content has no Text
  try {
    findSearchTermInBooks("abcd", [
      {
        Title: "ASDF",
        ISBN: "9876",
        Content: [{}],
      },
    ]);

    // We expect an error to be thrown, so test fails
    runEqualityTest("Malformed books array: Content has no text", false, true);
  } catch (e) {
    // An error was thrown, so test passes
    runEqualityTest("Malformed books array: Content has no text", true, true);
  }
}

// Search with empty books array
{
  runEqualityTest(
    "Empty books array: Returns 0 results",
    { SearchTerm: "abcd", Results: [] },
    findSearchTermInBooks("abcd", [])
  );
}

const multipleBooks = [
  {
    Title: "Klara and the Sun",
    ISBN: "9780593317171",
    Content: [
      {
        Page: 4,
        Line: 10,
        Text: "And not only could I see every window up to the rooftop, I",
      },
      {
        Page: 5,
        Line: 12,
        Text: "and disappointed. But once we'd seated ourselves on the Striped Sofa,",
      },
    ],
  },
  {
    Title: "Because Internet",
    ISBN: "9780735210936",
    Content: [
      {
        Page: 71,
        Line: 22,
        Text: "An article reminiscing about the early-2000s teen internet high-",
      },
      {
        Page: 23,
        Line: 3,
        Text: "AIM shut down, a tech culture reporter recalled how in middle",
      },
    ],
  },
];

// Search with multiple books
{
  // Should be 3 lines in the multipleBooks array containing lowercase 'a'
  runEqualityTest(
    "Multiple books: Search for 'a'",
    {
      SearchTerm: "a",
      Results: [
        { ISBN: "9780593317171", Page: 5, Line: 12 },
        { ISBN: "9780735210936", Page: 71, Line: 22 },
        { ISBN: "9780735210936", Page: 23, Line: 3 },
      ],
    },
    findSearchTermInBooks("a", multipleBooks)
  );

  // Should be 1 line in the multipleBooks array containing "2000"
  runEqualityTest(
    "Multiple books: Search for '2000'",
    {
      SearchTerm: "2000",
      Results: [{ ISBN: "9780735210936", Page: 71, Line: 22 }],
    },
    findSearchTermInBooks("2000", multipleBooks)
  );

  // Should be 0 lines in the multipleBooks array containing "asdf"
  runEqualityTest(
    "Multiple books: Search for 'asdf'",
    {
      SearchTerm: "asdf",
      Results: [],
    },
    findSearchTermInBooks("asdf", multipleBooks)
  );

  // Should be 1 line in the multipleBooks array containing "And" (uppercase)
  runEqualityTest(
    "Multiple books: Search for 'And'",
    {
      SearchTerm: "And",
      Results: [{ ISBN: "9780593317171", Page: 4, Line: 10 }],
    },
    findSearchTermInBooks("And", multipleBooks)
  );

  // Should be 1 line in the multipleBooks array containing "and" (lowercase)
  runEqualityTest(
    "Multiple books: Search for 'and'",
    {
      SearchTerm: "and",
      Results: [{ ISBN: "9780593317171", Page: 5, Line: 12 }],
    },
    findSearchTermInBooks("and", multipleBooks)
  );
}
