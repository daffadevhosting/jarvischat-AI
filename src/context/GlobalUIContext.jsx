import { createContext, useContext, useState } from "react";

const GlobalUIContext = createContext();

export const useGlobalUI = () => useContext(GlobalUIContext);

export const GlobalUIProvider = ({ children }) => {
  const [alertMsg, setAlertMsg] = useState(null);
  const [confirmData, setConfirmData] = useState(null);

  const globalAlert = (message) => {
    setAlertMsg(message);
    setTimeout(() => setAlertMsg(null), 4000);
  };

  const globalConfirm = (message) => {
    return new Promise((resolve) => {
      setConfirmData({ message, resolve });
    });
  };

  const handleConfirm = (choice) => {
    confirmData.resolve(choice);
    setConfirmData(null);
  };

  return (
    <GlobalUIContext.Provider value={{ globalAlert, globalConfirm }}>
      {children}

      {/* Alert UI */}
      {alertMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-pulse">
          {alertMsg}
        </div>
      )}

      {/* Confirm UI */}
      {confirmData && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md w-[90%] max-w-sm">
            <div className="text-lg mb-4">{confirmData.message}</div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleConfirm(false)}
                className="bg-gray-600 px-4 py-1 rounded hover:bg-gray-700 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => handleConfirm(true)}
                className="bg-blue-600 px-4 py-1 rounded hover:bg-blue-700 cursor-pointer"
              >
                Ya
              </button>
            </div>
          </div>
        </div>
      )}
    </GlobalUIContext.Provider>
  );
};
