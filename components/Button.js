import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import COLORS from './colors'

const Button = (props) => {
    const filledBgColor = props.color || COLORS.primary;
    const outlinedColor = COLORS.white;
    const bgColor = props.filled ? filledBgColor : outlinedColor;
    const textColor = props.filled ? COLORS.white : COLORS.primary;

    return (
        <TouchableOpacity
            style={{
                ...styles.button,
                ...{ backgroundColor: bgColor, borderColor: props.borderColor },
                ...props.style
            }}
            onPress={props.onPress}
        >
            <Text style={{ fontSize: 18, color: textColor, fontWeight: 'bold' }}>
                {props.title}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingBottom: 16,
        paddingVertical: 10,
        borderWidth: 2,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default Button
