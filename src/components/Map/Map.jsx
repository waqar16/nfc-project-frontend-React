import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Map.css";
import { WorldMap } from "react-svg-worldmap";

function Map() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxCountry, setMaxCountry] = useState(null);
  const [largeCountry, setLargeCountry] = useState(null);
  const [mediumCountry, setMediumCountry] = useState(null);
  const [smallCount, setSmallCount] = useState(0);

  // Fetch the data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('  https://waqar123.pythonanywhere.com/api/geo-data/', {
          headers: { Authorization: `Token ${localStorage.getItem('authToken')}` }
        });
        const apiData = response.data;

        // Transform the API data into the format required by react-svg-worldmap
        const formattedData = apiData.map(item => ({
          country: item.location,
          value: item.count, // Keep count as number for comparison
        }));

        setData(formattedData);

        if (formattedData.length > 0) {
          // Sort the data to find the maximum, second, and third highest values
          const sortedData = [...formattedData].sort((a, b) => b.value - a.value);
          const max = sortedData[0];
          const large = sortedData[1] || null;
          const medium = sortedData[2] || null;

          setMaxCountry(max);
          setLargeCountry(large);
          setMediumCountry(medium);

          // Calculate the sum of the remaining small countries
          const small = sortedData.slice(3).reduce((sum, country) => sum + country.value, 0);
          setSmallCount(small);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching interaction frequency:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Define colors for categories
  const getColor = (value) => {
    if (maxCountry && value === maxCountry.value) return "blue"; // Massive
    if (largeCountry && value === largeCountry.value) return "orange"; // Large
    if (mediumCountry && value === mediumCountry.value) return "yellow"; // Medium
    return "grey"; // Small
  };

  const defaultColor = "#93BED4"; // Default color for countries not in the data

  const stylingFunction = (context) => {
    const countryData = data.find(item => item.country === context.countryCode);
    const color = countryData ? getColor(countryData.value) : 'gray';

    const opacityLevel = countryData ? 1 : 0.3 + (1.5 * (context.countryValue - context.minValue)) / (context.maxValue - context.minValue);

    return {
      fill: color,
      fillOpacity: isNaN(opacityLevel) ? 0.2 : opacityLevel,
      stroke: "gray",
      strokeWidth: 2,
      strokeOpacity: 0.1,
      cursor: "pointer"
    };
  };

  const bulletStyle = (color) => ({
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: color,
    marginRight: '10px'
  });

  const listItemStyle = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box'
  };

  return (
    <div className="map-container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <WorldMap
            alignCenter={true}
            richInteraction={true}
            borderColor={"white"}
            color={defaultColor}
            tooltipBgColor={"#31323f"}
            valueSuffix="applications"
            valuePrefix=":"
            size={"responsive"}
            data={data}
            styleFunction={stylingFunction}
          />
          <div className="Sub-Content">
            <h2 className="sub-Content-Heading">
              {maxCountry ? `${maxCountry.value}` : '0'}
            </h2>
            <h5 className="Sub-Content-description">
              {maxCountry ? `Most interaction from ${maxCountry.country}` : 'No data available'}
            </h5>
            <ul className="size-list">
              <li style={listItemStyle}>
                <div style={bulletStyle("blue")}></div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <h5 style={{ margin: '0' }}>Massive</h5>
                  <p>{maxCountry ? maxCountry.value : '0'}</p>
                </div>
              </li>
              <li style={listItemStyle}>
                <div style={bulletStyle("orange")}></div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <h5 style={{ margin: '0' }}>Large</h5>
                  <p>{largeCountry ? largeCountry.value : '0'}</p>
                </div>
              </li>
              <li style={listItemStyle}>
                <div style={bulletStyle("yellow")}></div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <h5 style={{ margin: '0' }}>Medium</h5>
                  <p>{mediumCountry ? mediumCountry.value : '0'}</p>
                </div>
              </li>
              <li style={listItemStyle}>
                <div style={bulletStyle("grey")}></div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <h5 style={{ margin: '0' }}>Small</h5>
                  <p>{smallCount}</p>
                </div>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default Map;
