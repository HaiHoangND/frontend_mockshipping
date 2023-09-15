import { DeleteOutlined, SaveOutlined, EditOutlined } from "@ant-design/icons";
import { LibraryAdd, Warning } from "@mui/icons-material";
import { Button, Form, Input, InputNumber, Table } from "antd";
import { useEffect, useRef, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import * as XLSX from "xlsx";
import CustomizedMenus from "../../pages/shopOwner/manageProducts/CustomizedMenus";
import { publicRequest } from "../../requestMethods";
import { useToastError, useToastSuccess } from "../../utils/toastSettings";
import { AddProductModal } from "../addProductModal/AddProductModal";
import { WarningModal } from "../warningModal/WarningModal";
import "./createOrderProductTable.scss";
import { convertCurrency } from "../../utils/formatStrings";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Hãy điền ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        <div className="centered-cell">{children}</div>
        // children
      )}
    </td>
  );
};

const SaveProductBtn = () => {
  return (
    <Button
      type="primary"
      style={{
        marginRight: "10px",
        display: "flex",
        alignItems: "center",
        backgroundColor: "green",
      }}
    >
      <LibraryAdd
        style={{
          paddingRight: "5px",
          fontSize: "17px",
        }}
      />{" "}
      Xác nhận
    </Button>
  );
};

const ClearProductsBtn = () => {
  return (
    <Button danger type="primary" style={{ marginLeft: "10px" }} icon={<DeleteOutlined />}>
      Xóa tất cả sản phẩm
    </Button>
  );
};

const DeleteSingleProductBtn = () => {
  return (
    <Button
      type="primary"
      danger
      style={{
        marginRight: 8,
      }}
      icon={<DeleteOutlined />}
    >
      Xóa
    </Button>
  );
};

export const CreateOrderProductTable = ({
  onProductPriceChange,
  onProductWeightChange,
  onProductChange,
}) => {
  const [products, setProducts] = useState([]);
  const fileInputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const authUser = useAuthUser();
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.productCode === editingKey;

  useEffect(() => {
    setData(products);
  }, [products]);

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      quantity: 0,
      price: 0.0,
      image: "",
      productCode: "",
      weight: 0.0,
      description: "",
      ...record,
    });
    setEditingKey(record.productCode);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      console.log(key);
      console.log(data);
      const newData = [...data];
      console.log(newData);
      const index = newData.findIndex((item) => key === item.productCode);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      // editable: true,
      align:"center",
      render: (image) => {
        return (
          <div style={{ maxWidth: "100px", height: "130px" }}>
            <img style={{ width: "100%" }} src={image} />
          </div>
        );
      },
    },
    {
      title: "Tên mặt hàng",
      dataIndex: "name",
      editable: true,
      align:"center"
    },
    {
      title: "Mã mặt hàng",
      dataIndex: "productCode",
      editable: true,
      align:"center"
    },
    {
      title: "Cân nặng",
      dataIndex: "weight",
      editable: true,
      align:"center",
      render: (text)=>(
        <span>{text} kg</span>
      )
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      editable: true,
      align:"center",
      render:(text)=>(
        <span>{convertCurrency(text)}</span>
      )
    },
    {
      title: "Mô tả sản phẩm",
      dataIndex: "description",
      editable: true,
      
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      editable: true,
      align:"center"
    },
    {
      title: "Sửa",
      dataIndex: "action",
      width: "18vw",
      align: "center",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span className="flex">
            <Button
              type="primary"
              onClick={() => save(record.productCode)}
              style={{
                marginRight: 8,
              }}
              icon={<SaveOutlined />}
            >
              Lưu
            </Button>

            <WarningModal
              confirmFunction={handleDeleteSingleProduct}
              parameters={record.productCode}
              warningContent={"Bạn chắc muốn xóa sản phẩm này khỏi bảng không?"}
              InitiateComponent={DeleteSingleProductBtn}
            />
            <Button
              onClick={cancel}
              style={{
                marginRight: 8,
              }}
            >
              Hủy
            </Button>
          </span>
        ) : (
          <Button
            style={{ width: "100px" }}
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
            icon={<EditOutlined />}
          />
           
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "quantity" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const handleCheckProductCode = async () => {
    let messArray = [];
    for (let i = 0; i < data.length; ++i) {
      try {
        let res = await publicRequest.get(
          `/productShop/checkNotExistedProductCode?ShopOwnerId=${
            authUser().id
          }&productCode=${data[i].productCode}`
        );
        if (res && res.data.type === "failed") {
          messArray.push(res.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
    console.log(messArray);
    return messArray;
  };

  const handlePostProducts = async () => {
    if (data && data.length === 0) {
      useToastError("Hàng chưa được tải lên !");
    } else {
      console.log(data);
      let checkedArray = await handleCheckProductCode();
      console.log(checkedArray);
      if (checkedArray.length === 0) {
        useToastSuccess("Không có mã sản phẩm nào bị trùng");
        for (let i = 0; i < data.length; ++i) {
          try {
            let res = await publicRequest.post(`/productShop`, {
              name: data[i].name,
              quantity: data[i].quantity,
              price: data[i].price,
              image: data[i].image,
              weight: data[i].weight,
              description: data[i].description,
              productCode: data[i].productCode,
              shopOwnerId: authUser().id,
            });
            console.log(res);
            if (res.data.type === "success") {
              console.log(res);
            } else console.log(res);
          } catch (error) {
            console.log(error);
          }
        }
        useToastSuccess("Thêm vào kho thành công");
        handleClearProducts();
      } else {
        for (let i = 0; i < checkedArray.length; i++) {
          useToastError(checkedArray[i]);
        }
      }
    }
  };

  const handleOpenChange = (newValue) => {
    setIsOpen(newValue);
  };

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
        productCode: inputs.productCode,
      },
    ]);

    onProductChange((prevProducts) => [
      ...prevProducts,
      {
        productCode: inputs.productCode,
        image: imageURL,
        name: inputs.name,
        price: parseInt(inputs.price),
        quantity: parseInt(inputs.quantity),
        description: inputs.description,
        weight: parseFloat(inputs.weight),
        productCode: inputs.productCode,
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

  const handleDeleteSingleProduct = (productCode) => {
    // const changedProductsArray = removeItemByIndex(products, index);
    console.log("đã vô");
    const newData = products.filter((item) => item.productCode !== productCode);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // This clears the selected file
    }
    setProducts(newData);
    onProductChange(products);
    setEditingKey("");
  };

  return (
    <div>
      <AddProductModal
        style={{ textAlign: "center" }}
        isOpenModal={isOpen}
        handleOpenChange={handleOpenChange}
        handleAddProduct={handleAddProduct}
      />
      <div className="uploadExcelBtn">
        <WarningModal
          InitiateComponent={SaveProductBtn}
          warningContent={"Ban có chắc muốn thêm những sản phẩm này không?"}
          confirmFunction={handlePostProducts}
        />

        <CustomizedMenus
          handleExelClick={handleUploadExcel}
          handleOpenChange={handleOpenChange}
          isOpenModal={isOpen}
        />

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
      <Form form={form} component={false}>
        <Table
          rowKey={(_, record) => record.productCode}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </div>
  );
};
