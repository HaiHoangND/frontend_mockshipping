import dayjs from "dayjs";

export const productsPrice = (products) => {
  const totalPrice = products.reduce((accumulator, product) => {
    return accumulator + product.price * product.quantity;
  }, 0);
  return totalPrice;
};

export const convertCurrency = (number) => {
  return number.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

export const convertDateTime = (dateTime) => {
  const day = String(dateTime[2]).padStart(2, "0");
  const month = String(dateTime[1]).padStart(2, "0");
  const year = dateTime[0];

  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
};

export const formatDateTimeDetail = (dateTime) => {
  const [year, month, day, hours, minutes] = dateTime;

  const formattedMonth = String(month).padStart(2, "0");
  const formattedDay = String(day).padStart(2, "0");
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes} ${year}/${formattedMonth}/${formattedDay}`;
};

export const generateOrderCode = () => {
  const timestamp = dayjs().format("DDMMYYHHmmss"); // Get current timestamp in milliseconds
  const randomString = Math.random().toString(36).substring(2, 4); // Generate a random string of 6 characters
  const uppercaseRandomString = randomString.toUpperCase(); // Convert the random string to uppercase

  const orderCode = `ORD${timestamp}${uppercaseRandomString}`;
  return orderCode;
};

export const districtNames = [
  { value: "Ba Đình", label: "Ba Đình" },
  { value: "Hoàn Kiếm", label: "Hoàn Kiếm" },
  { value: "Đống Đa", label: "Đống Đa" },
  { value: "Thanh Xuân", label: "Thanh Xuân" },
  { value: "Hai Bà Trưng", label: "Hai Bà Trưng" },
  { value: "Cầu Giấy", label: "Cầu Giấy" },
  { value: "Nam Từ Liêm", label: "Nam Từ Liêm" },
  { value: "Bắc Từ Liêm", label: "Bắc Từ Liêm" },
  { value: "Tây Hồ", label: "Tây Hồ" },
  { value: "Hoàng Mai", label: "Hoàng Mai" },
  // Add other districts here...
];
