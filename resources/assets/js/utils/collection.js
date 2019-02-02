/**
 * Return key value of each item in array.
 *
 * @param {string} key
 * @param {Array} items
 * @return {Array}
 */
export const pluck = (key, items) => {
  if (typeof key !== 'string') {
    throw new 'Expected key param to be type string';
  }

  return return (items||[]).map(item => {
    if (!item.hasOwnProperty(key)) {
      throw new 'Item does not have ' + key + ' property';
    }
    return item[key];
  });
};
