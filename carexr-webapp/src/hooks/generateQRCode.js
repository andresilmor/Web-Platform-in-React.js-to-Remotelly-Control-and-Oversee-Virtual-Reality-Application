import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";


const useQRCode = (content, generate) => {
    
  const [qr, setQr] = useState("");
  const GenerateQRCode = () => {
    QRCode.toDataURL(
     content,
      {
        width: 800,
        margin: 2,
        color: {
          // dark: '#335383FF',
          // light: '#EEEEEEFF'
        },
      },
      (err, content) => {
        if (err) return console.error(err);
        console.log(content);
        setQr(content);
      }
    );
  };

  GenerateQRCode();
  return qr

}


export { useQRCode };
