import { UploadOutlined } from "@ant-design/icons";
import { TextField } from "@mui/material";
import { Button, Modal, Upload } from "antd";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRef, useState } from "react";
import { v4 } from "uuid";
import { storage } from "../../firebase";
import "./addProductModal.scss";
import { validateFloat, validateInt } from "../../utils/formatStrings";
import { useToastError } from "../../utils/toastSettings";

const imgPlaceholder =
  "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg";

export const AddProductModal = ({
  handleAddProduct,
  isOpenModal,
  handleOpenChange,
}) => {
  const [inputs, setInputs] = useState({});
  const [imgFile, setImgFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const uploadRef = useRef();

  function closeModal() {
    handleOpenChange(false);
  }


  const validateInputs = () => {
    if (!inputs.name || !inputs.price || !inputs.weight || !inputs.quantity || !inputs.description) {
      useToastError("Chưa điền đủ thông tin sản phẩm");
      return false;
    } else if (!validateInt(inputs.price)) {
      useToastError("Sai định dạng đơn giá");
      return false;
    } else if (!validateInt(inputs.quantity)) {
      useToastError("Sai định dạng số lượng");
      return false;
    } else if (!validateFloat(inputs.weight)) {
      useToastError("Sai định dạng cân nặng");
      return false;
    } else {
      return true;
    }
  };


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
    if (!validateInputs()) {
      return;
    } else {
      setIsLoading(true);
      const imgURL = await handleUploadImg();
      handleAddProduct(
        { ...inputs, id: v4() },
        imgURL ? imgURL : imgPlaceholder
      );
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
                name="name"
                label="Tên sản phẩm"
                multiline
                maxRows={4}
                placeholder="Áo khoác da"
                onChange={handleInputsChange}
                size="small"
                value={inputs.name || ""}
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
                value={inputs.quantity || ""}
              />
            </div>
            <div className="createProductModalInputWrapper ">
              <TextField
                label="Cân nặng"
                name="weight"
                placeholder="3.2"
                onChange={handleInputsChange}
                size="small"
                value={inputs.weight || ""}
              />
            </div>
            <div className="createProductModalInputWrapper col-span-2">
              <TextField
                label="Đơn giá"
                name="price"
                placeholder="23000"
                onChange={handleInputsChange}
                size="small"
                value={inputs.price || ""}
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
                value={inputs.description || ""}
              />
            </div>

            <Upload
              ref={uploadRef}
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
