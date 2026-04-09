const App = () => {
  const notes = useNotes(import.meta.env.VITE_BACKEND_URL)

  return (
    <div>
      {notes.length} notes on server {import.meta.env.VITE_BACKEND_URL}
    </div>
  )
}

export default App