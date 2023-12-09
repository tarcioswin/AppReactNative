import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import COLORS from '../../components/colors'; // Assuming this path is correct

const AppInfo = ({ navigation }) => {

    useEffect(() => {
        navigation.setOptions({
            headerTintColor: 'white',
            headerStyle: styles.headerStyle,
            headerTitle: 'Sobre o App'
        });
    }, [navigation]);


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>ArrobaTrends</Text>
                <Text style={styles.version}>Version 1</Text>
                <Text style={styles.creators}>Creators:</Text>
                <Text style={styles.name}>Eng Tarcisio Pinheiro</Text>
                <Text style={styles.name}>Eng. Breno Pantoja</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: '#48D1CC',  // Background color of the header
        elevation: 4,                // Shadow under the header for Android
        shadowOpacity: 0.3,          // Shadow opacity for iOS
        shadowRadius: 3,             // Shadow radius for iOS
        shadowOffset: { height: 2, width: 0 },  // Shadow offset for iOS
        borderBottomWidth: 0,        // Remove border bottom if needed
        height: 60,                  // Height of the header
        // Additional styles as needed
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    content: {
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: 5,
    },
    version: {
        fontSize: 18,
        color: COLORS.darkGrey,
        marginBottom: 15,
    },
    creators: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: 5,
    },
    name: {
        fontSize: 18,
        color: COLORS.black,
        marginBottom: 5,
    },
});

export default AppInfo;
