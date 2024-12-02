import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Select, message, Spin } from "antd";
import {
  fetchShippingCountries,
  fetchShippingDivisions,
  fetchShippingLocations,
} from "../Redux/slice/shippingSlice";
const { Option } = Select;

const ShippingComponent = ({ isVisible, onClose }) => {
  const dispatch = useDispatch();

  // Redux state
  const { countries, divisions, locations, loading } = useSelector(
    (state) => state.shipping
  );

  // Local state for selected country, division, and location
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [shippingDetails, setShippingDetails] = useState({});

  // Fetch shipping countries on component mount
  useEffect(() => {
    dispatch(fetchShippingCountries());
  }, [dispatch]);

  // Handle country selection and fetch divisions
  const handleCountryChange = (countryCode) => {
    setSelectedCountry(countryCode);
    setSelectedDivision(""); // Reset division when changing the country
    setSelectedLocation(""); // Reset location
    if (countryCode) {
      dispatch(fetchShippingDivisions(countryCode));
    }
  };

  // Handle division selection and fetch locations
  const handleDivisionChange = (divisionCode) => {
    setSelectedDivision(divisionCode);
    setSelectedLocation(""); // Reset location when changing the division
    if (divisionCode) {
      dispatch(fetchShippingLocations(divisionCode));
    }
  };

  // Save shipping details to local storage
  const handleSaveShippingDetails = () => {
    const selectedLocationDetails = locations.find(
      (location) => location.locationCode === selectedLocation
    );
    const selectedDivisionDetails = divisions.find(
      (division) => division.divisionCode === selectedDivision
    );

    const details = {
      country: selectedCountry,
      division: selectedDivisionDetails?.divisionName || "",
      location: selectedLocationDetails?.locationName || "",
      locationCharge: selectedLocationDetails?.shippingCharge || 0,
    };

    setShippingDetails(details);
    localStorage.setItem("shippingDetails", JSON.stringify(details));
    message.success("Shipping details saved successfully!");
    onClose(); // Close the modal after saving
  };

  return (
    <Modal
      title="Shipping Details"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      centered
      bodyStyle={{ padding: "24px" }}
    >
      {loading && <Spin tip="Loading shipping data..." />}

      <div style={{ marginBottom: "20px" }}>
        <label
          htmlFor="country"
          style={{ fontWeight: "500", marginBottom: "8px", display: "block" }}
        >
          Select Country
        </label>
        <Select
          id="country"
          value={selectedCountry}
          onChange={handleCountryChange}
          placeholder="Select a Country"
          style={{ width: "100%" }}
        >
          {countries.map((country) => (
            <Option key={country.countryCode} value={country.countryCode}>
              {country.countryName}
            </Option>
          ))}
        </Select>
      </div>

      {selectedCountry && (
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="division"
            style={{ fontWeight: "500", marginBottom: "8px", display: "block" }}
          >
            Select Division
          </label>
          <Select
            id="division"
            value={selectedDivision}
            onChange={handleDivisionChange}
            placeholder="Select a Division"
            style={{ width: "100%" }}
          >
            {divisions.map((division) => (
              <Option key={division.divisionCode} value={division.divisionCode}>
                {division.divisionName}
              </Option>
            ))}
          </Select>
        </div>
      )}

      {selectedDivision && (
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="location"
            style={{ fontWeight: "500", marginBottom: "8px", display: "block" }}
          >
            Select Town
          </label>
          <Select
            id="location"
            value={selectedLocation}
            onChange={setSelectedLocation}
            placeholder="Select a Location"
            style={{ width: "100%" }}
          >
           {locations.map((location) => (
  <Option key={location.locationCode} value={location.locationCode}>
    {location.locationName} 
    {location.shippingCharge === 0 ? " - N/A" : ` - ₵${location.shippingCharge}`}
  </Option>
))}

          </Select>
        </div>
      )}

      <Button
        type="primary"
        onClick={handleSaveShippingDetails}
        style={{
          width: "100%",
          backgroundColor: "#3F6634",
          borderColor: "#3F6634",
        }}
      >
        Save Shipping Details
      </Button>
    </Modal>
  );
};

export default ShippingComponent;
