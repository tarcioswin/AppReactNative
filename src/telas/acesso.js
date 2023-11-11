import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../components/colors';
import axios from 'axios';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryCursorContainer, VictoryLabel } from 'victory-native';

const Acesso = ({ navigation }) => {
  const [backgroundColor] = useState(COLORS.white);
  const [Price, setPrice] = useState('');
  const [chartData, setChartData] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState('1. open');
  const [selectedInfoTime, setSelectedInfoTime] = useState('Daily');
  const infoOptions = ['1. open', '2. high', '3. low', '4. close', '5. volume'];
  const timeSeriesOptions = ['Daily', 'Weekly', 'Monthly', 'Intraday'];
  const [showGraph, setShowGraph] = useState(false);
  const [openPrice, setOpenPrice] = useState('');
  const [highPrice, setHighPrice] = useState('');
  const [lowPrice, setLowPrice] = useState('');
  const [closePrice, setClosePrice] = useState('');
  const [volume, setVolume] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerTintColor: 'black',
      headerStyle: styles.headerStyle,
      headerTitleStyle: { fontWeight: 'bold' },
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('EditInformation')} style={styles.editButton}>
          <Ionicons name="pencil-outline" size={20} color={COLORS.white} />
          <Text style={styles.editButtonText}>Edit Inf.</Text>
        </TouchableOpacity>
      ),
    });
  }, [backgroundColor, navigation]);

  useEffect(() => {
    fetchExchangeRate();
    fetchData(selectedInfoTime, selectedInfo);
  }, [selectedInfoTime, selectedInfo]);

  const fetchExchangeRate = async () => {
    try {
      const url_dollar = "http://economia.awesomeapi.com.br/json/last/USD-BRL";
      const response = await axios.get(url_dollar);
      setPrice(response.data.USDBRL.low);
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }
  };

  const fetchData = async (selectedInfoTime, selectedInfo) => {
    const apiKey = 'demo';
    const symbol = 'IBM';
    let functionType = 'TIME_SERIES_';
    let timeSeriesType = '';
    let url;

    switch (selectedInfoTime) {
      case 'Daily': functionType += 'DAILY'; break;
      case 'Weekly': functionType += 'WEEKLY'; break;
      case 'Monthly': functionType += 'MONTHLY'; break;
      case 'Intraday': functionType += 'INTRADAY'; url = `https://www.alphavantage.co/query?function=${functionType}&symbol=${symbol}&interval=5min&apikey=${apiKey}`; break;
      default: return;
    }

    if (selectedInfoTime !== 'Intraday') {
      url = `https://www.alphavantage.co/query?function=${functionType}&symbol=${symbol}&apikey=${apiKey}`;
    }

    try {
      const response = await axios.get(url);
      switch (selectedInfoTime) {
        case 'Daily': timeSeriesType = 'Time Series (Daily)'; break;
        case 'Weekly': timeSeriesType = 'Weekly Time Series'; break;
        case 'Monthly': timeSeriesType = 'Monthly Time Series'; break;
        case 'Intraday': timeSeriesType = 'Time Series (5min)'; break;
      }

      const timeSeries = response.data[timeSeriesType];
      if (timeSeries) {
        const latestEntry = Object.entries(timeSeries)[0];
        const latestData = latestEntry[1];
        setOpenPrice(latestData['1. open']);
        setHighPrice(latestData['2. high']);
        setLowPrice(latestData['3. low']);
        setClosePrice(latestData['4. close']);
        setVolume(latestData['5. volume']);
        setChartData(processData(timeSeries, selectedInfo));
        setShowGraph(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const processData = (timeSeries, selectedInfo) => {
    const startDate = getStartDate(selectedInfoTime);
    const infoKeySuffix = selectedInfo.split('. ')[1];
    const infoKey = infoKeySuffix.toLowerCase();

    return Object.entries(timeSeries)
      .filter(([date, _]) => new Date(date) >= startDate)
      .map(([date, dataPoint]) => {
        const dataPointKey = Object.keys(dataPoint).find(key => key.endsWith(infoKey));
        return { x: new Date(date), y: parseFloat(dataPoint[dataPointKey]) };
      })
      .reverse();
  };

  const getStartDate = (selectedInfoTime) => {
    const date = new Date();
    switch (selectedInfoTime) {
      case 'Daily': date.setDate(date.getDate() - 15); break;
      case 'Weekly': date.setMonth(date.getMonth() - 6); break;
      case 'Monthly': date.setFullYear(date.getFullYear() - 1); break;
      case 'Intraday': date.setDate(date.getMinutes() - 100); break;
    }
    return date;
  };

  // Function to handle press on stock data rows
  const handlePress = (value) => {
    setSelectedInfo(value);
    // Additional actions can be added here if needed
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1 }}>

        <View style={styles.stockInfoContainer}>
          <Text style={styles.titleText}>
            IBM {selectedInfoTime} Stock Quote
          </Text>
          <TouchableOpacity style={styles.stockDataRow} onPress={() => handlePress('1. open')}>
            <Text style={styles.stockLabel}>Open:</Text>
            <Text style={styles.stockValue}>{openPrice}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.stockDataRow} onPress={() => handlePress('2. high')}>
            <Text style={styles.stockLabel}>High:</Text>
            <Text style={styles.stockValue}>{highPrice}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.stockDataRow} onPress={() => handlePress('3. low')}>
            <Text style={styles.stockLabel}>Low:</Text>
            <Text style={styles.stockValue}>{lowPrice}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.stockDataRow} onPress={() => handlePress('4. close')}>
            <Text style={styles.stockLabel}>Close:</Text>
            <Text style={styles.stockValue}>{closePrice}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.stockDataRow} onPress={() => handlePress('5. volume')}>
            <Text style={styles.stockLabel}>Volume:</Text>
            <Text style={styles.stockValue}>{volume}</Text>
          </TouchableOpacity>
          <View style={styles.stockDataRow}>
            <Text style={styles.stockLabel}>Dollar/Real:</Text>
            <Text style={styles.stockValue}>{Price}</Text>
          </View>
        </View>

        <View style={styles.dropdownContainer}>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedInfoTime}
              onValueChange={(value) => setSelectedInfoTime(value)}
              style={styles.dropdownPicker}
              itemStyle={{ color: 'black', fontSize: 16 }}
            >
              {timeSeriesOptions.map((option, index) => (
                <Picker.Item key={index} label={option} value={option} />
              ))}
            </Picker>
          </View>
        </View>



        {showGraph && (
          <View style={styles.graphContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.graphTitle}> IBM {selectedInfo.replace(/^\d+\. /, "")} Stock Performance</Text>
            </View>
            <VictoryChart
              domainPadding={{ y: 50 }}
              height={400} // Height of the chart
              width={440}  // Width of the chart
              containerComponent={
                <VictoryCursorContainer
                  voronoiDimension="x"
                  cursorLabel={({ datum }) =>
                    `${datum.y.toFixed(2)}\n${selectedInfoTime === 'Intraday'
                      ? moment(datum.x).format('HH:mm') // Format for intraday data
                      : moment(datum.x).format('MMM D')}` // Format for daily, weekly, and monthly data
                  }
                  cursorLabelComponent={<VictoryLabel dx={-50} dy={-70} style={{ stroke: "red", fontSize: 14 }} />} // Moves the label up by 20 units
                />
              }>
              <VictoryLine
                animate={{
                  duration: 1500,
                  onLoad: { duration: 1500 }
                }}
                data={chartData}
                style={{
                  data: {
                    fill: "rgba(135, 206, 235, 0.4)", // Light blue fill with some transparency
                    stroke: "#1E90FF", // Darker blue stroke
                    strokeWidth: 3, // Thicker stroke width
                  }
                }}
              />
              <VictoryAxis // X axis
                tickCount={5}
                tickFormat={selectedInfoTime === 'Intraday'
                  ? (t) => moment(t).format('HH:mm') // Format for intraday data
                  : (t) => moment(t).format('MMM D')} // Format for daily, weekly, and monthly data
                style={{
                  grid: { stroke: "black", strokeWidth: 0.5 },
                  ticks: { stroke: "black", size: 5 },
                  tickLabels: {
                    fontSize: 13,
                    padding: 5,
                    fontWeight: 'bold',
                    angle: 0,
                  }
                }}
              />
              <VictoryAxis // Y axis
                dependentAxis
                tickCount={10}
                tickFormat={(tick) => {
                  if (tick >= 1e6) {
                    return `${tick / 1e6}M`; // Convert to "M" for millions
                  } else if (tick >= 1e3) {
                    return `${tick / 1e3}k`; // Convert to "k" for thousands
                  }
                  return tick; // For numbers less than 1000, return the original tick
                }}
                style={{
                  grid: { stroke: "black", strokeWidth: 0.5 },
                  ticks: { stroke: "black", size: 8 },
                  tickLabels: { fontSize: 13, padding: 1, fontWeight: 'bold' }
                }}
              />
            </VictoryChart>
          </View>
        )}






      </View>
    </SafeAreaView>
  );
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#35AAFF',  // Background color of the header
    elevation: 4,                // Shadow under the header for Android
    shadowOpacity: 0.3,          // Shadow opacity for iOS
    shadowRadius: 3,             // Shadow radius for iOS
    shadowOffset: { height: 2, width: 0 },  // Shadow offset for iOS
    borderBottomWidth: 0,        // Remove border bottom if needed
    height: 60,                  // Height of the header
    // Additional styles as needed
  },
  graphContainer: {
    marginTop: -15,  // Reduce this value to move the graph up
  },
  titleContainer: {
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
    marginTop: 12,
    marginBottom: 12, // Adjust as needed for spacing above and below the title
  },
  graphTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333', // Dark color for the title
    marginBottom: -60, // Space between the title and the chart
    marginTop: 12,
  },
  dropdownContainer: {
    flexDirection: 'row', // Aligns children horizontally
    justifyContent: 'space-evenly', // Evenly space out children
    alignItems: 'center', // Centers children vertically
    padding: 10, // Add some padding around the container
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd', // A softer border color
    borderRadius: 12, // Rounded corners
    backgroundColor: '#ffffff', // White background for a clean look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3, // Slight elevation for a subtle shadow (Android)
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: '45%', // Keeping the width to fit side by side
    marginHorizontal: 5, // Add horizontal margin for spacing
  },

  dropdownPicker: {
    width: '100%',
    height: 40,
    borderWidth: 0, // Removing the border for the inner picker
    borderRadius: 12, // Rounded corners to match the container
    color: '#333', // Darker font color for contrast
    fontSize: 14, // Slightly larger font size for readability
  },

  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E90FF', // A slightly different shade for variety
    borderRadius: 12, // More pronounced roundness
    paddingVertical: 10, // Slightly larger button for better touch area
    paddingHorizontal: 15, // More horizontal padding for a wider button
    alignSelf: 'flex-end',
    marginTop: 'auto',
    marginBottom: 20, // More space at the bottom
    shadowColor: '#000', // Shadow for depth
    shadowOffset: { width: 0, height: 2 }, // Position of the shadow
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 4, // Shadow blur radius
    elevation: 5, // Elevation for Android
  },

  editButtonText: {
    color: COLORS.white,
    fontSize: 16, // Slightly larger text
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)', // Text shadow for better readability
    textShadowOffset: { width: 1, height: 1 }, // Text shadow position
    textShadowRadius: 2, // Text shadow blur radius
  },

  stockInfoContainer: {
    marginTop: -30, // Adjust this value to move the container further up
    padding: 16,
    backgroundColor: '#f5f5f5', // light grey background
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 6,
    width: screenWidth * 0.9, // 80% of the screen width
    height: screenHeight * 0.36, // 20% of the screen height
    alignSelf: 'center',
  },

  titleText: {
    marginTop: -14,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333', // dark text color
    marginBottom: 8,
  },

  stockDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff', // white background for each row
    borderRadius: 4,
    padding: 8,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    width: screenWidth * 0.8, // 80% of the screen width
    height: screenHeight * 0.045, // 20% of the screen height 
  },

  stockLabel: {
    fontWeight: '600', // slightly bolder than normal
    color: '#555', // medium text color
    fontSize: 12,
  },

  stockValue: {
    fontWeight: '400', // normal weight
    color: '#1a73e8', // primary color for the app
    fontSize: 14,
  },
});

export default Acesso;
