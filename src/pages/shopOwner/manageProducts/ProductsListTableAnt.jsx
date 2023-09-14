import React, { useEffect, useState } from "react";
import { Button, Table, Form, Input, InputNumber, Typography, Upload } from "antd";
import { useAuthUser } from "react-auth-kit";
import { useToastError, useToastSuccess } from "../../../utils/toastSettings";
import { publicRequest } from "../../../requestMethods";

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
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
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
      ) : (<div className="centered-cell">{children}</div>
        // children
      )}
    </td>
  );
};
export const ProductsListTableAnt = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const authUser = useAuthUser();
  const role = authUser().role;
  const [searchQuery, setSearchQuery] = useState("");
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record) => record.productCode === editingKey;

  const getProducts = async () => {
    try {
      let res = await publicRequest.get(
        `/productShop/getByShopOwnerId?ShopOwnerId=${authUser().id}&pageNumber=${5}&pageSize=${5}`
      );
      console.log(res);
      if (res.data.type === "success") {
        setProducts(res.data.data.content);
      } else return useToastError("Something went wrong!");
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    getProducts();
  }, []);

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      quantity: 0,
      price: 0.0,
      image: "",
      productCode: '',
      weight: 0.0,
      description: "",
      ...record,
    });
    console.log(record);
    setEditingKey(record.productCode);
  };
  const cancel = () => {
    setEditingKey('');
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.productCode);
      let item
      if (index > -1) {
        item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        item = newData[index];
        let res = await handleUpdateProduct(item);
        console.log(res);
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    }
    catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleUpdateProduct = async (data) => {
    console.log(data);
    try {
      let res = await publicRequest.put(
        `/productShop/${data.id}`, {
        name: data.name,
        quantity: data.quantity,
        price: data.price,
        image: data.image,
        weight: data.weight,
        description: data.description,
        productCode: data.productCode,
        shopOwnerId: authUser().id
      }
      );
      console.log(res);
      if (res.data.type === "success") {
        useToastSuccess("Cập nhật sản phẩm thành công");
      } else return useToastError("Cập nhật sản phẩm thất bại");
    } catch (error) {
      console.log(error);
    }
  }
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      // editable: true,
      render: (image) => {
        return (
          <div style={{ maxWidth: "100px", height: "130px" }}>
            <img style={{ width: "100%" }} src={image} />
          </div>
        )
      }
    },
    {
      title: "Tên mặt hàng",
      dataIndex: "name",
      editable: true,
    },
    {
      title: "Mã mặt hàng",
      dataIndex: "productCode",
      // editable: true,
    },
    {
      title: "Cân nặng",
      dataIndex: "weight",
      editable: true,
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      editable: true,
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
    },
    {
      title: "Actions",
      dataIndex: "action",
      width: '18vw',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              type="primary"
              onClick={() => save(record.productCode)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Button>
            <Button onClick={cancel}
              style={{
                marginRight: 8,
              }}>
              <a>Cancel</a>
            </Button>
            <Button type="primary"
              onClick={() => handleDeleteSingleProduct(record)}
              danger>Xóa sản phẩm</Button>
          </span>
        ) : (
          <Button
            style={{ width: '100px' }}
            disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Button>
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
        inputType: col.dataIndex === ('quantity') ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const handleDeleteSingleProduct = async (data) => {
    try {
      let res = await publicRequest.delete(
        `/productShop/${data.id}`);
      if (res.data.type === "success") {
        useToastSuccess("Xóa sản phẩm thành công");
      } else return useToastError("Xóa sản phẩm thất bại");
    } catch (error) {
      console.log(error);
    }
    getProducts();
    setEditingKey('');
  };



  useEffect(() => {
    setData(products);
  }, [products]);


  return <Form form={form} component={false}>
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
};
