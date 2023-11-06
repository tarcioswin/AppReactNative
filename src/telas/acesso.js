import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../components/colors';
import Boi from '../../assets/logoboi.png';
import axios from 'axios';
import { StackedAreaChart, Grid, YAxis, XAxis, AreaChart, LineChart } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import * as scale from 'd3-scale';
import ModalDropdown from 'react-native-modal-dropdown';
import moment from 'moment';

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
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14); // Set the date to 2 weeks in the past

        const chartDataArray = [];
        Object.entries(timeSeries)
          .filter(([date, _]) => new Date(date) >= twoWeeksAgo) // Filter out dates that are more than 2 weeks old
          .forEach(([date, dataPoint]) => {
            const selectedValue = parseFloat(dataPoint[selectedInfo]);
            chartDataArray.push({ date, value: selectedValue });
          });
        setChartData(chartDataArray.reverse()); // The API returns dates in descending order, so we reverse it for the chart

        const latestData = Object.values(timeSeries)[0];
        const latestDollarPrice = parseFloat(latestData[selectedInfo]);
        setDollarPrice(latestDollarPrice);
        setShowGraph(true); // Show the graph after fetching data
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };



  const yValues = chartData.map((item) => item.value);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);




  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1 }}>
        <Text style={styles.centeredText}>
          (IBM) {selectedInfo.split('. ')[1]} stock quote last day: {dollarPrice}
        </Text>




        <View style={styles.dropdownContainer}>
          <ModalDropdown
            options={['Select an item', ...infoOptions]}
            defaultValue="Select an item"
            textStyle={styles.dropdownText}
            dropdownTextStyle={styles.dropdownItemText}
            initialScrollIndex={1} // Ensure this index is within the range of your list items
            onSelect={(index, value) => {
              if (index === 0) {
                setSelectedInfo(null);
              } else {
                setSelectedInfo(value);
              }
            }}
          />
        </View>


        <View
          style={{
            marginTop: 10, marginBottom: 4, backgroundColor: '#35AAFF', fontWeight: 'bold', width: '60%', alignSelf: 'center',
            borderRadius: 80,
          }}
        ><Button title="Show Graph" onPress={fetchData} />
        </View>




        {showGraph && (
          <View style={{ flexDirection: 'row', height: 500, paddingVertical: 0 }}>
            <YAxis
              data={chartData}
              yAccessor={({ item }) => item.value}
              contentInset={{ top: 30, bottom: 100 }}
              svg={{
                fill: 'black',
                fontSize: 12,
                fontWeight: 'bold', // Bold font weight for X axis labels
              }}
              numberOfTicks={8}
              formatLabel={(value) => `${value}`}
              style={{ marginBottom: 10, marginLeft: 10 }}
            />
            <View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
              <LineChart
                style={{ flex: 1 }}
                data={chartData}
                curve={shape.curveNatural}
                svg={{
                  stroke: 'rgb(255, 0, 0)', // Line color (red)
                  strokeWidth: 2, // Line width
                  strokeOpacity: 0.7, // Line opacity (0 to 1)
                  fill: 'rgba(255, 0, 0, 0.2)', // Area under the line color
                  fillOpacity: 1, // Area under the line opacity (0 to 1)
                }}
                showGrid={true}
                contentInset={{ top: 30, bottom: 30 }}
                yAccessor={({ item }) => item.value}
                xScale={scale.scaleTime}
                xAccessor={({ item }) => new Date(item.date)}
                yMin={yMin}
                yMax={yMax}
              >
                <Grid />
              </LineChart>
              <XAxis
                style={{ height: 80, marginHorizontal: -100 }}
                data={chartData}
                formatLabel={(value, index) => moment(chartData[index].date).format('DD/MM')}
                contentInset={{ left: 100, right: 110}} // Increased insets
                svg={{
                  fontSize: 14,
                  fill: 'black',
                  fontWeight: 'bold',
                  rotation: 90,
                  originY: 35,
                  y: 1, // Potentially increase this if labels are still cut off
                }}
                scale={scale.scaleTime}
                numberOfTicks={6}
              />

            </View>
          </View>
        )}


      </View>
    </SafeAreaView>
  );
};





const styles = StyleSheet.create({
  centeredText: {
    textAlign: 'center', // Horizontally center the text
    alignSelf: 'center', // Center the text within its container
    fontSize: 16,
    fontWeight: 'bold',
    // Add any other styles you need
  },
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




