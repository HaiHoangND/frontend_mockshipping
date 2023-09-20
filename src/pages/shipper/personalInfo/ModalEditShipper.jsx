import { Dialog, Transition } from "@headlessui/react";
import { WarningAmber } from "@mui/icons-material";
import { Modal, Input } from "antd";
import { Fragment, useState, useEffect } from "react";




export const ShipperModal = ({
    InitiateComponent,
    warningContent,
    confirmFunction,
    titleContent,
    parameters,
    typeName
}) => {
    let [isOpen, setIsOpen] = useState(false);
    let [isOpenPass, setIsOpenPass] = useState(false);

    const [info, setInfo] = useState('');

    useEffect(() => {
        setInfo(parameters);
    }, [])

    function closeModal() {
        setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
    }

    const handleConfirm = () => {
        confirmFunction(info);
        closeModal();
    };

    const onChange = (e) => {
        console.log(info);
        setInfo({
            ...info,
            [[typeName]]: e.target.value,
        });
    };

    return (
        <>
            <div onClick={openModal} style={{ cursor: "pointer" }}>
                <InitiateComponent />
            </div>

            <Modal
                title={`Thay đổi ${warningContent}`}
                open={isOpen}
                onOk={handleConfirm}
                onCancel={closeModal}
                cancelText="Hủy"
                okText="Cập nhật"
                width={570}
            >
                <div className="mt-2">
                    <div className='orderTitle'>{titleContent}</div>
                    <div className='orderItem'>
                        <Input placeholder={parameters[typeName]} onChange={onChange} />
                    </div>
                </div>
            </Modal>


        </>
    );
};
