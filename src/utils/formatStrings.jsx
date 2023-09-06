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
