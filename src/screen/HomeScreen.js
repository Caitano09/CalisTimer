import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useFonts } from 'expo-font'
import AppLoading from 'expo-app-loading'
import Button from '../components/Button'

const HomeScreen = props => {
    let [fontsLoaded] = useFonts({
        'Ubuntu-Bold': require('../../assets/fonts/Ubuntu-Bold.ttf'),
        'Ubuntu-Regular': require('../../assets/fonts/Ubuntu-Regular.ttf')
    })

    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return (
            <View style={styles.conteiner}>
                <Text style={styles.logo}>CalisTimer</Text>
                <Button style={styles.btn} onPress={() => props.navigation.navigate('EMOM')}>EMOM</Button>
                <Button style={styles.btn} onPress={() => props.navigation.navigate('AMRAP')}>AMRAP</Button>
                <Button style={styles.btn} onPress={() => props.navigation.navigate('Isometria')}>Isometria</Button>
                <Button style={styles.btn} onPress={() => props.navigation.navigate('About')}>Sobre</Button>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    conteiner: {
        flex: 1,
        backgroundColor: '#D6304A',
    },
    logo: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 48,
        textAlign: 'center',
        color: 'white',
        marginTop: 100,
        marginBottom: 100
    },
    btn: {
        padding: 20
    }
})

HomeScreen.navigationOptions = {
    headerShown: false
}
export default HomeScreen