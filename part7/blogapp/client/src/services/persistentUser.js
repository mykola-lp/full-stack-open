const STORAGE_KEY = 'loggedBlogappUser'

export const getUser = () => {
  const userJson = window.localStorage.getItem(STORAGE_KEY)

  return userJson ? JSON.parse(userJson) : null
}

export const saveUser = (user) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export const removeUser = () => {
  window.localStorage.removeItem(STORAGE_KEY)
}
