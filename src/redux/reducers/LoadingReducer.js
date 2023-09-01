export const loadingReducer = (prevState = {
    isLoading: false
}, action) => {
    let { type, payload } = action
    switch (type) {
        case 'loading_set':
            let newState = { ...prevState }
            newState.isLoading = payload
            return newState
        default:
            return prevState
    }
}