import React, { useState, useEffect } from 'react'
import {Platform ,View, Keyboard, StyleSheet, Image, Text, TextInput, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native'
import { useFonts } from 'expo-font'
import { Audio } from 'expo-av'
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake'
import Select from '../components/Select'
import Title from '../components/Title'
import Time from '../components/Time'
import ProgressBar from '../components/ProgressBar'
import BackgroundProgress from '../components/BackgroundProgress'
import useInterval from '../../utils/useInterval'

const IsometriaScreen = props => {

    const [keyboardIsVisible, setKeyboardIsVisible] = useState(false)

    const [goal, setGoal] = useState(1)
    const [time, setTime] = useState('20')
    const [countDown, setCountDown] = useState(1)//true(1) or false(0)
    const [count, setCount] = useState(0)
    const [countDownValue, setCountDownValue] = useState(10)
    const [sound, setSound] = useState()
    const [isRunning, setIsRunning] = useState(false)
    const [isPaused, setIsPaused] = useState(false)

    const [clickedButton, setClickedButton] = useState(0)// (0) no click (1) stop (2) play

    const percMinute = time === '0' ? 0 : (count / parseInt(time))*100
    let prevPercMinute = time === '0' ? 0 : ((count - 1) / parseInt(time))*100
    prevPercMinute = clickedButton === 1 || clickedButton === 2 ? percMinute : prevPercMinute//feito para resolver bug da tela
    
    const opacity = isPaused ? 1 : 0.5
    const behavior = Platform.OS !== 'ios' ? 'height' : 'padding'
    const remaining = parseInt(time) >= count ? parseInt(time) - count : 0 // restante


    const playSound = async () => {
        //console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(
            require('../../assets/sounds/alert.wav')
        );
        setSound(sound);

        //console.log('Playing Sound');
        await sound.playAsync();
    }

    useEffect(() => {
        return sound
            ? () => {
                //console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);


    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', () => setKeyboardIsVisible(true))
        Keyboard.addListener('keyboardDidHide', () => setKeyboardIsVisible(false))

        // returned function will be called on component unmount
        return () => {
            Keyboard.removeAllListeners('keyboardDidShow')
            Keyboard.removeAllListeners('keyboardDidHide')
        }
    }, [])

    const playAlert = () => {
        if (countDown === 1) {
            if (count >= parseInt(time) - 6 && count < parseInt(time)) {
                setClickedButton(2)
                playSound()
            }
        }
    }

    const stop = () => {
        setIsPaused(!isPaused)
        setClickedButton(clickedButton === 1 ? 2 : 1)
        // setIsRunning(false)
    }

    const play = () => {
        const timeAux = goal === 0 ? '0' : time //para a opção LIVRE
        setTime(timeAux)
        setCount(0)
        setCountDownValue(5)
        setIsRunning(true)
        setIsPaused(false)
        setClickedButton(0)

    }

    const restart = () => {
        if (isPaused) {
            setCount(0)
            setCountDownValue(5)
            setIsPaused(false)
            setClickedButton(0)
        }
    }

    const back = () => {
        if (isPaused) {
            setIsPaused(false)
            setIsRunning(false)
        }
    }

    //Executando play
    useInterval(() => {
        if (isRunning) {
            if (countDownValue !== 0 && countDown === 1) {
                if (isPaused) {
                    return;
                } else {
                    if(countDownValue >= 1){
                        playSound()
                    }
                    setCountDownValue(countDownValue - 1)
                }

            } else {
                if (isPaused) {
                    return;
                } else {
                    setClickedButton(clickedButton === 2? 0: clickedButton)//corringindo bug da tela
                    setCount(count + 1)
                    playAlert()
                }
            }
        }
    }, 1000);

    useFonts({
        'Ubuntu-Bold': require('../../assets/fonts/Ubuntu-Bold.ttf'),
        'Ubuntu-Regular': require('../../assets/fonts/Ubuntu-Regular.ttf')
    })

    if (isRunning) {
        activateKeepAwake()
        const paddingTop = Platform.Os === 'ios' ? keyboardIsVisible ? 10 : 100 : keyboardIsVisible ? 10 : 50
        return (
            <BackgroundProgress percentage={percMinute} prevPercentage={prevPercMinute}>
                <View style={{ flex: 1, justifyContent: 'center', width: '100%', height: '100%' }}>
                    <View style={{ flex: 1 }}>
                        <Title title="Isometria" style={{ paddingTop }}></Title>
                    </View>

                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Time time={count}></Time>
                        {goal === 1 ? 
                            <Time time={remaining} type='text2' appendedText=' Restantes'></Time>
                            : null
                        }
                    </View>

                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        {
                            countDownValue > 0 && countDown === 1 ?
                                <Text style={styles.countdown}>{countDownValue}</Text>
                                : null
                        }
                        <View style={{ flexDirection: 'row', marginBottom: 40, justifyContent: 'space-evenly' }}>
                            <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => back()}>
                                <Image style={{ width: 29, height: 29, opacity }} source={require('../../assets/left-arrow.png')} />
                            </TouchableOpacity>

                            <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => stop()}>
                                {isPaused ?
                                    <Image style={{ width: 62, height: 62 }} source={require('../../assets/btn-play.png')} />
                                    : <Image style={{ width: 62, height: 62 }} source={require('../../assets/btn-stop.png')} />
                                }
                            </TouchableOpacity>

                            <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => restart()}>
                                <Image style={{ width: 29, height: 29, opacity }} source={require('../../assets/restart.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </BackgroundProgress>
        )
    } else {
        deactivateKeepAwake()
        const paddingTop = Platform.Os === 'ios' ? keyboardIsVisible ? 20 : 200 : keyboardIsVisible ? 20 : 100
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={behavior}>
                <ScrollView style={styles.conteiner}>
                    <Title title="Isometria" style={{paddingTop}}></Title>
                    <Image style={{ width: 49, height: 49, alignSelf: 'center', marginBottom: 17 }} source={require('../../assets/settings-cog.png')} />
                    <Select
                        current={goal}
                        label='Objetivo:'
                        onSelect={opt => setGoal(opt)}
                        options={[{
                            id: 0,
                            label: 'Livre'
                        },
                        {
                            id: 1,
                            label: 'Bater Tempo'
                        }]}
                    />
                    {goal === 1 ?
                     <React.Fragment>
                        <Text style={styles.label}>Quantos Segundos:</Text>
                        <TextInput style={styles.input} keyboardType='numeric' value={time} onChangeText={text => setTime(text)} />
                    </React.Fragment> 
                    : null }

                    <View style={{ flexDirection: 'row', marginBottom: 40, justifyContent: 'space-evenly' }}>
                        <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => props.navigation.goBack()}>
                            <Image style={{ width: 29, height: 29 }} source={require('../../assets/left-arrow.png')} />
                        </TouchableOpacity>

                        <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => play()}>
                            <Image style={{ width: 62, height: 62 }} source={require('../../assets/btn-play.png')} />
                        </TouchableOpacity>
                        <Text style={/*componenete sumido*/{color: '#D6304A'}}>Testar</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    conteiner: {
        flex: 1,
        backgroundColor: '#D6304A',
    },
    label: {
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Ubuntu-Regular',
        fontSize: 24
    },
    input: {
        textAlign: 'center',
        color: 'black',
        fontFamily: 'Ubuntu-Regular',
        fontSize: 48
    },
    countdown: {
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Ubuntu-Bold',
        fontSize: 100
    }
})

IsometriaScreen.navigationOptions = {
    headerShown: false
}

export default IsometriaScreen