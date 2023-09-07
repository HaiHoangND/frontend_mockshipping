import { Dialog, Transition } from "@headlessui/react";
import { WarningAmber } from "@mui/icons-material";
import { Fragment, useState } from "react";

export const WarningModal = ({
  InitiateComponent,
  warningContent,
  confirmFunction,
  parameters,
}) => {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleConfirm = () => {
    confirmFunction(parameters);
    closeModal();
  };

  return (
    <>
      <div onClick={openModal} style={{ cursor: "pointer" }}>
        <InitiateComponent />
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
                    style={{
                      color: "red",
                      display: "flex",
                      alignItems: "center",
                    }}
                    className="text-lg font-medium leading-6 "
                  >
                    <WarningAmber /> <p style={{marginLeft:"10px"}}>Cảnh báo</p>
                  </Dialog.Title>
                  <div className="mt-2">
                    <p>{warningContent}</p>
                  </div>

                  <div className="confirmModalBtns mt-4">
                    <button type="button" onClick={handleConfirm}>
                      Xác nhận
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
