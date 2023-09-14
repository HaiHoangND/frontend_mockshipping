import { Dialog, Transition } from "@headlessui/react";
import { AddCircleOutline } from "@mui/icons-material";
import { TextField } from "@mui/material";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Fragment, useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import { storage } from "../../firebase";
import { useToastError, useToastShow } from "../../utils/toastSettings";
import { Button, Modal, Upload } from "antd";
import "./addProductModal.scss";
import { UploadOutlined } from "@ant-design/icons";

export const AddProductModal = ({
  handleAddProduct,
  isOpenModal,
  handleOpenChange,
}) => {
  const [inputs, setInputs] = useState({});
  const [imgFile, setImgFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function closeModal() {
    handleOpenChange(false);
  }

  const handleInputsChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };
  const handleUploadImg = async () => {
    if (!imgFile) return;
    const imgRef = ref(storage, `images/${imgFile.name + v4()}`);
    await uploadBytes(imgRef, imgFile);
    const uploadedImgURL = await getDownloadURL(imgRef);
    return uploadedImgURL;
  };
  const addProduct = async () => {
    setIsLoading(true);
    const imgURL = await handleUploadImg();
    if (!imgURL) {
      handleAddProduct(
        inputs,
        "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
      );
      setIsLoading(false);
      setInputs({});
      closeModal();
    } else {
      handleAddProduct(inputs, imgURL);
      setIsLoading(false);
      setInputs({});
      closeModal();
    }
  };

  return (
    <>
      <Modal
        title={"Thêm mới sản phẩm"}
        open={isOpenModal}
        onCancel={closeModal}
        onOk={addProduct}
        confirmLoading={isLoading}
        cancelText="Hủy"
        okText="Xác nhận"
        width={570}
      >
        <div className="mt-2">
          <div className="createProductModalInputsWrapper">
            <div className="createProductModalInputWrapper col-span-2">
              <TextField
                name="productCode"
                label="Mã sản phẩm"
                multiline
                maxRows={4}
                placeholder="ABC1234"
                onChange={handleInputsChange}
                size="small"
              />
            </div>
            <div className="createProductModalInputWrapper col-span-2">
              <TextField
                name="name"
                label="Tên sản phẩm"
                multiline
                maxRows={4}
                placeholder="Áo khoác da"
                onChange={handleInputsChange}
                size="small"
              />
            </div>
            <div className="createProductModalInputWrapper">
              <TextField
                name="quantity"
                label="Số lượng"
                multiline
                maxRows={4}
                placeholder="5"
                onChange={handleInputsChange}
                size="small"
              />
            </div>
            <div className="createProductModalInputWrapper ">
              <TextField
                label="Cân nặng"
                name="weight"
                placeholder="3.2"
                onChange={handleInputsChange}
                size="small"
              />
            </div>
            <div className="createProductModalInputWrapper col-span-2">
              <TextField
                label="Đơn giá"
                name="price"
                placeholder="23000"
                onChange={handleInputsChange}
                size="small"
              />
            </div>
            <div className="createProductModalInputWrapper col-span-2">
              <TextField
                name="description"
                label="Mô tả sản phẩm"
                multiline
                maxRows={5}
                onChange={handleInputsChange}
                size="small"
              />
            </div>

            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={(file) => {
                setImgFile(file);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />} type="primary">
                Chọn hình ảnh sản phẩm
              </Button>
            </Upload>
          </div>
        </div>
      </Modal>
    </>
  );
};
