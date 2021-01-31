import React from 'react'
import {TouchableOpacity, Text, StyleSheet} from 'react-native'
import { useFonts } from 'expo-font'

const Button = (props) => {
    useFonts({
        'Ubuntu-Bold': require('../../assets/fonts/Ubuntu-Bold.ttf'),
        'Ubuntu-Regular': require('../../assets/fonts/Ubuntu-Regular.ttf')
    })
    return (
        <TouchableOpacity onPress={props.onPress} style={props.style}>
            <Text style={styles.text} >{props.children}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    text: { 
        color: 'white', 
        fontFamily: 'Ubuntu-Regular', 
        fontSize: 24, 
        textAlign: 'center' 
    }
})

export default Button

