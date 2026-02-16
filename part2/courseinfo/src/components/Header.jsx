const Header = ({ level = 1, children }) => {
  const Tag = `h${level}`
  return <Tag>{children}</Tag>
}

export default Header
