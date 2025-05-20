"use client";

import { RefreshCw } from "lucide-react";

interface QrCodeReloadProps {
  onReload: () => void;
}

const QrCodeReload: React.FC<QrCodeReloadProps> = ({ onReload }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-[200px] h-[200px] bg-gray-100 flex items-center justify-center rounded">
        <RefreshCw
          size={40}
          className="text-gray-500 cursor-pointer hover:rotate-180 hover:text-blue-500 transition-transform duration-300"
          onClick={onReload}
        />
      </div>
      <p className="mt-3 text-sm text-gray-600">
        QR code expired. Click to reload.
      </p>
    </div>
  );
};

export default QrCodeReload;
