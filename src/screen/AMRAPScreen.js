import React, { useState, useEffect } from 'react'
import {Platform, View, Keyboard, StyleSheet, Image, Text, TextInput, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native'
import { useFonts } from 'expo-font'
import {activateKeepAwake, deactivateKeepAwake} from 'expo-keep-awake'
import { Audio } from 'expo-av'
import Select from '../components/Select'
import Title from '../components/Title'
import Time from '../components/Time'
import ProgressBar from '../components/ProgressBar'
import BackgroundProgress from '../components/BackgroundProgress'
import useInterval from '../../utils/useInterval'

const AMRAPScreen = props => {

    const [keyboardIsVisible, setKeyboardIsVisible] = useState(false)

    const [alerts, setAlerts] = useState([0, 15])
    const [time, setTime] = useState('2')
    const [countDown, setCountDown] = useState(0)//true(1) or false(0)
    const [count, setCount] = useState(0)
    const [countDownValue, setCountDownValue] = useState(5)
    const [isRunning, setIsRunning] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [sound, setSound] = useState()
    const [repetitions, setRepetitions] = useState(0)

    const opacity = isPaused ? 1 : 0.5
    const behavior = Platform.OS !== 'ios' ? 'height' : 'padding'
    const media = repetitions > 0 ? count / repetitions : 0
    const estimated = media > 0 ? Math.floor((parseInt(time) * 60) / media) : 0

    const [clickedButton, setClickedButton] = useState(0)// (0) no click (1) stop (2) play
    
    const percMinute = count % 60 === 0 && count > 0 ? 100 : ((count % 60) / 60)*100 //multiplos de 60 o resto é 0 substitui por 100 para preencher a tela toda
    let prevPercMinute = (((count - 1) % 60) / 60) *100
    prevPercMinute = clickedButton === 1 || clickedButton === 2 ? percMinute : prevPercMinute//feito para resolver bug da tela
 
    const percTime = parseInt(((count / 60) / parseInt(time)) * 100)
    let prevPercTime = parseInt((((count - 1) / 60) / parseInt(time)) * 100)
    prevPercTime = clickedButton === 1 || clickedButton === 2 ? percTime : prevPercTime//feito para resolver bug da tela

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
        let rest = count % 60

        if (alerts.indexOf(0) === 0) {
            //tocar alerta a cada um 1:00 
            if (rest === 59) {
                rest = 0
            } else if (rest === 0) {
                rest = 1
            }
        }

        if (alerts.indexOf(rest === 0 ? rest : rest + 1) >= 0) {//para tocar no segundo exato
            playSound()
            setClickedButton(2)
        }
        if (countDown === 1) {
            if (rest >= 54 && rest < 59) {
                playSound()
                setClickedButton(2)
            }
        }
    }


    const decrement = () => {
        if (repetitions > 0) {
            setRepetitions(repetitions - 1)
            setClickedButton(2)
        }
    }

    const increment = () => {
        setRepetitions(repetitions + 1)
        setClickedButton(2)
    }

    const stop = () => {
        setIsPaused(!isPaused)
        setClickedButton(clickedButton === 1 ? 2 : 1)
    }

    const play = () => {
        if (alerts.indexOf(0) === 0) {
            playSound()//tocar alerta no 0
        }
        setCount(0)
        setCountDownValue(5)
        setIsRunning(true)
        setIsPaused(false)
        setRepetitions(0)
        setClickedButton(0)
    }

    const restart = () => {
        if (alerts.indexOf(0) === 0  && countDown === 0) {
            playSound()//tocar alerta no 0
        }
        if (isPaused) {
            setCount(0)
            setCountDownValue(5)
            setIsPaused(false)
            setRepetitions(0)
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
                    return
                } else {
                    if(countDownValue >= 1){
                        playSound()
                    }
                    setCountDownValue(countDownValue - 1)
                }
            } else {
                if (count !== (parseInt(time)) * 60) {
                    if (isPaused) {
                        return
                    } else {
                        setClickedButton(clickedButton === 2? 0: clickedButton)//corringindo bug da tela
                        setCount(count + 1)
                        playAlert()
                    }
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
                        <Title title="AMRAP" subTitle="As Many Repetitions As Possible" style={{ paddingTop}}></Title>
                    </View>
                    {repetitions !== 0 ?
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <Time time={media} type='text3'></Time>
                                <Text style={styles.subTitle}>Por Repetição</Text>
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.count}>{estimated}</Text>
                                <Text style={styles.subTitle}>Repetições</Text>
                            </View>
                        </View>
                        : null}

                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Time time={count}></Time>
                        <ProgressBar percentage={percTime} prevPercentage={prevPercTime} />
                        <Time time={parseInt(time) * 60 - count} type='text2' appendedText=' Restantes'></Time>
                    </View>

                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        {
                            countDownValue > 0 && countDown === 1 ?
                                <Text style={styles.countdown}>{countDownValue}</Text>
                                :
                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                    <TouchableOpacity onPress={() => decrement()}>
                                        <Text style={styles.countdown}>-</Text>
                                    </TouchableOpacity>

                                    <Text style={styles.countdown}>{repetitions}</Text>

                                    <TouchableOpacity onPress={() => increment()}>
                                        <Text style={styles.countdown}>+</Text>
                                    </TouchableOpacity>
                                </View>
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
                    <Title title="AMRAP" subTitle="As Many Repetitions As Possible" style={{ paddingTop}}></Title>
                    <Image style={{ width: 49, height: 49, alignSelf: 'center', marginBottom: 17 }} source={require('../../assets/settings-cog.png')} />
                    <Select
                        current={alerts}
                        label='Alertas:'
                        onSelect={opt => setAlerts(opt)}
                        options={[{
                            id: 0,
                            label: '0s'
                        },
                        {
                            id: 15,
                            label: '15s'
                        },
                        {
                            id: 30,
                            label: '30s'
                        },
                        {
                            id: 45,
                            label: '45s'
                        }]}
                    />
                    <Select
                        current={countDown}
                        label='Contagem Regressiva:'
                        onSelect={opt => setCountDown(opt)}
                        options={[{
                            id: 1,
                            label: 'sim'
                        },
                        {
                            id: 0,
                            label: 'não'
                        }]}
                    />
                    <Text style={styles.label}>Quantos Minutos:</Text>
                    <TextInput style={styles.input} keyboardType='numeric' value={time} onChangeText={text => setTime(text)} />
                    <Text style={styles.label}>Minutos</Text>
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
    },
    count: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 32,
        color: 'white',
        textAlign: 'center'
    },
    subTitle: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 15,
        textAlign: 'center',
        color: 'white'
    }
})

AMRAPScreen.navigationOptions = {
    headerShown: false
}

export default AMRAPScreen