import React from "react";
import "./Map.css";
import { WorldMap } from "react-svg-worldmap";
import { BsDisplay } from "react-icons/bs";

function Map() {

  // Data for countries with their values and custom colors
  const data = [
    { country: "DE", value: "121224", color: "#FF5733" }, // Germany
    { country: "EP", value: "46667", color: "#33FF57" }, // Spain
    { country: "US", value: "37193", color: "#3357FF" }, // United States
    { country: "WO", value: "33117", color: "#F1C40F" }, // World
    { country: "CN", value: "16899", color: "#8E44AD" }, // China
    { country: "AT", value: "12168", color: "#E67E22" }, // Austria
    { country: "JP", value: "10993", color: "#2ECC71" }, // Japan
    { country: "FR", value: "8096", color: "#3498DB" }, // France
    { country: "GB", value: "7355", color: "#9B59B6" }, // United Kingdom
    { country: "ES", value: "6264", color: "#1ABC9C" }, // Spain
    { country: "CA", value: "5470", color: "#F39C12" }, // Canada
    { country: "CH", value: "5082", color: "#D35400" }, // Switzerland
    { country: "IT", value: "4087", color: "#C0392B" }, // Italy
    { country: "BR", value: "3668", color: "#BDC3C7" }, // Brazil
    { country: "SE", value: "3555", color: "#7F8C8D" }, // Sweden
    { country: "AU", value: "3368", color: "#16A085" }, // Australia
    { country: "DK", value: "3317", color: "#27AE60" }, // Denmark
    { country: "KR", value: "2822", color: "#2980B9" }, // South Korea
    { country: "RU", value: "2391", color: "#8E44AD" }, // Russia
    { country: "NL", value: "2227", color: "#F39C12" }, // Netherlands
    { country: "BE", value: "1912", color: "#E74C3C" }, // Belgium
    { country: "TW", value: "1472", color: "#ECF0F1" }, // Taiwan
    { country: "NO", value: "1439", color: "#BDC3C7" }, // Norway
    { country: "ZA", value: "1339", color: "#34495E" }, // South Africa
    { country: "FI", value: "1321", color: "#16A085" }, // Finland
    { country: "PL", value: "1075", color: "#2ECC71" }, // Poland
    { country: "IN", value: "877", color: "#3498DB" }, // India
    { country: "PT", value: "720", color: "#9B59B6" }, // Portugal
    { country: "MX", value: "607", color: "#1ABC9C" }, // Mexico
    { country: "AR", value: "592", color: "#F39C12" }, // Argentina
    { country: "HK", value: "536", color: "#D35400" }, // Hong Kong
    { country: "GR", value: "421", color: "#C0392B" }, // Greece
    { country: "UA", value: "409", color: "#BDC3C7" }, // Ukraine
    { country: "HU", value: "397", color: "#7F8C8D" }, // Hungary
    { country: "IL", value: "323", color: "#16A085" }, // Israel
    { country: "YU", value: "314", color: "#27AE60" }, // Yugoslavia
    { country: "CZ", value: "255", color: "#2980B9" }, // Czech Republic
    { country: "SU", value: "227", color: "#8E44AD" }, // Soviet Union
    { country: "IE", value: "224", color: "#F39C12" }, // Ireland
    { country: "TR", value: "212", color: "#E74C3C" }, // Turkey
    { country: "NZ", value: "146", color: "#ECF0F1" }, // New Zealand
    { country: "LU", value: "138", color: "#BDC3C7" }, // Luxembourg
    { country: "CS", value: "137", color: "#34495E" }, // Czechoslovakia
    { country: "CL", value: "126", color: "#16A085" }, // Chile
    { country: "SG", value: "120", color: "#27AE60" }, // Singapore
    { country: "DD", value: "102", color: "#2980B9" }, // East Germany
    { country: "SI", value: "93", color: "#8E44AD" }, // Slovenia
    { country: "ID", value: "92", color: "#F39C12" }, // Indonesia
    { country: "PE", value: "84", color: "#D35400" }, // Peru
    { country: "SK", value: "74", color: "#C0392B" }, // Slovakia
    { country: "HR", value: "63", color: "#BDC3C7" }, // Croatia
    { country: "MY", value: "52", color: "#7F8C8D" }, // Malaysia
    { country: "EG", value: "36", color: "#16A085" }, // Egypt
    { country: "BG", value: "34", color: "#27AE60" }, // Bulgaria
    { country: "EA", value: "26", color: "#2980B9" }, // Ceuta and Melilla
    { country: "RO", value: "26", color: "#8E44AD" }, // Romania
    { country: "MA", value: "23", color: "#F39C12" }, // Morocco
    { country: "LT", value: "15", color: "#D35400" }, // Lithuania
    { country: "CO", value: "14", color: "#C0392B" }, // Colombia
    { country: "MC", value: "13", color: "#BDC3C7" }, // Monaco
    { country: "TN", value: "12", color: "#7F8C8D" }, // Tunisia
    { country: "RS", value: "11", color: "#16A085" }, // Serbia
    { country: "CY", value: "6", color: "#27AE60" }, // Cyprus
    { country: "LV", value: "6", color: "#2980B9" }, // Latvia
    { country: "EE", value: "4", color: "#8E44AD" }, // Estonia
  ]

  const defaultColor = "#93BED4"; // Default color for countries not in the data

  const stylingFunction = (context) => {
    const countryData = data.find(item => item.country === context.countryCode);
    const color = countryData ? countryData.color : 'gray';

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
      <h2 className="sub-Content-Heading">122.20</h2>
      <h5 className="Sub-Content-description">Our most custumer in US</h5>
      <ul className="size-list">
        <li style={listItemStyle}>
          <div style={bulletStyle("blue")}></div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <h5 style={{ margin: '0' }}>Massive</h5>
            <p>1233.k</p>
          </div>
        </li>
        <li style={listItemStyle}>
          <div style={bulletStyle("orange")}></div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <h5 style={{ margin: '0' }}>Large</h5>
            <p>1233.k</p>
          </div>
        </li>
        <li style={listItemStyle}>
          <div style={bulletStyle("yellow")}></div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <h5 style={{ margin: '0' }}>Medium</h5>
            <p>1233.k</p>
          </div>
        </li>
        <li style={listItemStyle}>
          <div style={bulletStyle("grey")}></div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <h5 style={{ margin: '0' }}>Small</h5>
            <p>1233.k</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
  );
}

export default Map;
