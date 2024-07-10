const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate); // we are taking the values and adding it to keys
  if (keys.length === 0) throw new BadRequestError("No data"); // if there are no values, aka lenght === 0, throw an error

  // maps keys to SQL column assignment, by iterating over each key in the keys variable, converting each key to corresponding SQL column name if one is provided, while creating a placeholder for each key, starting from $1
  // Example:
  // Input: { firstName: 'Aliya', age: 32 }
  // jsToSql: { firstName: 'first_name' }
  // Output: [ '"first_name"=$1', '"age"=$2' ]
  const cols = keys.map(
    (colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  // retursn the SQL column assigments and corresponding values, the setcols is going to have the values joined by a , and the values would be  an array of the datatoupdate values
  // Example:
  // setCols: '"first_name"=$1, "age"=$2'
  // values: ['Aliya', 32]
  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
