import axios from "axios";
import { districts } from "./shortestPath.js";
import * as XLSX from "xlsx";
import fs from "fs"

const warehouses = [
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

const registerCoordinator = async () => {
  await axios.post("http://localhost:8080/api/register", {
    fullName: "Tran Phi Long",
    email: "longtp6@gmail.com",
    password: "12345678",
    role: "COORDINATOR",
    address: "string",
    gender: "string",
    phone: "string",
    warehouseID: 4,
    workingStatus: true,
  });
};

// registerShipper()

const vietnameseNamesWithDiacritics = [
  "Nguyễn Văn A",
  "Trần Thị Bình",
  "Lê Đức Cường",
  "Phạm Minh Đức",
  "Huỳnh Thị Hương",
  "Hoàng Văn Hùng",
  "Phan Thị Lan Anh",
  "Vũ Đình Liên",
  "Võ Thị Mai",
  "Đặng Xuân Minh",
  "Bùi Hồng Nga",
  "Đỗ Văn Quân",
  "Ngô Thị Thảo",
  "Dương Văn Tuấn",
  "Lý Thị Thủy",
  "Tô Văn Toàn",
  "Hà Minh Tuấn",
  "Nguyễn Thị Ngọc Anh",
  "Nguyễn Văn Hoàng",
  "Trần Thị Thu Hà",
];

const shopOwnerNames = [
  "Trần Thị Thuận",
  "Lê Văn Tâm",
  "Phạm Thị Tuyết",
  "Võ Thành Đạt",
  "Đặng Thị Hoa",
  "Đỗ Văn Thịnh",
  "Ngô Thị Thủy",
  "Dương Minh Tâm",
  "Lý Văn Tú",
  "Tô Thị Thu Hà",
  "Hà Văn Thanh",
  "Nguyễn Thị Thu Hằng",
  "Trần Văn Trường",
  "Nguyễn Thị Phượng",
  "Nguyễn Văn Hiệp",
  "Trần Thị Hoài",
  "Nguyễn Văn Phúc",
  "Vũ Thị Loan",
  "Hoàng Thị Mai",
  "Phan Thị Kim",
  "Võ Minh Trí",
  "Lê Thị Hoàng",
  "Phạm Thị Loan",
  "Trần Minh Khánh",
  "Lê Thị Hồng",
  "Phạm Minh Tuấn",
  "Lê Văn Tú",
  "Nguyễn Văn Lợi",
  "Trần Văn Đạt",
  "Nguyễn Thị Phúc",
  "Trần Đình Tuấn",
  "Nguyễn Thị Thu Thảo",
  "Vũ Thị Thu Hà",
  "Đặng Văn Tâm",
  "Đỗ Thị Quỳnh",
  "Ngô Minh Tuấn",
  "Dương Văn Hoàng",
  "Lý Thị Thanh",
  "Tô Minh Tuấn",
  "Hà Thị Hương",
  "Nguyễn Văn Trung",
];

const streets = [
  "An Trạch",
  "Bích Câu",
  "Cát Linh",
  "Cầu Mới",
  "Chợ Khâm Thiên",
  "Chùa Bộc",
  "Chùa Láng",
  "Đại La",
  "Đặng Tiến Đông",
  "Đặng Trần Côn",
  "Bùi Xương Trạch",
  "Chính Kinh",
  "Cù Chính Lan",
  "Cự Lộc",
  "Đại La",
  "Định Công",
  "Giải Phóng",
  "Giáp Nhất",
  "Hạ Đình",
  "Hà Kế Tấn",
  "Lê Trực",
  "Liễu Giai",
  "Linh Lang",
  "Lý Nam Đế",
  "Lý Văn Phức",
  "Mạc Đĩnh Chi",
  "Mai Anh Tuấn",
  "Nam Cao",
  "Nam Tràng",
  "Nghĩa Dũng",
  "Ngọc Hà",
  "Ngọc Khánh",
  "Ngũ Xã",
];

function generateRandomAddress(streets, districts) {
  // Select a random street from the 'streets' array
  const randomStreet = streets[Math.floor(Math.random() * streets.length)];

  // Select a random district from the 'districts' array
  const randomDistrict =
    districts[Math.floor(Math.random() * districts.length)];

  // Generate a random street number (between 1 and 999)
  const randomStreetNumber = Math.floor(Math.random() * 999) + 1;

  // Combine the components to form the address
  const address = `${randomStreetNumber} ${randomStreet}, ${randomDistrict.district}`;

  return address;
}

const generatePhoneNumber = () => {
  const phoneNumber =
    "0" +
    Math.floor(Math.random() * 10000000000)
      .toString()
      .padStart(10, "0");
  return phoneNumber;
};

function removeDiacritics(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function generateEmail(name) {
  const nameWithoutAccents = removeDiacritics(name);
  const randomNumbers = Math.floor(Math.random() * 100);
  const email =
    nameWithoutAccents.replace(/\s/g, "") +
    randomNumbers.toString().padStart(2, "0") +
    "@gmail.com";
  return email.toLowerCase();
}

const addShippers = async () => {
  for (const person of vietnameseNamesWithDiacritics) {
    await axios.post("http://localhost:8080/api/register", {
      fullName: person,
      email: generateEmail(person),
      password: "12345678",
      role: "SHIPPER",
      address: "string",
      gender: "string",
      phone: generatePhoneNumber(),
      workingStatus: true,
    });
  }
};

const addShopOwners = async () => {
  for (const person of shopOwnerNames) {
    await axios.post("http://localhost:8080/api/register", {
      fullName: person,
      email: generateEmail(person),
      password: "12345678",
      role: "SHOP",
      address: generateRandomAddress(streets, districts),
      gender: "string",
      phone: generatePhoneNumber(),
      workingStatus: true,
    });
  }
};

const addReceivers = async () => {
  const getShopOwners = await axios.get(
    "http://localhost:8080/api/user/getAllShopOwnerNoPage"
  );

  const shopOwners = getShopOwners.data.data;

  for (const owner of shopOwners) {
    for (const person of vietnameseNamesWithDiacritics) {
      await axios.post("http://localhost:8080/api/receiver", {
        name: person,
        address: generateRandomAddress(streets, districts),
        phone: generatePhoneNumber(),
        shopOwnerId: owner.id,
      });
    }
  }
};

const products = [
  {
    productCode: "SP001",
    name: "Áo thun nam trắng",
    image:
      "https://teefit.vn/wp-content/uploads/2018/04/ao-thun-tron-trang.jpg",
    description: "Áo thun nam màu trắng size M",
    price: 250000,
    quantity: 50,
    weight: 0.2,
  },
  {
    productCode: "SP002",
    name: "Balo du lịch",
    image:
      "https://product.hstatic.net/1000379600/product/bl8227a_xanh-duong_2_9aae4dcf9c58439098801f1b29954133_large.png",
    description: "Balo du lịch dung tích lớn",
    price: 800000,
    quantity: 10,
    weight: 1.5,
  },
  {
    productCode: "SP003",
    name: "Quần jeans nam",
    image:
      "https://bizweb.dktcdn.net/100/438/408/products/qjm5033-xah3.jpg?v=1690163834653",
    description: "Quần jeans nam màu xanh đậm",
    price: 350000,
    quantity: 40,
    weight: 0.4,
  },
  {
    productCode: "SP004",
    name: "Tai nghe Bluetooth",
    image:
      "https://fptshop.com.vn/Uploads/Originals/2021/12/3/637741420241255172_avt.jpg",
    description: "Tai nghe Bluetooth không dây",
    price: 150000,
    quantity: 25,
    weight: 0.15,
  },
  {
    productCode: "SP005",
    name: "Máy ảnh DSLR",
    image:
      "https://images.thegioididong.com/Files/2009/05/21/5305/image-Top-5-may-anh-DSLR-entry-level.jpg",
    description: "Máy ảnh DSLR Canon EOS 700D",
    price: 1500000,
    quantity: 15,
    weight: 2.0,
  },
  {
    productCode: "SP006",
    name: "Đồng hồ đeo tay nam",
    image:
      "https://cdn.tgdd.vn//News/1178420//nen-mua-dong-ho-nam-hang-nao-cac-tieu-chi-lua-chon-thuong-02.2.1-800x575-800x575.jpg",
    description: "Đồng hồ đeo tay nam thời trang",
    price: 300000,
    quantity: 35,
    weight: 0.2,
  },
  {
    productCode: "SP007",
    name: "Máy tính xách tay",
    image:
      "https://tandoanh.vn/wp-content/uploads/2022/10/Dell-Inspiron-15-3530-H1.jpg",
    description: "Laptop Dell Inspiron 15",
    price: 12000000,
    quantity: 20,
    weight: 1.8,
  },
  {
    productCode: "SP008",
    name: "Giày thể thao nữ",
    image:
      "https://bizweb.dktcdn.net/100/413/756/articles/c2dd15717db1763e26b59304b3032f5d.jpg?v=1633506311850",
    description: "Giày thể thao nữ Nike",
    price: 280000,
    quantity: 40,
    weight: 0.5,
  },
  {
    productCode: "SP009",
    name: "Áo khoác nam",
    image:
      "https://salt.tikicdn.com/cache/w1200/ts/product/65/84/23/937c418d184427f09b8e90226c49ebc6.jpg",
    description: "Áo khoác nam dáng dài",
    price: 450000,
    quantity: 20,
    weight: 0.8,
  },
  {
    productCode: "SP010",
    name: "Bộ nồi chảo",
    image:
      "https://bonoi.vn/wp-content/uploads/2017/08/bo-noi-Elmich-Premium-EL-3134.jpg",
    description: "Bộ nồi chảo đáy từ",
    price: 3500000,
    quantity: 10,
    weight: 4.0,
  },
  {
    productCode: "SP011",
    name: "Bàn làm việc",
    image:
      "https://noithathoaphat.com/Uploads/images/ban-lam-viec/ban-nhan-vien/ban-lam-viec-AT100SHL3D.jpg",
    description: "Bàn làm việc gỗ sồi tự nhiên",
    price: 1100000,
    quantity: 15,
    weight: 3.5,
  },
  {
    productCode: "SP012",
    name: "Áo sơ mi nữ",
    image:
      "https://dongphucunicorn.com/wp-content/uploads/2019/12/ao-so-mi-trang-ngay-tay-basic-nu.jpg",
    description: "Áo sơ mi nữ màu trắng",
    price: 180000,
    quantity: 45,
    weight: 0.3,
  },
];


function convertToXLSX(products) {
  // Create a new worksheet
  const ws = XLSX.utils.json_to_sheet(products);

  // Create a workbook and add the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Products');

  // Write the workbook to a file
  XLSX.writeFile(wb, 'products.xlsx');
}

convertToXLSX(products)

const addProducts = async () => {
  const getShopOwners = await axios.get(
    "http://localhost:8080/api/user/getAllShopOwnerNoPage"
  );

  const shopOwners = getShopOwners.data.data;
  for (const owner of shopOwners) {
    for (const product of products) {
      await axios.post("http://localhost:8080/api/productShop", {
        productCode: product.productCode,
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        image: product.image,
        weight: product.weight,
        description: product.description,
        shopOwnerId: owner.id,
      });
    }
  }
};



// addProducts();

// addReceivers();

// addShopOwners()

// addShippers();
