/**
 * Return a simplied array of all the errors 
 * we received from our source data.
 *
 * @param {array} response
 * @return {array}
 */
export const buildAlertFromResponse = response => {
  let errorResponse = response.data.hasOwnProperty('errors') ? errorResponse.errors : errorResponse;
      	
  const errors = Object.keys(errorResponse).reduce(function(previousError, key) {
    return previousError.concat(errorResponse[key][0]);
 	}, []); 
};
