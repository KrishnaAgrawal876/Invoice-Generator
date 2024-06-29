// App.js
import React, { useState } from "react";
import InvoiceForm from "./Components/InvoiceForm";
import InvoiceDisplay from "./Components/InvoiceDisplay";
import "./App.css";

const App = () => {
  const [invoiceData, setInvoiceData] = useState(null);

  const handleFormSubmit = (data) => {
    setInvoiceData(data);
  };

  return (
    <div className="root-container">
      <h1 className="typing-effect">Invoice Generator For E-Commerce Orders</h1>
      <InvoiceForm onSubmit={handleFormSubmit} />
      <InvoiceDisplay invoiceData={invoiceData} />
    </div>
  );
};

export default App;
