import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../components/colors';
import axios from 'axios';
import moment from 'moment';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryCursorContainer, VictoryLabel, VictoryArea, VictoryCandlestick} from 'victory-native';


const Acesso = ({ navigation }) => {
  const [backgroundColor] = useState(COLORS.white);
  const [Price, setPrice] = useState('');
  const [chartData, setChartData] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState('1. open');
  const [selectedInfoTime, setSelectedInfoTime] = useState('Daily');
  const timeSeriesOptions = ['Intraday','Daily', 'Weekly', 'Monthly'];
  const [showGraph, setShowGraph] = useState(false);
  const [openPrice, setOpenPrice] = useState('');
  const [highPrice, setHighPrice] = useState('');
  const [lowPrice, setLowPrice] = useState('');
  const [closePrice, setClosePrice] = useState('');
  const [volume, setVolume] = useState('');
  const [menuVisible, setMenuVisible] = useState(false); // State to control dropdown menu visibility
  const [selectedItem, setSelectedItem] = useState('1. open')
  const [isModalVisible, setIsModalVisible] = useState(false);
  


  // Function to toggle dropdown menu
  const toggleMenu = () => {
    setMenuVisible(prevMenuVisible => !prevMenuVisible);
  };


  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Cotações',
      headerTintColor: 'black',
      headerStyle: styles.headerStyle,
      headerTitleStyle: { fontWeight: 'bold' },
      headerTitleAlign: 'center', // Center the header title

      headerRight: () => (
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="menu" size={24} color={COLORS.white} />
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
    setIsModalVisible(true); // Show the modal when data fetch starts
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
    setIsModalVisible(false); // Hide the modal once data is fetched or in case of error
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
    setSelectedItem(value); // Set the selected item
  };


  const getRowStyle = (itemValue) => {
    return selectedItem === itemValue ? styles.stockDataRowSelected : styles.stockDataRow;
  };

  
  // Dropdown Menu Component
  const DropdownMenu = () => (
    <TouchableOpacity
      style={styles.menuOverlay}
      onPress={toggleMenu}
      activeOpacity={1}>
      <View style={styles.dropdownStyle}>
        <TouchableOpacity style={styles.menuItem} onPress={() => { navigation.navigate('Login'); setMenuVisible(false); }}>
          <Ionicons name="log-out-outline" size={24} color="black" />
          <Text style={styles.menuItemText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => { navigation.navigate('EditInformation'); setMenuVisible(false); }}>
          <Ionicons name="pencil-outline" size={24} color="black" />
          <Text style={styles.menuItemText}>Editar dados</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => { navigation.navigate('AboutScreen'); setMenuVisible(false); }}>
          <Ionicons name="information-circle-outline" size={24} color="black" />
          <Text style={styles.menuItemText}>Sobre</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );


  const TimeSeriesButton = ({ label, onPress, isSelected }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.timeSeriesButton,
        isSelected ? styles.timeSeriesButtonSelected : null,
      ]}
    >
      <Text style={styles.timeSeriesButtonText}>{label}</Text>
    </TouchableOpacity>
  );


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1 }}>


        <View style={styles.stockInfoContainer}>
          <Text style={styles.titleText}>
            Cotação de ações da IBM
          </Text>
          <TouchableOpacity style={getRowStyle('1. open')} onPress={() => handlePress('1. open')}>
            <Text style={styles.stockLabel}>Abertura:</Text>
            <Text style={styles.stockValue}>{openPrice}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={getRowStyle('2. high')} onPress={() => handlePress('2. high')}>
            <Text style={styles.stockLabel}>Máxima:</Text>
            <Text style={styles.stockValue}>{highPrice}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={getRowStyle('3. low')} onPress={() => handlePress('3. low')}>
            <Text style={styles.stockLabel}>Mínima:</Text>
            <Text style={styles.stockValue}>{lowPrice}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={getRowStyle('4. close')} onPress={() => handlePress('4. close')}>
            <Text style={styles.stockLabel}>Fechamento:</Text>
            <Text style={styles.stockValue}>{closePrice}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={getRowStyle('5. volume')} onPress={() => handlePress('5. volume')}>
            <Text style={styles.stockLabel}>Volume:</Text>
            <Text style={styles.stockValue}>{volume}</Text>
          </TouchableOpacity>
          <View style={styles.stockDataRow}>
            <Text style={styles.stockLabel}>Dollar/Real:</Text>
            <Text style={styles.stockValue}>{Price}</Text>
          </View>
        </View>

        <Modal
          transparent={true}
          animationType="fade"
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text>Loading...</Text>
            </View>
          </View>
        </Modal>

        {menuVisible && <DropdownMenu />}




        <View style={styles.timeSeriesButtonContainer}>
          {timeSeriesOptions.map((option) => {
            let label = option;
            if (option === 'Intraday') label = '1D';
            if (option === 'Daily') label = '15D';
            if (option === 'Weekly') label = '6M';
            if (option === 'Monthly') label = '1Y';
            return (
              <TimeSeriesButton
                key={option}
                label={label}
                onPress={() => setSelectedInfoTime(option)}
                isSelected={selectedInfoTime === option}
              />
            );
          })}
        </View>


        {showGraph && (
          <View style={styles.graphContainer}>
            <View style={styles.titleContainer}>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  timeSeriesButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 110,
  },
  timeSeriesButton: {
    backgroundColor: '#f5f5f5',
    marginHorizontal: 5, // Reduce this value to decrease space between buttons
    padding: 10,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timeSeriesButtonSelected: {
    backgroundColor: '#ADD8E6',
  },
  timeSeriesButtonText: {
    color: '#333',
    fontSize: 14,
    textAlign: 'center',
  },
  stockDataRowSelected: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ADD8E6', // white background for each row
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
  dropdownStyle: {
    position: 'absolute',
    top: -30,      // Adjust this to move the menu up or down
    right: 10,    // Adjust this to move the menu left or right
    // left: 10,   // Use 'left' instead of 'right' if you want to position from the left
    // bottom: 60, // Use 'bottom' to position from the bottom of the screen
    width: 150,   // Width of the dropdown menu
    // height: 100, // Height of the dropdown menu, if you want to fix it
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItemText: {
    marginVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  menuOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  menuItemText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
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
  graphContainer: {
    marginTop: -45,  // Reduce this value to move the graph up
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
    padding: 1, // Add some padding around the container
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd', // A softer border color
    borderRadius: 12, // Rounded corners
    backgroundColor: '#ffffff', // White background for a clean look
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: '45%', // Keeping the width to fit side by side
    marginHorizontal: 5, // Add horizontal margin for spacing
  },

  dropdownPicker: {
    width: '100%',
    height: 200,
    borderWidth: 0, // Removing the border for the inner picker
    borderRadius: 12, // Rounded corners to match the container
    color: '#333', // Darker font color for contrast
    fontSize: 17, // Slightly larger font size for readability
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
    textAlign: 'center', // Center text horizontally
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
