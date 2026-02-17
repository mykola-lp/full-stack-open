const Header = ({ level = 1, children }) => {
  const safeLevel = Math.min(Math.max(level, 1), 6)
  const Tag = `h${safeLevel}`
  return <Tag>{children}</Tag>
}

export default Header