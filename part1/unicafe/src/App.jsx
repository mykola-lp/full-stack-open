import { useState } from 'react'

const calculateTotal = (good, neutral, bad) => good + neutral + bad

const calculateAverage = (good, bad, total) => {
  if (total === 0) return 0
  return (good - bad) / total
}

const calculatePositivePercentage = (good, total) => {
  if (total === 0) return 0
  return (good / total) * 100
}

const Header = ({ title }) => <h2>{title}</h2>

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const ButtonPanel = ({ onGood, onNeutral, onBad }) => {
  return (
    <div className="buttons">
      <Button onClick={onGood} text="good" />&nbsp;
      <Button onClick={onNeutral} text="neutral" />&nbsp;
      <Button onClick={onBad} text="bad" />
    </div>
  )
}

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({ good, neutral, bad }) => {
  const total = calculateTotal(good, neutral, bad)
  if (total === 0) {
    return <p>No feedback given</p>
  }

  const average = calculateAverage(good, bad, total)
  const positivePercentage = calculatePositivePercentage(good, total)

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="total" value={total} />
        <StatisticLine text="average" value={average} />
        <StatisticLine text="positive" value={`${positivePercentage} %`} />
      </tbody>
    </table>
  )
}

const App = () => {
  const unicafe = {
    sectionTitle: 'give feedback',
    statisticsTitle: 'statistics'
  }

  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header title={unicafe.sectionTitle} />

      <ButtonPanel
        onGood={() => setGood(good + 1)}
        onNeutral={() => setNeutral(neutral + 1)}
        onBad={() => setBad(bad + 1)}
      />

      <Header title={unicafe.statisticsTitle} />

      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
