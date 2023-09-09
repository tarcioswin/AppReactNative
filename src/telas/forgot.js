import { View, Text, Image, TextInput, Dimensions, StyleSheet } from 'react-native'
import React, { useState,useEffect, useLayoutEffect } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../../components/colors';
import Button from '../../components/Button';
import Boi from '../../assets/logoboi.png';

const Forgot = ({ navigation }) => {


  // Add a state to manage the background color
  const [backgroundColor, setBackgroundColor] = useState(COLORS.white);
  const [boiHeaderImageWidth, setBoiHeaderImageWidth] = useState(30);
  const [boiContentImageWidth, setBoiContentImageWidth] = useState(100);

  useLayoutEffect(() => {
    const windowWidth = Dimensions.get('window').width;
    // You can adjust the header image size here based on your preference
    const headerImageWidth = 200;
    setBoiHeaderImageWidth(headerImageWidth);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitleContainer}>
          <Image source={Boi} style={[styles.boiImage, { width: boiHeaderImageWidth, height: boiHeaderImageWidth }]} />
          <Text style={styles.headerTitle}>Recuperar senha</Text>
        </View>
      ),
      headerTintColor: 'black',
      headerStyle: { backgroundColor: "white" },
      headerTitleStyle: { fontWeight: 'bold' }
    });
  }, [backgroundColor]);
    

 return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, marginHorizontal: 1 }}>
      
      

         <View style={{ marginBottom: 1 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 1,
                        fontWeight: 'bold',
                        paddingLeft: 12,
                    }}>Email</Text>
                    <View style={{
                        width: "95%",
                        alignSelf: "center", 
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            placeholder='Entre com seu endereço de email cadastrado'
                            placeholderTextColor={COLORS.black}
                            keyboardType='email-address'
                            style={{
                                width: "100%"
                            }}
                        />
                    </View>
                </View>




                <Button
                    title="Enviar"
                    filled
                    borderColor="#35AAFF"
                    style={{
                        marginTop: 10,
                        marginBottom: 4,
                        backgroundColor: '#35AAFF',    
                        fontWeight: 'bold', 
                        width: "95%",
                        alignSelf: "center",                   
                    }}
                />



                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: COLORS.black,
                            marginHorizontal: 10,
                        }}
                    />

                </View>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginVertical: 22
                }}>
                    <Text style={{ fontSize: 16, color: COLORS.black }}>Um link de acesso será enviado para seu email cadastrado!</Text>
                    
                </View>
            </View>
        </SafeAreaView>
    )
}



const styles = StyleSheet.create({
    headerTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    boiImage: {
      borderRadius: 15,
      alignSelf: 'center', // Center the image horizontally
      marginVertical: 0, // Add some margin to the image
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      left: 10
    },
    titleText: {
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 0,
      alignSelf: 'center', // Center the text horizontally
    },
  });


export default Forgot


