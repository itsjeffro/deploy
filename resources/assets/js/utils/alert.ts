/**
 * Return a simplied array of all the errors 
 * we received from our source data.
 *
 * @param {array} response
 * @return {array}
 */
export const buildAlertFromResponse = (response) => {
  let errorResponse = response.data.hasOwnProperty('errors') ? response.data.errors : response.data;
      	
  return Object.keys(errorResponse).reduce(function(previousError, key) {
    let currentError = errorResponse[key][0];
    return previousError.concat(currentError);
  }, []);
};
