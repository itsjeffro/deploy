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
  isCreating: false,
  isCreated: false,
  isFetching: false,
  isUpdating: false,
  isUpdated: false,
  isKeyUpdating: false,
};