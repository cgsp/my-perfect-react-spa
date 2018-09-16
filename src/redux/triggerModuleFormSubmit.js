const TRIGGER_DATA_SUCCESS = 'TRIGGER_DATA_SUCCESS'
const TRIGGER_SUCCESS = 'TRIGGER_SUCCESS'
const initState = {
  taskModules: [],
  trigger: false
}

export function triggerModuleFormSubmitReducer(state = initState, action) {
  switch (action.type) {
    case TRIGGER_DATA_SUCCESS:
      return { ...state, taskModules: action.payload }
    case TRIGGER_SUCCESS:
      return { ...state, trigger: true }
    default:
      return state
  }
}


function getSuccess(data) {
  return { type: TRIGGER_DATA_SUCCESS, payload: data }
}

function triggerSuccess() {
  return { type: TRIGGER_SUCCESS }
}


export function getTriggerData(data) {
  return (dispatch, state) => {
    dispatch(getSuccess(state.taskModules.push(data)))
  }
}

export function triggerBegin(callBack) {
  return (dispatch) => {
    dispatch(triggerSuccess())
    callBack && callBack()
  }
}
