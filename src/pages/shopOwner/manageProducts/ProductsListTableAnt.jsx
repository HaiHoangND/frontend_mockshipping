import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Form,
  Input,
  InputNumber,
  Typography,
  Upload,
  Tag,
} from "antd";
import { DeleteOutlined, SaveOutlined, EditOutlined } from "@ant-design/icons";
import { useAuthUser } from "react-auth-kit";
import { useToastError, useToastSuccess } from "../../../utils/toastSettings";
import { publicRequest, userRequest } from "../../../requestMethods";
import { useNavigate } from "react-router-dom";
import { WarningModal } from "../../../components/warningModal/WarningModal";
import { convertCurrency } from "../../../utils/formatStrings";

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

const DeleteOneProductBtn = () => {
  return (
    <Button
      type="primary"
      danger
      style={{ marginRight: "8px" }}
      icon={<DeleteOutlined />}
      ghost
    >
      Xóa
    </Button>
  );
};

export const ProductsListTableAnt = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [totalCount, setTotalCount] = useState(1);
  const authUser = useAuthUser();
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.id === editingKey;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const getProducts = async (currentPage) => {
    try {
      setIsLoading(true);
      let res = await userRequest.get(
        `/productShop/getByShopOwnerId?ShopOwnerId=${
          authUser().id
        }&pageNumber=${currentPage}&pageSize=${pageSize}&keyWord=${searchQuery}`
      );
      if (res.data.type === "success") {
        setProducts(res.data.data.content);
        setTotalCount(res.data.data.totalElements);
        setPage(currentPage);
        setIsLoading(false);
      } else return useToastError("Something went wrong!");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts(1);
  }, [searchQuery]);

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
    console.log(record);
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
      let item;
      if (index > -1) {
        item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        item = newData[index];
        let res = await handleUpdateProduct(item);
        console.log(res);
        if (res) {
          return useToastError(res);
        } else {
          setData(newData);
          setEditingKey("");
        }
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleUpdateProduct = async (data) => {
    console.log(data);
    try {
      let res = await userRequest.put(`/productShop/${data.id}`, {
        name: data.name,
        quantity: data.quantity,
        price: data.price,
        image: data.image,
        weight: data.weight,
        description: data.description,
        productCode: data.productCode,
        shopOwnerId: authUser().id,
      });
      console.log(res);
      if (res.data.type === "success") {
        navigate(0);
      } else return res.data.message;
    } catch (error) {
      console.log(error);
    }
  };
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      align: "center",
      // editable: true,
      render: (image) => {
        return (
          <div
            style={{ maxWidth: "100px", height: "130px" }}
            className="flex justify-center items-center"
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
      title: "Mã mặt hàng",
      dataIndex: "productCode",
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
      editable: true,
      align:"center"
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      editable: true,
      align: "center",
    },
    {
      title: "Tình trạng",
      align: "center",
      dataIndex: "quantity",
      render: (quantity) => {
        let tagColor;
        let tagContent;
        if (quantity > 5) {
          tagColor = "green";
          tagContent = "Còn hàng";
        } else if (quantity <= 5 && quantity > 0) {
          tagColor = "yellow";
          tagContent = "Sắp hết hàng";
        } else if (quantity === 0) {
          tagColor = "red";
          tagContent = "Hết hàng";
        } else {
          // Handle any other cases here
          tagColor = "gray";
          tagContent = "Không rõ tình trạng";
        }
        return <Tag color={tagColor}>{tagContent}</Tag>;
      },
    },
    {
      title: "Sửa",
      dataIndex: "action",
      width: "18vw",
      align: "center",
      width:170,
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
              parameters={record}
              warningContent={"Bạn chắc muốn xóa sản phẩm này chứ?"}
              InitiateComponent={DeleteOneProductBtn}
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

  const handleDeleteSingleProduct = async (data) => {
    try {
      let res = await userRequest.delete(`/productShop/${data.id}`);
      if (res.data.type === "success") {
        navigate(0);
      } else return useToastError("Xóa sản phẩm thất bại");
    } catch (error) {
      console.log(error);
    }
    setEditingKey("");
  };

  useEffect(() => {
    setData(products);
  }, [products]);

  return (
    <Form form={form} component={false}>
      <Table
        rowKey={(_, record) => record.id}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        loading={isLoading}
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          pageSize: pageSize,
          current: page,
          total: totalCount,
          onChange: (page) => {
            getProducts(page);
          },
        }}
      />
    </Form>
  );
};
