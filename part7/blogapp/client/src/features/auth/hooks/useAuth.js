import { useDispatch, useSelector } from 'react-redux'

import { loginUser, logoutUser, selectUser } from '../authSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)

  return {
    user,
    login: async (credentials) => {
      const result = await dispatch(loginUser(credentials))

      return loginUser.fulfilled.match(result)
    },
    logout: () => {
      dispatch(logoutUser())
    },
  }
}
