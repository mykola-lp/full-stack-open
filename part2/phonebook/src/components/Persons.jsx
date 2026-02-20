const Person = ({ person, handleDelete }) => (
  <div>
    {person.name} :: {person.number} 
    <button onClick={() => handleDelete(person.id, person.name)}>delete</button>
  </div>
)

const Persons = ({ persons, handleDelete }) => (
  <>
    {persons.map(p => (
      <Person key={p.id} person={p} handleDelete={handleDelete} />
    ))}
  </>
)


export default Persons
