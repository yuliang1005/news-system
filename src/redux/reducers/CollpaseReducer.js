export const collpaseReducer = (prevState = {
    isCollpased: false
}, action) => {
    let { type } = action
    switch (type) {
        case 'change_collpased':
            let newState = { ...prevState }
            newState.isCollpased = !prevState.isCollpased
            return newState
        default:
            return prevState
    }
}