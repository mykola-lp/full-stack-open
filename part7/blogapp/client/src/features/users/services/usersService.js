import usersApi from '../api/usersApi'

export const getUsers = () => usersApi.getAll()

export const getUserById = async (id) => {
  const users = await getUsers()
  return users.find((user) => user.id === id) ?? null
}
