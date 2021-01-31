import React from 'react'
import { View, Text, StyleSheet, } from 'react-native'
import { useFonts } from 'expo-font'

const Title = props => {
    useFonts({
        'Ubuntu-Bold': require('../../assets/fonts/Ubuntu-Bold.ttf'),
        'Ubuntu-Regular': require('../../assets/fonts/Ubuntu-Regular.ttf')
    })

    return (
        <View style={[styles.conteiner, props.style]}>
            <Text style={styles.title}>{props.title}</Text>
            <Text style={styles.subTitle}>{props.subTitle}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    conteiner:{
        paddingTop: 20,
        paddingBottom: 20
    },
    title: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 48,
        color: 'white',
        textAlign: 'center'
    },
    subTitle: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 14,
        color: 'white',
        textAlign: 'center'
    }
})

export default Title