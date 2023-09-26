
import { Modal, Input, Select } from "antd";
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

    const onChangeGender = (e) => {
        console.log(info);
        setInfo({
            ...info,
            [[typeName]]: e,
        });
    };


    return (
        <Fragment>
            <div onClick={openModal} style={{ cursor: "pointer" }}>
                <InitiateComponent />
            </div>
            {typeName && typeName !== "gender" ? (
                <Modal
                    title={`Thay đổi ${warningContent}`}
                    open={isOpen}
                    onOk={handleConfirm}
                    onCancel={closeModal}
                    cancelText="Hủy"
                    okText="Cập nhật"
                    width={570}
                >


                    <div className="mt-2 flex items-center">
                        <div className='orderTitle mr-3'>{titleContent}: </div>
                        <div className='orderItem'>
                            <Input placeholder={parameters[typeName]} onChange={onChange} />
                        </div>
                    </div>
                </Modal>
            ) : (
                <Modal
                    title={`Thay đổi ${warningContent}`}
                    open={isOpen}
                    onOk={handleConfirm}
                    onCancel={closeModal}
                    cancelText="Hủy"
                    okText="Cập nhật"
                    width={570}
                >
                    <div className="mt-2 flex items-center">
                        <div className='orderTitle mr-3'>{titleContent}</div>
                        <div className='orderItem'>
                            <Select
                                defaultValue={parameters[typeName]}
                                style={{
                                    width: 120,
                                }}
                                onChange={onChangeGender}
                                options={[
                                    {
                                        value: 'Nam',
                                        label: 'Nam',
                                    },
                                    {
                                        value: 'Nữ',
                                        label: 'Nữ',
                                    },
                                ]}
                            />

                        </div>
                    </div>
                </Modal>
            )
            }
        </Fragment>
    );
};
