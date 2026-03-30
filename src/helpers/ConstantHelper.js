export const AUTH = {
  TOKEN: "track-it-token",
  TOKEN_PAYLOAD_KEY: "authorization",
  PUBLIC_REQUEST_KEY: "public-request",
};

export const HEADER = {
  CONTENT_TYPE: "application/json",
  MULTIPART_CONTENT_TYPE: "multipart/form-data,boundary=----WebKitFormBoundaryyrV7KO0BoCBuDbTL",
  TIMEOUT: 6000,
};

export const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const basicFields = [
  { name: "id", label: "ID" },
  { name: "company", label: "Company" },
  { name: "assetTag", label: "Asset Tag" },
  { name: "assetName", label: "Asset Name" },
  { name: "manufacturer", label: "Manufacturer" },
  { name: "model", label: "Asset Model" },
  { name: "category", label: "Category" },
  { name: "serial", label: "Serial" },
  { name: "purchaseDate", label: "Purchase Date" },
  { name: "purchaseCost", label: "Purchase Cost" },
  { name: "eolDate", label: "EOL" },
  { name: "orderNumber", label: "Order Number" },
  { name: "suppliers", label: "Suppliers" },
  { name: "location", label: "Location" },
  { name: "locationAddress", label: "Address" },
  { name: "defaultLocation", label: "Default Location" },
  { name: "defaultLocationAddress", label: "Default Location Address" },
  { name: "status", label: "Status" },
  { name: "warranty", label: "Warranty" },
  { name: "depreciation", label: "Depreciation" },
  { name: "checkoutDate", label: "Checkout Date" },
  { name: "lastCheckinDate", label: "Last Checkin Date" },
  { name: "expectedCheckinDate", label: "Expected Checkin Date" },
  { name: "createdAt", label: "Created At" },
  { name: "updatedAt", label: "Updated at" },
  { name: "deleted", label: "Deleted" },
  { name: "notes", label: "Notes" },
  { name: "url", label: "URL" },
];

export const checkedOutFields = [
  { name: "assignedTo", label: "Assigned To" },
  { name: "username", label: "Username" },
  { name: "employeeNumber", label: "Employee Number" },
  { name: "manager", label: "Manager" },
  { name: "department", label: "Department" },
  { name: "title", label: "Title" },
  { name: "phone", label: "Phone" },
  { name: "address", label: "Address" },
  { name: "city", label: "City" },
  { name: "state", label: "State" },
  { name: "country", label: "Country" },
  { name: "zip", label: "Zip" },
];

export const allFields = [...basicFields, ...checkedOutFields];
