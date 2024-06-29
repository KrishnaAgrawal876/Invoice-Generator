// InvoiceDisplay.js
import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import companyLogo from "../amazon.png";
import "jspdf-autotable";
import "./InvoiceDisplay.css";

const InvoiceDisplay = ({ invoiceData }) => {
  const [uniqueItems, setUniqueItems] = useState([]);

  useEffect(() => {
    if (invoiceData && invoiceData.items) {
      // Remove duplicate items
      const unique = Array.from(
        new Set(invoiceData.items.map((item) => JSON.stringify(item)))
      ).map((item) => JSON.parse(item));
      setUniqueItems(unique);
    }
  }, [invoiceData]);

  if (!invoiceData || uniqueItems.length === 0) return null;

  const calculateNetAmount = (item) =>
    (item.unitPrice * item.quantity - item.discount).toFixed(2);
  const calculateTaxAmount = (item) =>
    (calculateNetAmount(item) * (item.taxRate / 100)).toFixed(2);
  const calculateTotalAmount = (item) =>
    (
      parseFloat(calculateNetAmount(item)) +
      parseFloat(calculateTaxAmount(item))
    ).toFixed(2);

  const totalNetAmount = uniqueItems
    .reduce((acc, item) => acc + parseFloat(calculateNetAmount(item)), 0)
    .toFixed(2);
  const totalTaxAmount = uniqueItems
    .reduce((acc, item) => acc + parseFloat(calculateTaxAmount(item)), 0)
    .toFixed(2);
  const totalAmount = uniqueItems
    .reduce((acc, item) => acc + parseFloat(calculateTotalAmount(item)), 0)
    .toFixed(2);

  const amountToWords = (amount) => {
    const ones = [
      "",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
    ];
    const teens = [
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
    ];
    const tens = [
      "",
      "",
      "twenty",
      "thirty",
      "forty",
      "fifty",
      "sixty",
      "seventy",
      "eighty",
      "ninety",
    ];

    const convertLessThanOneThousand = (num) => {
      if (num === 0) return "";
      let words = "";
      if (num >= 100) {
        words += ones[Math.floor(num / 100)] + " hundred ";
        num %= 100;
      }
      if (num >= 20) {
        words += tens[Math.floor(num / 10)] + " ";
        num %= 10;
      }
      if (num > 0) {
        if (num < 10) {
          words += ones[num] + " ";
        } else {
          words += teens[num - 10] + " ";
        }
      }
      return words.trim();
    };

    const convertNumberToWords = (num) => {
      if (num === 0) return "zero";
      let words = "";
      let billions = Math.floor(num / 1000000000);
      let millions = Math.floor((num % 1000000000) / 1000000);
      let thousands = Math.floor((num % 1000000) / 1000);
      let hundreds = num % 1000;

      if (billions > 0)
        words += convertLessThanOneThousand(billions) + " billion ";
      if (millions > 0)
        words += convertLessThanOneThousand(millions) + " million ";
      if (thousands > 0)
        words += convertLessThanOneThousand(thousands) + " thousand ";
      if (hundreds > 0) words += convertLessThanOneThousand(hundreds);

      return words.trim();
    };

    if (isNaN(amount)) return "Invalid input";

    const num = parseFloat(amount);
    const isNegative = num < 0;
    const absoluteNum = Math.abs(num);
    const inr = Math.floor(absoluteNum);
    const ps = Math.round((absoluteNum - inr) * 100);

    let words = "";
    if (inr > 0) words += convertNumberToWords(inr) + " Rs.";
    if (ps > 0) {
      if (inr > 0) words += " and ";
      words += convertNumberToWords(ps) + " Paisa";
    }
    if (isNegative) words = "negative " + words;

    return words.trim();
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Tax Invoice", 50, 22);

    doc.setFontSize(11);

    doc.text("Seller Details:", 14, 30);
    doc.text(invoiceData.sellerName, 14, 36);
    doc.text(
      `${invoiceData.sellerAddress}, ${invoiceData.sellerCity}, ${invoiceData.sellerState}, ${invoiceData.sellerPincode}`,
      14,
      42
    );
    doc.text(`PAN: ${invoiceData.sellerPAN}`, 14, 48);
    doc.text(`GST: ${invoiceData.sellerGST}`, 14, 54);

    doc.text("Billing Details:", 14, 64);
    doc.text(invoiceData.billingName, 14, 70);
    doc.text(
      `${invoiceData.billingAddress}, ${invoiceData.billingCity}, ${invoiceData.billingState}, ${invoiceData.billingPincode}`,
      14,
      76
    );
    doc.text(`State Code: ${invoiceData.billingStateCode}`, 14, 82);

    doc.text("Shipping Details:", 14, 92);
    doc.text(invoiceData.shippingName, 14, 98);
    doc.text(
      `${invoiceData.shippingAddress}, ${invoiceData.shippingCity}, ${invoiceData.shippingState}, ${invoiceData.shippingPincode}`,
      14,
      104
    );
    doc.text(`State Code: ${invoiceData.shippingStateCode}`, 14, 110);

    doc.text("Order Details:", 14, 120);
    doc.text(`Order Number: ${invoiceData.orderNumber}`, 14, 126);
    doc.text(`Order Date: ${invoiceData.orderDate}`, 14, 132);

    doc.text("Invoice Details:", 14, 142);
    doc.text(`Invoice Number: ${invoiceData.invoiceNumber}`, 14, 148);
    doc.text(`Invoice Details: ${invoiceData.invoiceDetails}`, 14, 154);
    doc.text(`Invoice Date: ${invoiceData.invoiceDate}`, 14, 160);
    doc.text(`Reverse Charge: ${invoiceData.reverseCharge}`, 14, 166);

    doc.autoTable({
      startY: 172,
      head: [
        [
          "Description",
          "Unit Price",
          "Quantity",
          "Discount",
          "Tax Rate",
          "Net Amount",
          "Tax Amount",
          "Total Amount",
        ],
      ],
      body: uniqueItems.map((item) => [
        item.description,
        item.unitPrice,
        item.quantity,
        item.discount,
        item.taxRate,
        calculateNetAmount(item),
        calculateTaxAmount(item),
        calculateTotalAmount(item),
      ]),
    });

    doc.text("Total", 14, doc.previousAutoTable.finalY + 10);
    doc.text(
      `Net Amount: ${totalNetAmount}`,
      14,
      doc.previousAutoTable.finalY + 16
    );
    doc.text(
      `Tax Amount: ${totalTaxAmount}`,
      14,
      doc.previousAutoTable.finalY + 22
    );
    doc.text(
      `Total Amount: ${totalAmount}`,
      14,
      doc.previousAutoTable.finalY + 28
    );

    doc.save("invoice.pdf");
  };

  return (
    <div className="invoice">
      <h1>Tax Invoice</h1>
      <div className="company-logo">
        <img src={companyLogo} alt="Company Logo" />
      </div>
      <h2>Seller Details</h2>
      <p>{invoiceData.sellerName}</p>
      <p>
        {invoiceData.sellerAddress}, {invoiceData.sellerCity},{" "}
        {invoiceData.sellerState}, {invoiceData.sellerPincode}
      </p>
      <p>PAN: {invoiceData.sellerPAN}</p>
      <p>GST: {invoiceData.sellerGST}</p>

      <h2>Billing Details</h2>
      <p>{invoiceData.billingName}</p>
      <p>
        {invoiceData.billingAddress}, {invoiceData.billingCity},{" "}
        {invoiceData.billingState}, {invoiceData.billingPincode}
      </p>
      <p>State Code: {invoiceData.billingStateCode}</p>

      <h2>Shipping Details</h2>
      <p>{invoiceData.shippingName}</p>
      <p>
        {invoiceData.shippingAddress}, {invoiceData.shippingCity},{" "}
        {invoiceData.shippingState}, {invoiceData.shippingPincode}
      </p>
      <p>State Code: {invoiceData.shippingStateCode}</p>

      <h2>Order Details</h2>
      <p>Order Number: {invoiceData.orderNumber}</p>
      <p>Order Date: {invoiceData.orderDate}</p>

      <h2>Invoice Details</h2>
      <p>Invoice Number: {invoiceData.invoiceNumber}</p>
      <p>Invoice Details: {invoiceData.invoiceDetails}</p>
      <p>Invoice Date: {invoiceData.invoiceDate}</p>
      <p>Reverse Charge: {invoiceData.reverseCharge}</p>

      <h2>Items</h2>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Unit Price</th>
            <th>Quantity</th>
            <th>Discount</th>
            <th>Tax Rate</th>
            <th>Net Amount</th>
            <th>Tax Amount</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {uniqueItems.map((item, index) => (
            <tr key={index}>
              <td>{item.description}</td>
              <td>{item.unitPrice}</td>
              <td>{item.quantity}</td>
              <td>{item.discount}</td>
              <td>{item.taxRate}</td>
              <td>{calculateNetAmount(item)}</td>
              <td>{calculateTaxAmount(item)}</td>
              <td>{calculateTotalAmount(item)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="5">Total</td>
            <td>{totalNetAmount}</td>
            <td>{totalTaxAmount}</td>
            <td>{totalAmount}</td>
          </tr>
        </tfoot>
      </table>

      <h2>Amount in Words</h2>
      <p>{amountToWords(totalAmount)}</p>

      <h2>Authorised Signatory</h2>
      <div className="signature"></div>
      <p>For {invoiceData.sellerName}</p>
      <p>Authorised Signatory</p>

      <button onClick={generatePDF}>Download PDF</button>
    </div>
  );
};

export default InvoiceDisplay;
