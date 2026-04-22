import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`

export const ALL_BOOKS = gql`
  query allBooks($genre: String) {
    allBooks(genre: $genre) {
      author {
        name
        id
      }
      title
      genres
      published
      id
    }
  }
`


export const CREATE_BOOK = gql`
  mutation createBook(
    $author: String!
    $title: String!
    $genres: [String!]!
    $published: Int!
  ) {
    addBook(
      author: $author,
      title: $title,
      genres: $genres,
      published: $published
    ) {
      author {
        name
        id
      }
      title
      genres
      published
      id
    }
  }
`

export const EDIT_AUTHOR = gql`
  mutation editAuthor(
    $name: String!,
    $setBornTo: Int!
  ) {
    editAuthor(
      name: $name,
      setBornTo: $setBornTo
    ) {
      name
      born
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

export const ME = gql`
  query {
    me {
      username
      favoriteGenre
      id
    }
  }
`
