import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../components/colors';
import Boi from '../../assets/logoboi.png';

const Acesso = ({ navigation }) => {
  const [backgroundColor, setBackgroundColor] = useState(COLORS.white);
  const [boiHeaderImageWidth, setBoiHeaderImageWidth] = useState(30);
  const [boiContentImageWidth, setBoiContentImageWidth] = useState(100);

  useLayoutEffect(() => {
    const windowWidth = Dimensions.get('window').width;
    const headerImageWidth = 200;
    setBoiHeaderImageWidth(headerImageWidth);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitleContainer}>
          <Image source={Boi} style={[styles.boiImage, { width: boiHeaderImageWidth, height: boiHeaderImageWidth }]} />
          <Text style={styles.headerTitle}>Cotação do Boi</Text>
        </View>
      ),
      headerTintColor: 'black',
      headerStyle: { backgroundColor: backgroundColor },
      headerTitleStyle: { fontWeight: 'bold' },
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('EditInformation');
          }}
          style={styles.editButton}
        >
          <Ionicons
            name="pencil-outline"
            size={20}
            color={COLORS.white}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.editButtonText}>Edit Inf. </Text>
        </TouchableOpacity>
      ),
    });
  }, [backgroundColor]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1 }}>
        <Image source={Boi} style={[styles.boiImage, { width: boiContentImageWidth, height: boiContentImageWidth }]} />
        <Text style={styles.titleText}>Cotação do Boi</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boiImage: {
    borderRadius: 15,
    alignSelf: 'center',
    marginVertical: 0,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    left: 10,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 0,
    alignSelf: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-end', // Align to the right
    marginTop: 'auto', // Vertically center
    marginBottom: 16, // Add some margin at the bottom
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Acesso;
