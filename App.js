import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {Card, Button} from 'react-native-elements'

// import Ball from './src/Ball'
import Deck from './src/Deck'
import DATA from './mock'

export default class App extends React.Component {
    renderCard = (item) => {
        return (
            <Card key={item.id}
                  title={item.text}
                  image={{uri: item.uri}}
            >
                <Text style={{marginBottom: 10}}>
                    {item.text}
                </Text>
                <Button icon={{name: 'code'}}
                        backgroundColor={'#03A9F4'}
                        title={'View Now!'}/>
            </Card>
        )
    }

    renderNoMoreCards = () => {
        return (
            <Card title={'All done!'}>
                <Text style={{marginBottom: 10}}>
                    {'There is no more content!'  }
                </Text>
            </Card>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <Deck data={DATA}
                      renderCard={this.renderCard}
                      renderNoMoreCards={this.renderNoMoreCards}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 30,
    },
});
