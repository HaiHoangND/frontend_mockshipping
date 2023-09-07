import { Dialog, Transition } from "@headlessui/react";
import { TextField } from "@mui/material";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Fragment, useRef, useState } from "react";
import { v4 } from "uuid";
import { storage } from "../../firebase";
import "./addProductModal.scss";

export const AddProductModal = ({ handleAddProduct }) => {
  let [isOpen, setIsOpen] = useState(false);
  const [inputs, setInputs] = useState({});
  const [imgFile, setImgFile] = useState(null);
  const [imgURL, setImgURL] = useState("");
  const fileInputRef = useRef(null);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

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
    await handleUploadImg();
    handleAddProduct(inputs, imgURL);
  };

  return (
    <>
      <div onClick={openModal} style={{ cursor: "pointer" }}>
        Thêm sản phẩm
      </div>

      <Transition appear show={isOpen} as={Fragment}>
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
                      <div className="createProductModalInputWrapper col-span-2">
                        <TextField
                          name="name"
                          label="Tên sản phẩm"
                          multiline
                          maxRows={4}
                          placeholder="Áo khoác da"
                        />
                      </div>
                      <div className="createProductModalInputWrapper">
                        <TextField
                          name="quantity"
                          label="Số lượng"
                          multiline
                          maxRows={4}
                          placeholder="5"
                        />
                      </div>
                      <div className="createProductModalInputWrapper ">
                        <TextField
                          label="Cân nặng"
                          name="weight"
                          placeholder="3.2"
                        />
                      </div>
                      <div className="createProductModalInputWrapper col-span-2">
                        <TextField
                          label="Đơn giá"
                          name="price"
                          placeholder="23000"
                        />
                      </div>
                      <div className="createProductModalInputWrapper col-span-2">
                        <TextField
                          name="description"
                          label="Mô tả sản phẩm"
                          multiline
                          maxRows={5}
                        />
                      </div>
                    </div>

                    <div className="createProductModalUploadImage">
                      <button onClick={handleChooseImg}>Chọn hình ảnh sản phẩm</button>
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
