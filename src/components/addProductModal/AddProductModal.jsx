import { Dialog, Transition } from "@headlessui/react";
import { AddCircleOutline } from "@mui/icons-material";
import { TextField } from "@mui/material";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Fragment, useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import { storage } from "../../firebase";
import { useToastShow } from "../../utils/toastSettings";
import { Button } from "antd";
import "./addProductModal.scss";

export const AddProductModal = ({ handleAddProduct, isOpenModal, handleOpenChange }) => {
  const [inputs, setInputs] = useState({});
  const [imgFile, setImgFile] = useState(null);
  const [imgURL, setImgURL] = useState("");
  const fileInputRef = useRef(null);

  function closeModal() {
    handleOpenChange(false)
  }

  const handleInputsChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleChooseImg = () => {
    fileInputRef.current.click();
  };

  const handleUploadImg = async () => {
    if (!imgFile) return;
    const imgRef = ref(storage, `images/${imgFile.name + v4()}`);
    await uploadBytes(imgRef, imgFile);
    const uploadedImgURL = await getDownloadURL(imgRef);
    fileInputRef.current.value = "";
    setImgURL(uploadedImgURL);
  };
  const addProduct = async () => {
    useToastShow("Đang thêm sản phẩm");
    await handleUploadImg();
    if (imgURL.length === 0) {
      handleAddProduct(inputs, "temporayLink")
    } else {
      handleAddProduct(inputs, imgURL);
    }
  };

  // const handleCheckProductCode = () => {
  //   try {
  //     let res =
  //   } catch (error) {

  //   }
  // }

  return (
    <>

      <Transition appear show={isOpenModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Thêm sản phẩm
                  </Dialog.Title>
                  <div className="mt-2">
                    <div className="createProductModalInputsWrapper">
                      <div className="createProductModalInputWrapper">
                        <TextField
                          name="productCode"
                          label="Mã sản phẩm"
                          multiline
                          maxRows={4}
                          placeholder="ABC1234"
                          onChange={handleInputsChange}
                        />
                      </div>
                      <div className="createProductModalInputWrapper">
                        <Button
                        // onClick={handleCheckProductCode}
                        >Kiểm tra</Button>
                      </div>
                      <div className="createProductModalInputWrapper col-span-2">
                        <TextField
                          name="name"
                          label="Tên sản phẩm"
                          multiline
                          maxRows={4}
                          placeholder="Áo khoác da"
                          onChange={handleInputsChange}
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
                        />
                      </div>
                      <div className="createProductModalInputWrapper ">
                        <TextField
                          label="Cân nặng"
                          name="weight"
                          placeholder="3.2"
                          onChange={handleInputsChange}
                        />
                      </div>
                      <div className="createProductModalInputWrapper col-span-2">
                        <TextField
                          label="Đơn giá"
                          name="price"
                          placeholder="23000"
                          onChange={handleInputsChange}
                        />
                      </div>
                      <div className="createProductModalInputWrapper col-span-2">
                        <TextField
                          name="description"
                          label="Mô tả sản phẩm"
                          multiline
                          maxRows={5}
                          onChange={handleInputsChange}
                        />
                      </div>
                    </div>

                    <div className="createProductModalUploadImage">
                      <button onClick={handleChooseImg}>
                        Chọn hình ảnh sản phẩm
                      </button>
                      <input
                        type="file"
                        onChange={(e) => setImgFile(e.target.files[0])}
                        ref={fileInputRef}
                      />
                    </div>
                  </div>

                  <div className="confirmModalBtns mt-4">
                    <button type="button" onClick={addProduct}>
                      Thêm
                    </button>
                    <button type="button" onClick={closeModal}>
                      Hủy
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
