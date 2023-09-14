import { useEffect, useRef, useState } from "react";
import "./createOrderProductTable.scss";
import * as XLSX from "xlsx";
import { convertCurrency } from "../../utils/formatStrings";
import { AddProductModal } from "../addProductModal/AddProductModal";
import { WarningModal } from "../warningModal/WarningModal";
import { Delete, LibraryAdd } from "@mui/icons-material";
import { removeItemByIndex } from "../../utils/getLastArrayItem";
import CustomizedMenus from "../../pages/shopOwner/manageProducts/CustomizedMenus";
import { Button, Table, Form, Input, InputNumber, Typography } from "antd";
import { useAuthUser } from "react-auth-kit";
import { useToastError, useToastSuccess } from "../../utils/toastSettings";
import { publicRequest } from "../../requestMethods";

import { toast } from "react-toastify";


const DeleteProductBtn = () => {
  return (
    <button className="deleteSingleProductBtn">
      <Delete />
    </button>
  );
};

const ClearProductsBtn = () => {
  return <Button danger type="primary" style={{ marginLeft: '10px' }}>Xóa tất cả sản phẩm</Button>;
};

export const CreateOrderProductTable = ({
  onProductPriceChange,
  onProductWeightChange,
  onProductChange,
}) => {
  const [products, setProducts] = useState([]);
  const fileInputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const authUser = useAuthUser();
  const [form] = Form.useForm();
  const [isEditing, setEditing] = useState(false);
  const [temp, setTemp] = useState({
    image: '',
    name: '',
    weight: '',
    price: '',
    description: '',
  })


  useEffect(() => {
    console.log(temp);
    form.setFieldValue({
      image: temp.image,
      name: temp.name,
      weight: temp.weight,
      price: temp.price,
      description: temp.description,
    })
  }, [temp]);

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      render: (image, record) => {
        if (editingRow === record.id) {
          return <Form.Item
            name="image"
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Hãy điền đủ thông tin`,
              },
            ]}
          >
            <Input />
          </Form.Item>
        } else {
          return <div style={{ maxWidth: "100px" }}>
            <img style={{ width: "100%" }} src={image} />
          </div>
        }
      },
    },
    {
      title: "Tên mặt hàng",
      dataIndex: "name",
      render: (text, record) => {
        if (editingRow === record.id) {
          return <Form.Item
            name="name"
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Hãy điền đủ thông tin`,
              },
            ]}
          >
            <Input />
          </Form.Item>
        } else {
          return <p>{text}</p>
        }
      }
    },
    {
      title: "Cân nặng",
      dataIndex: "weight",
      render: (text, record) => {
        if (editingRow === record.id) {
          return <Form.Item name="weight"
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Hãy điền đủ thông tin`,
              },
            ]}
          >
            <Input />
          </Form.Item>
        } else {
          return <p>{text}</p>
        }
      }
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      render: (text, record) => {
        if (editingRow === record.id) {
          return <Form.Item name="price"
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Hãy điền đủ thông tin!`,
              },
            ]}
          >
            <Input />
          </Form.Item>
        } else {
          return <p>{text}</p>
        }
      }
    },
    {
      title: "Mô tả sản phẩm",
      dataIndex: "description",
      render: (text, record) => {
        if (editingRow === record.id) {
          return <Form.Item name="description"
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Hãy điền đủ thông tin!`,
              },
            ]}
          >
            <Input />

          </Form.Item>
        } else {
          return <p>{text}</p>
        }
      }
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      render: (text, record) => {
        if (editingRow === record.id) {
          return <Form.Item
            style={{ margin: 0 }}
            name="quantity"
            rules={[
              {
                required: true,
                message: `Hãy điền đủ thông tin!`,
              },
            ]}
          >
            <Input />
          </Form.Item>
        } else {
          return <p>{text}</p>
        }
      }
    },
    {
      title: "Actions",
      dataIndex: "action",
      render: (_, record, index) => {
        return (
          <div style={{ width: "18vw" }}>
            {/* {editingRow && editingRow === record.id ?
              <Button
                htmlType="submit"
                type="primary"
                color="geekblue"
                // onClick={() => handleSaveProductTemporary(record)}
                style={{ marginRight: '20px' }}

              >Lưu lại
              </Button> : */}
            <Button
              type="primary"
              color="geekblue"
              onClick={() => {
                // setEditingRow(index);
                console.log(index);
                // setTemp({
                //   image: record.image,
                //   name: record.name,
                //   weight: record.weight,
                //   price: record.price,
                //   description: record.description,
                // })
              }}
              style={{ marginRight: '20px' }}>
              Chỉnh sửa
            </Button>
            {/* } */}
            <Button type="primary" danger

            >
              Xóa sản phẩm
            </Button>
          </div>
        );
      },
    },
  ];

  const handlePostProducts = async () => {
    console.log(products);
    if (products && products.length === 0) {
      useToastError("Hàng chưa được tải lên !");
    } else {
      for (let i = 0; i < products.length; ++i) {
        try {
          let res = await publicRequest.post(
            `/productShop`, {
            name: products[i].name,
            quantity: products[i].quantity,
            price: products[i].price,
            image: products[i].image,
            weight: products[i].weight,
            description: products[i].description,
            shopOwnerId: authUser().id
          }
          );
          if (res.data.type === "success") {
            console.log(res);
          } else return useToastError("Something went wrong!");
        } catch (error) {
          console.log(error);
        }
      }
      useToastSuccess("Thêm vào kho thành công");
      handleClearProducts();
    }
  }

  const handleOpenChange = (newValue) => {
    setIsOpen(newValue);
  }

  const handleUploadExcel = () => {
    fileInputRef.current.click();
  };

  const handleClearProducts = () => {
    setProducts([]);
    onProductChange([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // This clears the selected file
    }
  };

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setProducts((prevProducts) => [...prevProducts, ...parsedData]);
      onProductChange((prevProducts) => [...prevProducts, ...parsedData]);
    };
  };

  const handleAddProduct = (inputs, imageURL) => {
    console.log(inputs, imageURL);
    setProducts((prevProducts) => [
      ...prevProducts,
      {
        image: imageURL,
        name: inputs.name,
        price: parseInt(inputs.price),
        quantity: parseInt(inputs.quantity),
        description: inputs.description,
        weight: parseFloat(inputs.weight),
      },
    ]);

    onProductChange((prevProducts) => [
      ...prevProducts,
      {
        image: imageURL,
        name: inputs.name,
        price: parseInt(inputs.price),
        quantity: parseInt(inputs.quantity),
        description: inputs.description,
        weight: parseFloat(inputs.weight),
      },
    ]);
  };
  useEffect(() => {
    let productWeight = 0;
    let productPrice = 0;
    for (const product of products) {
      if (product.weight && product.price) {
        productWeight = productWeight + product.weight * product.quantity;
        productPrice = productPrice + product.price * product.quantity;
      }
    }
    onProductWeightChange(productWeight);
    onProductPriceChange(productPrice);
  }, [products]);

  const handleDeleteSingleProduct = (index) => {
    const changedProductsArray = removeItemByIndex(products, index);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // This clears the selected file
    }
    setProducts(changedProductsArray);
    onProductChange(changedProductsArray);
  };

  const onFinish = (values) => {
    console.log({ values });
    // const updateData =[...products]
    // updateData.splice(editingRow,1,values)
  }

  return (
    <div>
      <AddProductModal style={{ textAlign: "center" }} isOpenModal={isOpen}
        handleOpenChange={handleOpenChange}
        handleAddProduct={handleAddProduct} />
      <div className="uploadExcelBtn">
        <Button type='primary' style={{
          marginRight: "10px",
          display: "flex",
          alignItems: "center",
          backgroundColor: "green"
        }}
          onClick={handlePostProducts}
        >

          <LibraryAdd style={{
            paddingRight: "5px",
            fontSize: "17px"
          }} /> Thêm hàng</Button>
        <CustomizedMenus handleExelClick={handleUploadExcel}
          handleOpenChange={handleOpenChange}
          isOpenModal={isOpen} />

        <WarningModal
          InitiateComponent={ClearProductsBtn}
          warningContent={"Ban có chắc muốn xóa tất cả sản phẩm không?"}
          confirmFunction={handleClearProducts}
        />
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          ref={fileInputRef}
        />
      </div>
      <Form form={form} onFinish={onFinish}>
        <Table
          columns={columns}
          dataSource={products}
          rowKey={(record, index) => index}
        />
      </Form>

      {/* <table>
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Tên mặt hàng</th>
            <th>Số lượng</th>
            <th>Cân nặng</th>
            <th>Đơn giá</th>
            <th>Mô tả sản phẩm</th>
            <th style={{ textAlign: "center" }}>Xóa sản phẩm</th>
          </tr>
        </thead>

        <tbody>
          {products.length > 0 &&
            products.map((product, index) => (
              <tr key={index}>
                <td>
                  <div style={{ width: "100px" }}>
                    <img
                      src={product.image}
                      alt=""
                      style={{ maxWidth: "100%", objectFit: "cover" }}
                    />
                  </div>
                </td>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>{product.weight} KG</td>
                <td>{convertCurrency(product.price)}</td>
                <td>{product.description}</td>
                <td style={{ textAlign: "center" }}>
                  <WarningModal
                    InitiateComponent={DeleteProductBtn}
                    warningContent={"Bạn có chắc muốn xóa sản phẩm này chứ"}
                    confirmFunction={handleDeleteSingleProduct}
                    parameters={index}
                  />
                </td>
              </tr>
            ))}
          <tr>
            <td style={{ textAlign: "center" }} colSpan={7}>
              <AddProductModal isOpenModal={isOpen}
                handleOpenChange={handleOpenChange}
                handleAddProduct={handleAddProduct} />
            </td>
          </tr>
        </tbody>
      </table> */}
    </div>
  );
};
