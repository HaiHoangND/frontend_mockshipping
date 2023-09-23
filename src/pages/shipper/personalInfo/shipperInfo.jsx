import {
    ArrowBackIosNew
    , ModeEdit
} from '@mui/icons-material';
import { Button } from '@mui/material';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";

import "./shipperInfo.scss";
import { Fragment, useState, useEffect } from 'react';
import { publicRequest, userRequest } from "../../../requestMethods";
import { useAuthUser } from "react-auth-kit";
import { ShipperModal } from './ModalEditShipper';
import { DeleteOutlined, SaveOutlined, EditOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Modal, Input, Form } from "antd";
import { useToastError } from '../../../utils/toastSettings';

const UpdatePasswordModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputs, setInputs] = useState({});
    const authUser = useAuthUser();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleInputsChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };
    const closeModal = () => {
        setIsOpen(false);
    };
    const openModal = () => {
        setIsOpen(true);
    };

    const validatePassword = () => {
        if (!inputs.password || !inputs.confirmPassword) {
            useToastError("Chưa điền đầy đủ thông tin");
            return false;
        } else if (inputs.password.length < 8) {
            useToastError("Mật khẩu chưa đủ độ dài");
            return false;
        } else if (inputs.password !== inputs.confirmPassword) {
            useToastError("Mật khẩu chưa trùng khớp");
            return false;
        } else {
            return true;
        }
    };
    const handleConfirm = async () => {
        try {
            if (!validatePassword()) {
                return;
            } else {
                setIsLoading(true);
                const res = await userRequest.put(
                    `/user/updatePassword?id=${authUser().id}&password=${inputs.password}`
                );
                if (res.data.type === "success") {
                    navigate(0);
                    setIsLoading(false);
                } else {
                    useToastError("Có lỗi xảy ra");
                    setIsLoading(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <span onClick={openModal}>
                <Button
                    style={{ color: 'black' }}
                >
                    <ModeEdit />
                </Button>
            </span>
            <Modal
                title={"Thay đổi mật khẩu"}
                open={isOpen}
                onOk={handleConfirm}
                onCancel={closeModal}
                confirmLoading={isLoading}
                cancelText="Hủy"
                okText="Xác nhận"
                width={570}
            >
                <Form
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 20 }}
                    layout="horizontal"
                    className="mt-5"
                >
                    <Form.Item label="Mật khẩu">
                        <Input.Password
                            name="password"
                            placeholder={inputs.password}
                            onChange={handleInputsChange}
                        />
                    </Form.Item>
                    <Form.Item label="Xác nhận mật khẩu">
                        <Input.Password
                            name="confirmPassword"
                            placeholder={inputs.confirmPassword}
                            onChange={handleInputsChange}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};


const UpdateBtn = () => {
    return (
        <Button
            style={{ color: 'black' }}
        >
            <ModeEdit />
        </Button>
    );
};


const ShipperInfo = () => {
    const navigate = useNavigate();
    const [info, setInfo] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isAccepted, setAccepted] = useState(false);
    const [statusButton, setStatusButton] = useState('');
    const authUser = useAuthUser();


    const getShipper = async () => {
        const res = await userRequest.get(`/user/${authUser().id}`);
        console.log(res);
        setInfo(res.data.data);
    };

    useEffect(() => {
        getShipper();
    }, [])

    const handleUpdateFinalInfo = () => {
        if (isAccepted) {
            handleUpdateShipper();
            navigate("/shipper");
        }
    }

    useEffect(() => {
        handleUpdateFinalInfo();
    }, [isAccepted])

    const openModal = () => {
        setIsOpen(true);
    }
    const handleEditUser = async (infoProps) => {
        if (infoProps !== null) {
            try {
                let res = await userRequest.put(
                    `/user/${authUser().id}`, {
                    email: infoProps.email,
                    fullName: infoProps.fullName,
                    role: infoProps.role,
                    address: infoProps.address,
                    phone: infoProps.phone,
                    gender: infoProps.gender,
                    profilePicture: infoProps.profilePicture,
                    workingStatus: infoProps.workingStatus
                }
                );
                console.log(res);
                if (res.data.type === "success") {
                    await getShipper();
                } else return useToastError("Something went wrong!");
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log("Not working");
        }

    }




    return (
        <>
            <div className='topOrderMenu'>
                <div className='backToAllOrders'>
                    <Link to="/shipper">
                        <div className='backArrow'>
                            <ArrowBackIosNew />
                        </div>
                    </Link>
                    <div className='backTitle'>Thông tin tài khoản</div>
                </div>
            </div>
            {info && info.length !== 0 &&
                <div className='orderDetailContainer'>
                    <div className='info'>
                        <div className='orderTitle'>Tên</div>
                        <div className='orderItem'>
                            <div className='infoData'>
                                {info?.fullName}
                            </div>
                            <div className='infoEdit'
                            >
                                <ShipperModal
                                    confirmFunction={handleEditUser}
                                    parameters={info}
                                    titleContent={"Tên"}
                                    warningContent={"tên"}
                                    typeName={"fullName"}
                                    InitiateComponent={UpdateBtn}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='info'>
                        <div className='orderTitle'>Email</div>
                        <div className='orderItem'>
                            <div className='infoData'>
                                {info?.email}
                            </div>
                            <div className='infoEdit'

                            >
                                <ShipperModal
                                    confirmFunction={handleEditUser}
                                    parameters={info}
                                    titleContent={"Email"}
                                    warningContent={"email"}
                                    typeName={"email"}
                                    InitiateComponent={UpdateBtn}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='info'>
                        <div className='orderTitle'>Số điện thoại</div>
                        <div className='orderItem'>
                            <div className='infoData'>
                                {info?.phone}
                            </div>
                            <div className='infoEdit'

                            >
                                <ShipperModal
                                    confirmFunction={handleEditUser}
                                    parameters={info}
                                    titleContent={"Số điện thoại"}
                                    warningContent={"số điện thoại"}
                                    typeName={"phone"}
                                    InitiateComponent={UpdateBtn}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='info'>
                        <div className='orderTitle'>Địa chỉ</div>
                        <div className='orderItem'>
                            <div className='infoData'>
                                {info?.address}
                            </div>
                            <div className='infoEdit'

                            >
                                <ShipperModal
                                    confirmFunction={handleEditUser}
                                    parameters={info}
                                    titleContent={"Địa chỉ"}
                                    warningContent={"địa chỉ"}
                                    typeName={"address"}
                                    InitiateComponent={UpdateBtn}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='info'>
                        <div className='orderTitle'>Giới tính</div>
                        <div className='orderItem'>
                            <div className='infoData'>
                                {info?.gender}
                            </div>
                            <div className='infoEdit'

                            >
                                <ShipperModal
                                    confirmFunction={handleEditUser}
                                    parameters={info}
                                    titleContent={"Giới tính"}
                                    warningContent={"giới tính"}
                                    typeName={"gender"}
                                    InitiateComponent={UpdateBtn}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='info'>
                        <div className='orderTitle'>Mật khẩu</div>
                        <div className='orderItem'>
                            <div className='infoData'>

                                ******
                            </div>
                            <div className='infoEdit'
                            >
                                <UpdatePasswordModal />
                            </div>
                        </div>
                    </div>

                </div>
            }

        </>
    );
};

export default ShipperInfo;