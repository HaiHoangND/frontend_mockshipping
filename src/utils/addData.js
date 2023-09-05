import axios from "axios";

const warehouses = [
  {
    address: "Tru So",
    name: "Trụ sở",
  },
  {
    address: "Nha chu shop",
    name: "Nhà chủ shop",
  },
  {
    address: "Nha khach",
    name: "Nhà khách",
  },
  {
    address: "Ba Dinh",
    name: "Kho Ba Đình",
  },
  {
    address: "Hoan Kiem",
    name: "Kho Hoàn Kiếm",
  },
  {
    address: "Dong Da",
    name: "Kho Đống Đa",
  },
  {
    address: "Thanh Xuan",
    name: "Kho Thanh Xuân",
  },
  {
    address: "Hai Ba Trung",
    name: "Kho Hai Bà Trưng",
  },
  {
    address: "Cau Giay",
    name: "Kho Cầu Giấy",
  },
  {
    address: "Nam Tu Liem",
    name: "Kho Nam Từ Liêm",
  },
  {
    address: "Bac Tu Liem",
    name: "Kho Bắc Từ Liêm",
  },
  {
    address: "Tay Ho",
    name: "Kho Tây Hồ",
  },
];

const addWarehouse = async () => {
  for (const warehouse of warehouses) {
    await axios.post("http://localhost:8080/api/warehouse", {
      address: warehouse.address,
      name: warehouse.name,
    });
  }
};

// addWarehouse()

const register = async () => {
  await axios.post("http://localhost:8080/api/register",{
    fullName: "Tran Phi Long",
    email: "longtp6@gmail.com",
    password: "12345678",
    role: "COORDINATOR",
    address: "string",
    gender: "string",
    phone: "string",
    warehouseID: 4,
    workingStatus: true
  })
}

// register()