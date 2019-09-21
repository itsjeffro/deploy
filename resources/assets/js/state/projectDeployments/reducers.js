const initialState = {
  items: [],
  isFetching: false
};

const projectDeployments = (state = initialState, action) => {
  switch(action.type) {
    case 'PROJECT_DEPLOYMENTS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'PROJECT_DEPLOYMENTS_SUCCESS':
      return {
        items: action.deployments,
        isFetching: false
      };
    case 'PROJECT_DEPLOYMENTS_FAILURE':
      return {
        ...state,
        isFetching: false
      };

    default:
      return state;
  }
};

export default projectDeployments;
