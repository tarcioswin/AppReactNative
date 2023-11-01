import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../components/colors';
import Boi from '../../assets/logoboi.png';
import axios from 'axios';
import { LineChart } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import DropDownPicker from 'react-native-dropdown-picker';
import ModalDropdown from 'react-native-modal-dropdown';

const Acesso = ({ navigation }) => {
  const [backgroundColor, setBackgroundColor] = useState(COLORS.white);
  const [boiHeaderImageWidth, setBoiHeaderImageWidth] = useState(30);
  const [boiContentImageWidth, setBoiContentImageWidth] = useState(100);
  const [dollarPrice, setDollarPrice] = useState('');
  const [chartData, setChartData] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState('close'); // Default selected option
  const [infoOptions] = useState(['1. open', '2. high', '3. low', '4. close', '5. volume']);
  const [showGraph, setShowGraph] = useState(false);

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

  const fetchData = async () => {
    try {
      const url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo';
      const response = await axios.get(url);
      const timeSeries = response.data['Time Series (Daily)'];
      
      if (timeSeries) {
        const chartDataArray = [];
        Object.keys(timeSeries).forEach((date) => {
          const dataPoint = timeSeries[date];
          const selectedValue = parseFloat(dataPoint[selectedInfo]);
          chartDataArray.push(selectedValue);
        });
        setChartData(chartDataArray);

        const latestData = Object.values(timeSeries)[0];
        const latestDollarPrice = parseFloat(latestData[selectedInfo]);
        setDollarPrice(latestDollarPrice);
        setShowGraph(true); // Show the graph after fetching data
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1 }}>
        <Image source={Boi} style={[styles.boiImage, { width: boiContentImageWidth, height: boiContentImageWidth }]} />
        <Text style={styles.titleText}>Cotação do Boi</Text>
        <Text>(IBM) {selectedInfo} stock quote: {dollarPrice || 'Loading...'}</Text>


<View style={styles.dropdownContainer}>
  <ModalDropdown
    options={['Select an item', ...infoOptions]}
    defaultValue="Select an item"
    textStyle={styles.dropdownText}
    dropdownTextStyle={styles.dropdownItemText}
    onSelect={(index, value) => {
      if (index === 0) {
        // Handle the case where the user selects the placeholder
        setSelectedInfo(null); // You can set it to null or some other value
      } else {
        setSelectedInfo(value);
      }
    }}
  />
</View>


        <View
          style={{
            marginTop: 10,
            marginBottom: 4,
            backgroundColor: '#35AAFF',
            fontWeight: 'bold',
            width: '60%',
            alignSelf: 'center',
            borderRadius: 80,
          }}
        >
          <Button title="Show Graph" onPress={fetchData} />
        </View>




        {/* Line chart (displayed when showGraph is true) */}
        {showGraph && (
          <LineChart
            style={{ flex: 1 }}
            data={chartData}
            contentInset={{ top: 20, bottom: 20 }}
            svg={{ stroke: 'rgb(255, 0, 0)' }}
            curve={shape.curveBasis}
            yMin={0}
            yMax={Math.max(...chartData) + 10}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dropdownView: {
    width: 130, // Adjust the width as needed
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownText: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  dropdownContainer: {
    width: 150,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownItemText: {
    fontSize: 16,
    padding: 10,
  },
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
    alignSelf: 'flex-end',
    marginTop: 'auto',
    marginBottom: 16,
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Acesso;
