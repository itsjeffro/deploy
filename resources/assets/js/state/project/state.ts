export const initialState = {
  item: {
    id: null,
    name: '',
    branch: '',
    repository: '',
    provider_id: null,
    servers: [],
    environment_servers: [],
  },
  errors: [],
  isFetching: false,
  isUpdating: false,
  isUpdated: false,
  isKeyUpdating: false,
};