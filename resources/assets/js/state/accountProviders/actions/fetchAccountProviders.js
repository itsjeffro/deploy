import AccountProviderService from '../../../services/AccountProvider';
import {
  FETCH_ACCOUNT_PROVIDERS_FAILURE,
  FETCH_ACCOUNT_PROVIDERS_REQUEST,
  FETCH_ACCOUNT_PROVIDERS_SUCCESS,
} from '../constants';

/**
 * @returns {void}
 */
export const fetchAccountProvidersRequest = () => ({
  type: FETCH_ACCOUNT_PROVIDERS_REQUEST
});

/**
 * @param {Array} providers
 * @returns {void}
 */
export const fetchAccountProvidersSuccess = (providers) => ({
  type: FETCH_ACCOUNT_PROVIDERS_SUCCESS,
  providers: providers
});

/**
 * @returns {void}
 */
export const fetchAccountProvidersFailure = () => ({
  type: FETCH_ACCOUNT_PROVIDERS_FAILURE
});

/**
 * @returns {void}
 */
export const fetchAccountProviders = () => {
  return (dispatch) => {
    dispatch(fetchAccountProvidersRequest());

    const accountProviderService = new AccountProviderService;

    accountProviderService
      .index('/api/account-providers')
      .then(response => {
        let providers = response.data.filter(provider => {
          return provider.deploy_access_token;
        });

        dispatch(fetchAccountProvidersSuccess(providers));
      }, error => {
        dispatch(fetchAccountProvidersFailure());
      });
  }
};
