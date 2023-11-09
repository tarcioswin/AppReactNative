import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../components/colors';
import axios from 'axios';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import { VictoryLabel, VictoryChart, VictoryLine, VictoryArea, VictoryAxis, VictoryVoronoiContainer, VictoryTooltip, VictoryCursorContainer } from 'victory-native';


const Acesso = ({ navigation }) => {
  const [backgroundColor, setBackgroundColor] = useState(COLORS.white);
  const [Price, setPrice] = useState('');
  const [chartData, setChartData] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState('close');
  const [infoOptions] = useState(['1. open', '2. high', '3. low', '4. close', '5. volume']);
  const [showGraph, setShowGraph] = useState(false);


  useEffect(() => {
    navigation.setOptions({
      headerTintColor: 'black',
      headerStyle: { backgroundColor: backgroundColor },
      headerTitleStyle: { fontWeight: 'bold' },
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('EditInformation')}
          style={styles.editButton}
        >
          <Ionicons name="pencil-outline" size={20} color={COLORS.white} />
          <Text style={styles.editButtonText}>Edit Inf.</Text>
        </TouchableOpacity>
      ),
    });
  }, [backgroundColor, navigation]);





  const fetchData = async () => {
    const apiKey = 'demo'; // Use your actual API key here
    const symbol = 'IBM';
    const functionType = 'TIME_SERIES_DAILY';
    const url = `https://www.alphavantage.co/query?function=${functionType}&symbol=${symbol}&apikey=${apiKey}`;

    try {
      const response = await axios.get(url);
      const timeSeries = response.data['Time Series (Daily)'];

      if (timeSeries) {
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 15);

        const infoKeySuffix = selectedInfo.split('. ')[1]; // Get the suffix after the dot and space (e.g., 'open' from '1. open')

        // Make sure the suffix is a string before calling toLowerCase
        const infoKey = typeof infoKeySuffix === 'string' ? infoKeySuffix.toLowerCase() : '';

        const processedChartData = Object.entries(timeSeries)
          .filter(([date, _]) => new Date(date) >= twoWeeksAgo)
          .map(([date, dataPoint]) => {
            // Find the correct data point key that ends with the selectedInfo suffix (e.g., '4. close' when infoKey is 'close')
            const dataPointKey = Object.keys(dataPoint).find(key => key.endsWith(infoKey));
            const selectedValue = dataPointKey ? parseFloat(dataPoint[dataPointKey]) : null;
            return { x: new Date(date), y: selectedValue };
          })
          .reverse(); // Reverse to have the earliest date first

        setChartData(processedChartData);
        setPrice(processedChartData.length ? processedChartData[0].y : '');
        setShowGraph(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  // Function to handle the cursor movement and set state
  const handleCursorChange = (value, props) => {
    const chartData = props.scale.y.domain();
    const closestPoint = chartData.reduce((prev, curr) =>
      Math.abs(curr.x - value.x) < Math.abs(prev.x - value.x) ? curr : prev
    );
    setCursorValue(closestPoint);
  };



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1 }}>
        <Text style={styles.centeredText}>
          (IBM) {selectedInfo.split(' ')[1]} stock quote last day: {Price}
        </Text>


        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedInfo}
            onValueChange={(value) => setSelectedInfo(value)}
            style={styles.dropdownPicker}
            itemStyle={{ color: 'black', fontSize: 16 }}
          >
            <Picker.Item label="Select an item" value="" />
            {infoOptions.map((option, index) => (
              <Picker.Item key={index} label={option} value={option} />
            ))}
          </Picker>
        </View>


        <View
          style={{
            marginTop: 10, marginBottom: 4, backgroundColor: '#35AAFF', fontWeight: 'bold', width: '60%', alignSelf: 'center',
            borderRadius: 8,
          }}
        >
          <Button
            title="Show Graph"
            onPress={() => {
              setShowGraph(false); // Hide the graph
              fetchData(selectedInfo); // Fetch new data
            }}
          />
        </View>



        {showGraph && (
          <VictoryChart
            domainPadding={{ y: 60 }}
            height={400} // Height of the chart
            width={440}  // Width of the chart
            containerComponent={
              <VictoryCursorContainer
                cursorLabel={({ datum }) => `${datum.y.toFixed(0)}\n${moment(datum.x).format('MMM D')}`}
                cursorLabelComponent={<VictoryLabel dy={-60} style={{ fontSize: 14, fontWeight: 'bold' }} />} // Moves the label up by 20 units
              />
              // or tooltip
              // <VictoryVoronoiC ontainer
              //   voronoiDimension="x"
              //   labelComponent={<VictoryTooltip flyoutStyle={{ fill: "white" }} />}
              // />
            }
          >
            <VictoryLine
              animate={{
                duration: 1200,
                onLoad: { duration: 1200 }
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
              //label="Date"
              tickCount={5}
              tickFormat={(t) => moment(t).format('MMM D')}
              style={{
                grid: { stroke: "black", strokeWidth: 0.5 },
                ticks: { stroke: "black", size: 5 },
                tickLabels: { 
                  fontSize: 13,
                  padding: 5,
                  fontWeight: 'bold',
                  angle: 0, // Rotate labels by 90 degrees
                  //verticalAnchor: 'middle', // Adjusts the label vertically
                  //textAnchor: 'start' // Adjusts the label horizontally
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
                tickLabels: { fontSize: 13, padding: 5, fontWeight: 'bold' }
              }}
            />
          </VictoryChart>
        )}






      </View>
    </SafeAreaView>
  );
};




const styles = StyleSheet.create({
  axisStyle: {
    axis: { stroke: 'grey' },
    axisLabel: { fontSize: 16, padding: 30 },
    grid: { stroke: 'grey', strokeWidth: 0.5 },
    ticks: { stroke: 'grey', size: 5 },
    tickLabels: { fontSize: 10, padding: 5 },
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',  // Center horizontally
    justifyContent: 'center',  // Center vertically
    height: 40, // Set a fixed height for the dropdown
    width: 200,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  centeredText: {
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tooltipText: {
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
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
  dropdownPicker: {
    width: 150,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#35AAFF',
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
