import axios from 'axios'

const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = newToken ? `Bearer ${newToken}` : null
}

const getConfig = () => ({ headers: { Authorization: token } })

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject, getConfig())
  return request.then((response) => response.data)
}

const update = (newObject) => {
  return axios
    .put(`${baseUrl}/${newObject.id}`, newObject, getConfig())
    .then((response) => response.data)
}

const addComment = (id, comment) => {
  return axios.post(`${baseUrl}/${id}/comments`, { comment }).then((response) => response.data)
}

const remove = (id) => {
  return axios
    .delete(`${baseUrl}/${id}`, getConfig())
    .then((response) => response.data)
}

export default { addComment, create, getAll, setToken, update, remove }
