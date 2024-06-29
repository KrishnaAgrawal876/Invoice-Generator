export const validateFormData = (formData) => {
  const errors = [];

  // Check all mandatory fields
  const mandatoryFields = [
    "sellerName",
    "sellerAddress",
    "sellerCity",
    "sellerState",
    "sellerPincode",
    "sellerPAN",
    "sellerGST",
    "placeOfSupply",
    "billingName",
    "billingAddress",
    "billingCity",
    "billingState",
    "billingPincode",
    "billingStateCode",
    "shippingName",
    "shippingAddress",
    "shippingCity",
    "shippingState",
    "shippingPincode",
    "shippingStateCode",
    "placeOfDelivery",
    "orderNumber",
    "orderDate",
    "invoiceNumber",
    "invoiceDetails",
    "invoiceDate",
    "signature",
  ];

  mandatoryFields.forEach((field) => {
    if (!formData[field]) {
      errors.push(`${field} is required.`);
    }
  });

  // Validate items
  formData.items.forEach((item, index) => {
    if (!item.description) {
      errors.push(`Description for item ${index + 1} is required.`);
    }
    if (item.unitPrice <= 0) {
      errors.push(`Unit Price for item ${index + 1} must be greater than 0.`);
    }
    if (item.quantity <= 0) {
      errors.push(`Quantity for item ${index + 1} must be greater than 0.`);
    }
    if (item.discount < 0) {
      errors.push(`Discount for item ${index + 1} cannot be negative.`);
    }
    if (item.taxRate < 0) {
      errors.push(`Tax Rate for item ${index + 1} cannot be negative.`);
    }
  });

  return errors;
};
