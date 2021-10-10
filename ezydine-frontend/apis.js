

const serverUrl = 'http://localhost:8000'
if (process.env.NODE_ENV === 'production') {
    serverUrl = process.env.PROD_SERVER_URL
}
// const serverUrl='https://subhamx-codespaces-vjv5r4q92wpj5-8000.githubpreview.dev'
export const registerEndpoint = `${serverUrl}/auth/register/`
export const loginEndpoint = `${serverUrl}/auth/login/`
export const addMenuItemEndpoint = `${serverUrl}/spot/add_menu_item/`
export const authCheckEndpoint = `${serverUrl}/auth/status/`

export const fetchAllSpotsEndpoint = `${serverUrl}/spot/all`
export const fetchSingleSpotsEndpoint = (spotId) => `${serverUrl}/spot/info/${spotId}`

