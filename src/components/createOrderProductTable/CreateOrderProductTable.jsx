import { DeleteOutlined, SaveOutlined, EditOutlined } from "@ant-design/icons";
import { LibraryAdd, Warning } from "@mui/icons-material";
import { Button, Form, Input, InputNumber, Table } from "antd";
import { useEffect, useRef, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import * as XLSX from "xlsx";
import CustomizedMenus from "../../pages/shopOwner/manageProducts/CustomizedMenus";
import { publicRequest, userRequest } from "../../requestMethods";
import { useToastError, useToastSuccess } from "../../utils/toastSettings";
import { AddProductModal } from "../addProductModal/AddProductModal";
import { WarningModal } from "../warningModal/WarningModal";
import "./createOrderProductTable.scss";
import { convertCurrency } from "../../utils/formatStrings";
import { v4 } from "uuid";
import { generateProductCode } from "../../utils/addData";
import { useNavigate } from "react-router-dom";
import { getIndexOfItem } from "../../utils/getLastArrayItem";

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
    <Button
      danger
      type="primary"
      style={{ marginLeft: "10px" }}
      icon={<DeleteOutlined />}
    >
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
      ghost
    >
      Xóa
    </Button>
  );
};

export const CreateOrderProductTable = () => {
  const [products, setProducts] = useState([]);
  const fileInputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const authUser = useAuthUser();
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.id === editingKey;
  const navigate = useNavigate();

  useEffect(() => {
    setData(products);
  }, [products]);

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      quantity: 0,
      price: 0.0,
      image: "",
      id: "",
      weight: 0.0,
      description: "",
      ...record,
    });
    setEditingKey(record.id);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.id);
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
      align: "center",
      render: (image) => {
        return (
          <div
            style={{ maxWidth: "100px", height: "130px" }}
            className="flex items-center justify-center"
          >
            <img style={{ width: "100%" }} src={image} />
          </div>
        );
      },
    },
    {
      title: "Tên mặt hàng",
      dataIndex: "name",
      editable: true,
      align: "center",
    },
    {
      title: "Cân nặng",
      dataIndex: "weight",
      editable: true,
      align: "center",
      render: (text) => <span>{text} kg</span>,
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      editable: true,
      align: "center",
      render: (text) => <span>{convertCurrency(text)}</span>,
    },
    {
      title: "Mô tả sản phẩm",
      dataIndex: "description",
      align: "center",
      editable: true,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      editable: true,
      align: "center",
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
              onClick={() => save(record.id)}
              style={{
                marginRight: 8,
              }}
              icon={<SaveOutlined />}
              ghost
            >
              Lưu
            </Button>

            <WarningModal
              confirmFunction={handleDeleteSingleProduct}
              parameters={record.id}
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
        let res = await userRequest.get(
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
    // console.log(messArray);
    return messArray;
  };

  const validateProducts = (products) => {
    for (const product of products) {
      const productIndex = getIndexOfItem(products, product.id);
      if (!product.name) {
        useToastError(`Chưa điền tên sản phẩm thứ ${productIndex + 1}`);
        return false;
      } else if (!product.price) {
        useToastError(`Chưa điền đơn giá sản phẩm ${product.name}`);
        return false;
      } else if (!product.quantity) {
        useToastError(`Chưa điền số lượng sản phẩm ${product.name}`);
        return false;
      } else if (product.quantity <= 0) {
        useToastError(`Số lượng của sản phẩm ${product.name} sai định dạng`);
        return false;
      } else if (!product.weight) {
        useToastError(`Chưa điền cân nặng sản phẩm ${product.name}`);
        return false;
      } else if (!product.description) {
        useToastError(`Chưa điền mô tả sản phẩm ${product.name}`);
        return false;
      } else {
        continue;
      }
    }
    return true;
  };

  const handlePostProducts = async () => {
    if (data && data.length === 0) {
      useToastError("Hàng chưa được tải lên !");
    } else if (!validateProducts(data)) {
      return;
    } else {
      let checkedArray = await handleCheckProductCode();
      if (checkedArray.length === 0) {
        for (let i = 0; i < data.length; ++i) {
          try {
            let res = await userRequest.post(`/productShop`, {
              name: data[i].name,
              quantity: data[i].quantity,
              price: data[i].price,
              image: data[i].image,
              weight: data[i].weight,
              description: data[i].description,
              productCode: v4(),
              shopOwnerId: authUser().id,
            });
            await userRequest.put(`/productShop/${res.data.data.id}`, {
              name: data[i].name,
              quantity: data[i].quantity,
              price: data[i].price,
              image: data[i].image,
              weight: data[i].weight,
              description: data[i].description,
              productCode: generateProductCode(res.data.data.id),
              shopOwnerId: authUser().id,
            });
          } catch (error) {
            console.log(error);
          }
        }
        handleClearProducts();
        navigate(0);
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
      const parsedDataWithId = parsedData.map((item) => ({
        ...item,
        id: v4(), // Replace 'someValue' with the actual value you want to set
        image: item.image ? item.image : 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg',
      }));
      setProducts((prevProducts) => [...prevProducts, ...parsedDataWithId]);
    };
  };

  const handleAddProduct = (inputs, imageURL) => {
    setProducts((prevProducts) => [
      ...prevProducts,
      {
        id: inputs.id,
        image: imageURL,
        name: inputs.name,
        price: parseInt(inputs.price),
        quantity: parseInt(inputs.quantity),
        description: inputs.description,
        weight: parseFloat(inputs.weight),
      },
    ]);
  };

  const handleDeleteSingleProduct = (id) => {
    // const changedProductsArray = removeItemByIndex(products, index);
    const newData = products.filter((item) => item.id !== id);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // This clears the selected file
    }
    setProducts(newData);
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
          rowKey={(record) => record.id}
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
