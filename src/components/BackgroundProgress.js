import React from 'react'
import { Animated, View } from 'react-native'

const BackgroundProgress = props => {
    const percentage = Math.round(props.percentage)
    const prevPercentage = props.prevPercentage >= 0 ? Math.round(props.prevPercentage) : 0 //impedir que comece com -1
    
    //console.log(prevPercentage, percentage)  
    const height = new Animated.Value(prevPercentage > 100 ? 100 : prevPercentage)
    
    Animated.timing(height, {
        toValue: percentage > 100 ?  100 : percentage,
        Animated: 500,
        useNativeDriver: false
    }).start()

    const h = height.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%']
    })

    const h2 = height.interpolate({
        inputRange: [0, 100],
        outputRange: ['100%', '0%']
    })
    return (
        <View style={{ flex: 1}}>
            <View style={{flex: 1}}>
                <Animated.View style={{ backgroundColor: '#D6304A', width: '100%', height: h2}} />
                <Animated.View style={{ backgroundColor: '#2A0E12', width: '100%', height: h}} />
            </View>

            <View style={{flex: 1, width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, bottom: 0, right: 0, }}>
                {props.children}
            </View>
        </View>
    )
}

export default BackgroundProgress