import { EditOutlined } from "@ant-design/icons";
import { Button, Modal, Select, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { publicRequest } from "../../requestMethods";
import "./updateOrderEmployeeModal.scss";
import { getArrayLastItem } from "../../utils/getLastArrayItem";

const { Option } = Select;
export const UpdateOrderEmployeeModal = ({ order }) => {
  const navigate = useNavigate();
  let [isOpen, setIsOpen] = useState(false);
  const [shippers, setShippers] = useState([]);
  const [selectedShipper, setSelectedShipper] = useState("");
  const authUser = useAuthUser();
  const role = authUser().role;
  const [totalCount, setTotalCount] = useState(1);
  const [page, setPage] = useState(1);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }


  const getShippers = async () => {
    try {
      if (order) {
        const res = await publicRequest.get(`/user/getShippersWithStatus`);
        if (order.orderStatusList.length === 0) {
          setShippers(res.data.data);
        } else {
          const filteredArray = res.data.data.filter(
            (shipper) => shipper.user.id !== order.orderStatusList[0].shipper.id
          );
          setShippers(filteredArray);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getShippers();
  }, []);

  const handleShipperChange = (value) => {
    const selectedShipper = shippers.find(
      (shipper) => shipper.user.id === value
    );
    setSelectedShipper(selectedShipper);
  };

  const isDisabled = () => {
    if (order.orderStatusList.length === 0) {
      return false;
    }

    // Check if the last status is "Đơn hủy"
    if (order.orderStatusList[0].status === "Đơn hủy") {
      return true;
    }

    if (order.orderStatusList[0].status === "Đã đưa tiền cho chủ shop") {
      return true;
    }

    // Check if the warehouseId matches
    if (authUser().warehouseId === order.orderStatusList[0].warehouse?.id) {
      return false;
    }

    return false;
  };
  const handleUpdateEmployee = async () => {
    let nextOrderRouteId;
    if (order.orderStatusList.length === 0) {
      nextOrderRouteId = order.orderRoutes[0].id;
    } else {
      nextOrderRouteId = order.orderStatusList[0].orderRoute.id;
    }

    try {
      const res = await publicRequest.post("/orderStatus", {
        shippingOrderId: order.id,
        shipperId: selectedShipper,
        orderRouteId: nextOrderRouteId,
        status:
          order.orderStatusList.length === 0
            ? "Đang lấy hàng"
            : order.orderStatusList[0].status,
        arriving:
          order.orderStatusList.length === 0
            ? true
            : order.orderStatusList[0].arriving,
      });
      if (res.data.type === "success") {
        navigate(0);
      }
    } catch (error) {
      console.log(error);
    }
  };


  const [filteredStatus, setFilteredStatus] = useState(null);

  const handleChange = (pagination, filters) => {
    setFilteredStatus(filters['status']);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "user",
      render: (user) => <span>{user?.id}</span>,
    },
    {
      title: "Tên",
      dataIndex: "user",
      render: (user) => <span>{user?.fullName}</span>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "user",
      render: (user) => <span>{user?.phone}</span>,
    },
    {
      title: "Đơn đang giao",
      align: "center",
      dataIndex: "ordersInProgress",
      sorter: {
        compare: (a, b) => a.ordersInProgress - b.ordersInProgress,
      },
    },
    {
      title: "Trạng thái nhân viên",
      dataIndex: "ordersInProgress",
      align:"center",
      render: (numberOfOrders) => {
        const tagColor = numberOfOrders === 0 ? "green" : "yellow";

        return (
          <Tag color={tagColor}>
            {numberOfOrders === 0 ? "Đang rảnh" : "Đang giao hàng"}
          </Tag>
        );
      },
      filters: [
        {
          text: "Đang rảnh",
          value: "0",
        },
        {
          text: "Đang giao hàng",
          value: "1",
        },
      ],
      onFilter: (value, record) => {
        if (value === "0") {
          return record.ordersInProgress === 0;
        } else if (value === "1") {
          return record.ordersInProgress > 0;
        }
      },
      filteredValue: filteredStatus,
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      const shipper = selectedRows[0].user.id;
      setSelectedShipper(shipper);
    },
  };

  return (
    <>
      {role !== "SHOP" ? (
        <Button
          type="primary"
          icon={<EditOutlined />}
          className=" ml-10"
          onClick={openModal}
        >
          Cập nhật nhân viên
        </Button>
      ) : (
        <div></div>
      )}

      <Modal
        title="Cập nhật nhân viên"
        open={isOpen}
        onOk={handleUpdateEmployee}
        onCancel={closeModal}
        cancelText="Hủy"
        okText="Xác nhận"
        width={800}
      >
        <Table
          rowSelection={{
            type: "radio",
            ...rowSelection,
          }}
          columns={columns}
          dataSource={shippers}
          rowKey={(record) => record.user.id}
          onChange={handleChange}
        />
      </Modal>
    </>
  );
};
