

const serverUrl = '/api'

export const registerEndpoint = `${serverUrl}/auth/register/`
export const loginEndpoint = `${serverUrl}/auth/login/`
export const addMenuItemEndpoint = `${serverUrl}/spot/add_menu_item/`
export const authCheckEndpoint = `${serverUrl}/auth/status/`

export const fetchAllSpotsEndpoint = `${serverUrl}/spot/all`
export const fetchSingleSpotsEndpoint = (spotId) => `${serverUrl}/spot/info/${spotId}`

export const logOutEndpoint = `${serverUrl}/auth/logout/`
