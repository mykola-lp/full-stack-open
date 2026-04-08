import styled from 'styled-components'

const Wrapper = styled.section`
  margin-top: 24px;
  padding: 32px;
  border-radius: 24px;
  background: linear-gradient(135deg, #f6efe6 0%, #fbf8f3 100%);
  border: 1px solid #e6d8c8;
  box-shadow: 0 18px 40px rgba(74, 63, 53, 0.08);
`

const Eyebrow = styled.p`
  margin: 0 0 12px;
  color: #6f5b4b;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`

const Title = styled.h2`
  margin: 0 0 12px;
  color: #2f4858;
  font-size: 2rem;
  line-height: 1.1;
`

const Lead = styled.p`
  max-width: 85ch;
  margin: 0 0 24px;
  color: #4a3f35;
  font-size: 1.05rem;
  line-height: 1.7;
`

const CardRow = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`

const Card = styled.article`
  padding: 18px 20px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid #eadfd2;
`

const CardTitle = styled.h3`
  margin: 0 0 8px;
  color: #4f6b5b;
  font-size: 1rem;
`

const CardText = styled.p`
  margin: 0;
  color: #5b5148;
  line-height: 1.6;
`

const AboutPage = () => {
  return (
    <Wrapper>
      <Eyebrow>Styled Components Demo</Eyebrow>
      <Title>About This UI Example</Title>
      <Lead>
        This page is intentionally isolated from the Material UI styling used in the
        rest of the app. It exists as a clean example of how `styled-components`
        can be used for layout, typography, and cards without affecting the main UI.
      </Lead>

      <CardRow>
        <Card>
          <CardTitle>Why isolate it?</CardTitle>
          <CardText>
            It lets you experiment with another styling approach without turning the
            whole project into a mixed styling mess.
          </CardText>
        </Card>

        <Card>
          <CardTitle>What is safe to mix?</CardTitle>
          <CardText>
            Separate pages or small demo areas are fine. Problems usually come from
            styling the same component through multiple systems at once.
          </CardText>
        </Card>

        <Card>
          <CardTitle>Good use case</CardTitle>
          <CardText>
            Use this as a reference commit for future experiments or for comparing
            `styled-components` with MUI `sx` in a controlled way.
          </CardText>
        </Card>
      </CardRow>
    </Wrapper>
  )
}

export default AboutPage
