import Header from './Header'
import Content from './Content'
import Total from './Total'

const Course = ({ course }) => {
  const total = course.parts.reduce(
    (sum, part) => sum + part.exercises,
    0
  )

  return (
    <div>
      <Header level={2}>{course.name}</Header>
      <Content parts={course.parts} />
      <Total total={total} />
    </div>
  )
}

export default Course
