import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useFonts } from 'expo-font'

const Select = props => {

    const [current, setCurrent] = useState('')

    useFonts({
        'Ubuntu-Bold': require('../../assets/fonts/Ubuntu-Bold.ttf'),
        'Ubuntu-Regular': require('../../assets/fonts/Ubuntu-Regular.ttf')
    })

    useEffect(() => {
        setCurrent(props.current)
    }, [])

    const handlePress = opt => () => {

        if (Array.isArray(current)) {
            let newCurrent = current
            const i = current.indexOf(opt)
            if (i >= 0) {
                newCurrent = [...current]
                newCurrent.splice(i, 1)
            } else {
                newCurrent = [...current, opt]
            }
            setCurrent(newCurrent)

            if (props.onSelect) {
                props.onSelect(newCurrent)
            }
        } else {
            setCurrent(opt)

            if (props.onSelect) {
                props.onSelect(opt)
            }
        }
    }
    const checkItem = item => {
        if (Array.isArray(current)) {
            return current.indexOf(item) >= 0
        } else {
            return current === item
        }
        //console.log(Array.isArray(props.current))
    }

    return (
        <View >
            <Text style={stylesSelect.label}>{props.label}</Text>
            <View style={stylesSelect.conteiner}>
                {props.options.map(option => {
                    let id = ''
                    let label = ''
                    if (typeof option === 'string') {
                        id = option
                        label = option
                    } else if (typeof option === 'object') {
                        id = option.id
                        label = option.label
                    }

                    return (
                        <TouchableOpacity
                            key={id}
                            style={[checkItem(id) ? stylesSelect.optSelected : null]}
                            onPress={handlePress(id)}
                        >
                            <Text style={stylesSelect.optLabel}>{label}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View>
    )
}

const stylesSelect = StyleSheet.create({
    conteiner: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    label: {
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Ubuntu-Regular',
        fontSize: 24
    },
    opt: {
        padding: 8
    },
    optSelected: {
        backgroundColor: 'rgba(255,255,255,0.6)',
    },
    optLabel: {
        color: 'white',
        fontFamily: 'Ubuntu-Regular',
        fontSize: 24,
        opacity: 1
    }
})

export default Select