import { QRCodeSVG } from 'qrcode.react';

export default function QRCodeDisplay({ value, size = 200, label }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="p-4 bg-white rounded-2xl">
        <QRCodeSVG
          value={value}
          size={size}
          level="H"
          fgColor="#1e3a5f"
          bgColor="#ffffff"
        />
      </div>
      {label && <p className="text-sm text-slate-400">{label}</p>}
    </div>
  );
}
