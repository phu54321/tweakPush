import React from 'react'
import { Font } from 'expo'
import { Container, Content, Text, Header, Left, Button, Icon, Body, Title, Right } from 'native-base'

export default class App extends React.Component {
  async componentWillMount () {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf')
    })
  }

  render () {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon name='refresh' />
            </Button>
          </Left>
          <Body>
            <Title>TweakPush</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <Text>
            I have changed the text color.
          </Text>
        </Content>
      </Container>
    )
  }
}
