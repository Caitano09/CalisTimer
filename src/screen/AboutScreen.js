import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native'
import { useFonts } from 'expo-font'

const AboutScreen = props => {
    useFonts({
        'Ubuntu-Bold': require('../../assets/fonts/Ubuntu-Bold.ttf'),
        'Ubuntu-Regular': require('../../assets/fonts/Ubuntu-Regular.ttf')
    })
    const back = () =>{
        props.navigation.goBack()
    }
    const open = url => () =>{
        Linking.openURL(url)
    }
    return (
        <View style={styles.conteiner}>
            <Text style={styles.logo}>CalisTimer</Text>
            <Text style={styles.description}>
                Este aplicativo foi constrído durante as aulas do curso de ReactJS/React-Native do DevPleno, o devReactJS nos módulos de react-native.
            </Text>

            <TouchableOpacity onPress={open('https://github.com/Caitano09')}>
                <Image style={{ width: 196, height: 56 }} source={require('../../assets/devpleno.png')}></Image>
            </TouchableOpacity>

            <TouchableOpacity onPress={open('https://www.linkedin.com/in/daniel-caitano-9b81851b1/')}>
                <Image style={{ width: 182, height: 82 }} source={require('../../assets/devreactjs.png')}></Image>
            </TouchableOpacity>

            <TouchableOpacity style={{ alignSelf: 'center', marginRight: '50%' }} onPress={() => back()}>
                <Image style={{ width: 29, height: 29 }} source={require('../../assets/left-arrow.png')} />
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    conteiner: {
        flex: 1,
        backgroundColor: '#D6304A',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    logo: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 48,
        textAlign: 'center',
        color: 'white',
        marginTop: 100,
        marginBottom: 30,
    },
    description: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 24,
        color: 'white',
        margin: 20
    }
})

AboutScreen.navigationOptions = {
    headerShown: false
}
export default AboutScreen