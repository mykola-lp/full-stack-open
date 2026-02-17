const Person = ({ person }) => (
  <div>
    {person.name} :: {person.number}
  </div>
)

const Persons = ({ persons }) => (
  <>
    {persons.map(p => <Person key={p.name} person={p} />)}
  </>
)

export default Persons
