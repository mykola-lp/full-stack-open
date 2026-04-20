import { useQuery } from '@tanstack/react-query'

import usersApi from '../api/usersApi'

const USERS_QUERY_KEY = ['users']

export const useUsersQuery = () =>
  useQuery({
    queryFn: usersApi.getAll,
    queryKey: USERS_QUERY_KEY,
  })

export const useUserById = (id) => {
  const query = useUsersQuery()

  return {
    ...query,
    user: query.data?.find((item) => item.id === id) ?? null,
  }
}
