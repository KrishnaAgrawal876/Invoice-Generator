import React, { useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import "./InvoiceForm.css";
import { validateFormData } from "./dataValidation";

const InvoiceForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    sellerName: "",
    sellerAddress: "",
    sellerCity: "",
    sellerState: "",
    sellerPincode: "",
    sellerPAN: "",
    sellerGST: "",

    billingName: "",
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingPincode: "",
    billingStateCode: "",
    placeOfSupply: "",

    shippingName: "",
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingPincode: "",
    shippingStateCode: "",
    placeOfDelivery: "",
    orderNumber: "",
    orderDate: "",
    invoiceNumber: "",
    invoiceDetails: "",
    invoiceDate: "",
    reverseCharge: "No",
    items: [
      { description: "", unitPrice: 0, quantity: 0, discount: 0, taxRate: 18 },
    ],
    signature: "",
  });

  // State to track validation status for each section
  const [validationStatus, setValidationStatus] = useState({
    sellerDetails: false,
    billingDetails: false,
    shippingDetails: false,
    orderDetails: false,
    invoiceDetails: false,
    items: false,
    signature: false,
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      signature: file,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    newItems[index][name] = value;
    setFormData({
      ...formData,
      items: newItems,
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          description: "",
          unitPrice: 0,
          quantity: 0,
          discount: 0,
          taxRate: 18,
        },
      ],
    });
  };

  const handleSectionValidation = (section) => {
    const fieldsToCheck = getFieldsForSection(section);
    let isValid = true;
    fieldsToCheck.forEach((field) => {
      // alert(section);
      if (section === "items") {
        formData.items.forEach((item) => {
          if (!item[field]) {
            isValid = false;
          }
        });
      } else {
        if (!formData[field]) {
          isValid = false;
        }
      }
    });
    setValidationStatus({
      ...validationStatus,
      [section]: isValid,
    });
    return isValid;
  };

  const getFieldsForSection = (section) => {
    switch (section) {
      case "sellerDetails":
        return [
          "sellerName",
          "sellerAddress",
          "sellerCity",
          "sellerState",
          "sellerPincode",
          "sellerPAN",
          "sellerGST",
        ];
      case "billingDetails":
        return [
          "billingName",
          "billingAddress",
          "billingCity",
          "billingState",
          "billingPincode",
          "billingStateCode",
          "placeOfSupply",
        ];
      case "shippingDetails":
        return [
          "shippingName",
          "shippingAddress",
          "shippingCity",
          "shippingState",
          "shippingPincode",
          "shippingStateCode",
        ];
      case "orderDetails":
        return ["placeOfDelivery", "orderNumber", "orderDate"];
      case "invoiceDetails":
        return [
          "invoiceNumber",
          "invoiceDetails",
          "invoiceDate",
          "reverseCharge",
        ];
      case "items":
        // Check if any item description is empty
        return ["description", "unitPrice", "quantity", "discount", "taxRate"];
      case "signature":
        return ["signature"];
      default:
        return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check each section for empty required fields
    const sectionsToCheck = [
      "sellerDetails",
      "billingDetails",
      "shippingDetails",
      "orderDetails",
      "invoiceDetails",
      "items",
      "signature",
    ];
    let isValid = true;

    sectionsToCheck.forEach((section) => {
      const sectionValid = handleSectionValidation(section);
      if (!sectionValid) {
        alert(`Please fill all required fields in ${section}.`);
        isValid = false;
      }
    });

    // If any section validation fails, stop further validation
    if (!isValid) {
      return;
    }

    // Validate entire form data
    const errors = validateFormData(formData);

    if (errors.length > 0) {
      alert(`Validation errors:\n${errors.join("\n")}`);
    } else {
      alert("Success");
      onSubmit(formData);
    }
  };
  const generatePDF = () => {
    // Initialize jsPDF instance
    const doc = new jsPDF();

    // Define content for the PDF
    const invoiceTitle = `Invoice for Order #${formData.orderNumber}`;
    const invoiceContent = `
      Customer: ${formData.sellerName}
      Order Date: ${formData.orderDate}
      Total Amount: ${formData.invoiceDetails}
      // Add more content as needed

      Thank you for your order!
    `;

    // Set properties for the PDF
    doc.setFontSize(12);
    doc.text(invoiceTitle, 10, 10);
    doc.text(invoiceContent, 10, 20);

    // Save the PDF with a specific name
    doc.save("invoice.pdf");
  };

  return (
    <div className="invoice-form">
      <form onSubmit={handleSubmit}>
        {/* -------------------------------------------------------Seller Details----------------------------------------------- */}
        <div className="section">
          <h1 className="animated-heading">Seller Details</h1>
          <div className="container">
            <div className="left">
              <label>Seller Name:</label>
              <label>Seller Address:</label>
              <label>City:</label>
              <label>State:</label>
              <label>Pincode:</label>
              <label>PAN No.:</label>
              <label>GST Registration No.:</label>
            </div>
            <div className="right">
              <input
                name="sellerName"
                placeholder="Seller Name"
                onChange={handleChange}
                required
              />
              <input
                name="sellerAddress"
                placeholder="Seller Address"
                onChange={handleChange}
                required
              />
              <input
                name="sellerCity"
                placeholder="City"
                onChange={handleChange}
                required
              />
              <select name="sellerState" onChange={handleChange} required>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Delhi">Delhi</option>
                <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                <option value="Ladakh">Ladakh</option>
                <option value="Lakshadweep">Lakshadweep</option>
                <option value="Puducherry">Puducherry</option>
              </select>
              <input
                name="sellerPincode"
                placeholder="Pincode"
                onChange={handleChange}
                required
              />
              <input
                name="sellerPAN"
                placeholder="PAN No."
                onChange={handleChange}
                required
              />
              <input
                name="sellerGST"
                placeholder="GST Registration No."
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
        {/* -------------------------------------------------------Billing Details----------------------------------------------- */}
        <div className="section">
          <h1 className="animated-heading">Billing Details</h1>
          <div className="container">
            <div className="left">
              <label> Billing Name:</label>
              <label>Billing Address:</label>
              <label>City:</label>
              <label>State:</label>
              <label>Pincode:</label>
              <label>State/UT Code:</label>
              <label> Place of Supply:</label>
            </div>
            <div className="right">
              <input
                name="billingName"
                placeholder="Billing Name"
                onChange={handleChange}
                required
              />
              <input
                name="billingAddress"
                placeholder="Billing Address"
                onChange={handleChange}
                required
              />

              <input
                name="billingCity"
                placeholder="City"
                onChange={handleChange}
                required
              />

              <select name="billingState" onChange={handleChange} required>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Delhi">Delhi</option>
                <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                <option value="Ladakh">Ladakh</option>
                <option value="Lakshadweep">Lakshadweep</option>
                <option value="Puducherry">Puducherry</option>
              </select>
              <input
                name="billingPincode"
                placeholder="Pincode"
                onChange={handleChange}
                required
              />
              <input
                name="billingStateCode"
                placeholder="State/UT Code"
                onChange={handleChange}
                required
              />
              <input
                name="placeOfSupply"
                placeholder="Place of Supply"
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------Shipping Details----------------------------------------------- */}
        <div className="section">
          <h1 className="animated-heading">Shipping Details</h1>
          <div className="container">
            <div className="left">
              <label> Shipping Name:</label>
              <label>Shipping Address:</label>
              <label>City:</label>
              <label>State:</label>
              <label>Pincode:</label>
              <label>State/UT Code:</label>
            </div>
            <div className="right">
              <input
                name="shippingName"
                placeholder="Shipping Name"
                onChange={handleChange}
                required
              />
              <input
                name="shippingAddress"
                placeholder="Shipping Address"
                onChange={handleChange}
                required
              />

              <input
                name="shippingCity"
                placeholder="City"
                onChange={handleChange}
                required
              />

              <select name="shippingState" onChange={handleChange} required>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Delhi">Delhi</option>
                <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                <option value="Ladakh">Ladakh</option>
                <option value="Lakshadweep">Lakshadweep</option>
                <option value="Puducherry">Puducherry</option>
              </select>
              <input
                name="shippingPincode"
                placeholder="Pincode"
                onChange={handleChange}
                required
              />
              <input
                name="shippingStateCode"
                placeholder="PAN No."
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
        {/* -------------------------------------------------------Order Details----------------------------------------------- */}
        <div className="section">
          <h1 className="animated-heading">Order Details</h1>
          <div className="container">
            <div className="left">
              <label> Order Number:</label>
              <label> Order Date:</label>
              <label> Place of Delivery:</label>
            </div>
            <div className="right">
              <input
                name="orderNumber"
                placeholder="Order Number"
                onChange={handleChange}
                required
              />
              <input
                name="orderDate"
                type="date"
                placeholder="Order Date"
                onChange={handleChange}
                required
              />
              <input
                name="placeOfDelivery"
                placeholder="Delivery Place"
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
        {/* -------------------------------------------------------Invoice Details----------------------------------------------- */}
        <div className="section">
          <h1 className="animated-heading">Invoice Details</h1>
          <div className="container">
            <div className="left">
              <label> Invoice Number:</label>
              <label> Invoice Details:</label>
              <label> Invoice Date:</label>
              <label> Reverse Charge:</label>
            </div>
            <div className="right">
              <input
                name="invoiceNumber"
                placeholder="Invoice Number"
                onChange={handleChange}
                required
              />
              <input
                name="invoiceDetails"
                placeholder="Invoice Details"
                onChange={handleChange}
                required
              />
              <input
                name="invoiceDate"
                type="date"
                onChange={handleChange}
                required
              />
              <select name="reverseCharge" onChange={handleChange} required>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------Item Description-----------------------------------------------*/}
        <h2 className="table-heading">Item Details</h2>
        <table className="item-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Discount</th>
              <th>Tax Rate</th>
            </tr>
          </thead>
          <tbody>
            {formData.items.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    name="description"
                    className="table-data"
                    placeholder="Description"
                    onChange={(e) => handleItemChange(index, e)}
                    required
                  />
                </td>
                <td>
                  <input
                    name="unitPrice"
                    className="table-data"
                    type="number"
                    placeholder="Unit Price"
                    onChange={(e) => handleItemChange(index, e)}
                    required
                  />
                </td>
                <td>
                  <input
                    name="quantity"
                    className="table-data"
                    type="number"
                    placeholder="Quantity"
                    onChange={(e) => handleItemChange(index, e)}
                    required
                  />
                </td>
                <td>
                  <input
                    name="discount"
                    className="table-data"
                    type="number"
                    placeholder="Discount"
                    onChange={(e) => handleItemChange(index, e)}
                    required
                  />
                </td>
                <td>
                  <input
                    name="taxRate"
                    className="table-data"
                    type="number"
                    placeholder="Tax Rate"
                    value={item.taxRate}
                    onChange={(e) => handleItemChange(index, e)}
                    required
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="button" onClick={addItem}>
          Add Item
        </button>
        <div className="button-container">
          {/*To center the button, you need to adjust the parent container's styling. */}
          <button
            type="button"
            className="generate-button"
            onClick={handleSubmit}
          >
            Generate Invoice
          </button>
          {/* Inside your render method  */}
          <input type="file" name="signature" onChange={handleFileChange} />
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
