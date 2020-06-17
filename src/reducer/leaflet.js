const leaflet = (state = [], action) => {
  switch (action.type) {
    case "SET_LEAFLET":
      state = [...action.data]
      break;
    default:
      break;
  }
  return state
}

export default leaflet