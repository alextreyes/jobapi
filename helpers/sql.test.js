const { sqlForPartialUpdate } = require("./sql");
const { BadRequestError } = require("../expressError");

describe("sqlForPartialUpdate", () => {
  // Test case: when dataToUpdate has multiple fields and jsToSql mappings are provided
  test("works: data to update and jsToSql mappings", () => {
    const dataToUpdate = { firstName: "Aliya", age: 32 };
    const jsToSql = { firstName: "first_name" };

    // Call the function with provided data
    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

    // Check if the function returns the expected SQL setCols and values
    expect(result).toEqual({
      setCols: '"first_name"=$1, "age"=$2',
      values: ["Aliya", 32],
    });
  });

  // Test case: when dataToUpdate has multiple fields but no jsToSql mappings are provided
  test("works: data to update without jsToSql mappings", () => {
    const dataToUpdate = { firstName: "Aliya", age: 32 };
    const jsToSql = {}; // no mapping provided

    // Call the function with provided data
    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

    // Check if the function returns the expected SQL setCols and values without jsToSql mappings
    expect(result).toEqual({
      setCols: '"firstName"=$1, "age"=$2',
      values: ["Aliya", 32],
    });
  });

  // Test case: when dataToUpdate has a single field
  test("works: single field to update", () => {
    const dataToUpdate = { age: 32 };
    const jsToSql = {};

    // Call the function with provided data
    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

    // Check if the function returns the expected SQL setCols and values for a single field
    expect(result).toEqual({
      setCols: '"age"=$1',
      values: [32],
    });
  });

  // Test case: when no data is provided in dataToUpdate
  test("throws BadRequestError if no data", () => {
    const dataToUpdate = {};
    const jsToSql = { firstName: "first_name" };

    // Check if the function throws a BadRequestError when no data is provided
    expect(() => sqlForPartialUpdate(dataToUpdate, jsToSql)).toThrow(
      BadRequestError
    );
  });

  // Test case: when dataToUpdate has multiple fields and jsToSql mappings are provided
  test("works: jsToSql with multiple mappings", () => {
    const dataToUpdate = { firstName: "Aliya", lastName: "Smith", age: 32 };
    const jsToSql = { firstName: "first_name", lastName: "last_name" };

    // Call the function with provided data
    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

    // Check if the function returns the expected SQL setCols and values with multiple jsToSql mappings
    expect(result).toEqual({
      setCols: '"first_name"=$1, "last_name"=$2, "age"=$3',
      values: ["Aliya", "Smith", 32],
    });
  });
});
