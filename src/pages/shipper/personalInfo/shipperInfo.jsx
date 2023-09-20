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
import { DeleteOutlined, SaveOutlined, EditOutlined } from "@ant-design/icons";


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
                        <div className='orderTitle'>Vai trò</div>
                        <div className='orderItem'>
                            <div className='infoData'>
                                {info?.role}
                            </div>
                            <div className='infoEdit'
                            >
                            </div>
                        </div>
                    </div>

                    {/* 
                    <div className='orderChangeStatus'>
                        <Button variant="contained"
                            disabled={statusButton === 'Hoàn thành' ? true : false}
                            onClick={() => openModal()}>Chuyển trạng thái</Button>
                    </div> */}
                </div>
            }

        </>
    );
};

export default ShipperInfo;