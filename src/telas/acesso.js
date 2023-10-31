import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../components/colors';
import Boi from '../../assets/logoboi.png';
import axios from 'axios';
import { LineChart } from 'react-native-svg-charts';
import * as shape from 'd3-shape';

const Acesso = ({ navigation }) => {
  const [backgroundColor, setBackgroundColor] = useState(COLORS.white);
  const [boiHeaderImageWidth, setBoiHeaderImageWidth] = useState(30);
  const [boiContentImageWidth, setBoiContentImageWidth] = useState(100);
  const [dollarPrice, setDollarPrice] = useState('');
  const [chartData, setChartData] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo';
        const response = await axios.get(url);
        const timeSeries = response.data['Time Series (Daily)'];
        if (timeSeries) {
          const chartDataArray = [];
          Object.keys(timeSeries).forEach((date) => {
            const dataPoint = timeSeries[date];
            const closeValue = parseFloat(dataPoint['5. volume']);
            chartDataArray.push(closeValue);
          });
          setChartData(chartDataArray);

          const latestData = Object.values(timeSeries)[0];
          const latestDollarPrice = parseFloat(latestData['4. close']);
          setDollarPrice(latestDollarPrice);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1 }}>
        <Image source={Boi} style={[styles.boiImage, { width: boiContentImageWidth, height: boiContentImageWidth }]} />
        <Text style={styles.titleText}>Cotação do Boi</Text>
        <Text>(IBM) close stock quote: {dollarPrice || 'Loading...'}</Text>

        {/* Line chart */}
        <LineChart
          style={{ flex: 1 }}
          data={chartData}
          contentInset={{ top: 20, bottom: 20 }}
          svg={{ stroke: 'rgb(255, 0, 0)' }}
          curve={shape.curveBasis}
          yMin={0}
          yMax={Math.max(...chartData) + 10}
        />
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
