import React from 'react'
import {View, Animated, Text} from 'react-native'

const ProgressBar = props =>{
    const {color, percentage, prevPercentage, height} = props   
    //impedir que comece com -1
    const width = new Animated.Value(prevPercentage >= 0 ? prevPercentage : 0)

    Animated.timing(width, {
        toValue: percentage,
        duration: 500,
        useNativeDriver: false
    }).start()

    const w = width.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%']
    })
    
    return(
        <View >
            <Animated.View style={{
                width: w,//percentage ? percentage+'%' : '1%', 
                height: height? height : 3, 
                backgroundColor: color? color : 'white'}}/>
                <Text></Text>
        </View>
    )
}

export default ProgressBar