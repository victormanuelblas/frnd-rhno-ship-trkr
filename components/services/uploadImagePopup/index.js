"use client";
import React, { useState } from "react";
import Image from "next/image";
import useFetch from "@/hooks/useFetch";
import "./style.sass";

const imagesBucket = process.env.NEXT_PUBLIC_AWS_BUCKET;

const UploadImagePopup = ({ serviceId, businessId, userId, serviceCode, onClose, onUploaded }) => {
  const [preview, setPreview] = useState(null);
  const [resizing, setResizing] = useState(false);
  const [file, setFile] = useState(null);

  const [rspnUploadImage, rqstUploadImage] = useFetch(
    { path: "upld/imag" },
    undefined,
    "POST",
    false,
    () => {
      const rslt = rspnUploadImage?.data?.b_rtrn_rslt?.split("|");
      
      if (rslt?.[0] === "OK") {
        console.log("✅ Imagen subida correctamente");
        if (onUploaded) onUploaded(rslt?.[1]);
        onClose();
      }
    }
  );

  const handleResizeAndUpload = async (e) => {
    const imgFile = e.target.files[0];
    if (!imgFile) return;

    setResizing(true);
    setFile(imgFile);

    const img = document.createElement("img");
    img.src = URL.createObjectURL(imgFile);

    img.onload = async () => {
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 800;
      const scaleSize = MAX_WIDTH / img.width;
      canvas.width = MAX_WIDTH;
      canvas.height = img.height * scaleSize;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const resizedBase64 = canvas.toDataURL("image/jpeg", 0.8);
      setPreview(resizedBase64);

      const base64Data = resizedBase64.replace(/^data:image\/\w+;base64,/, "");

      const fileKey = `${serviceCode}/${imgFile.name}`;
      const fileName = `${imgFile.name}`;
      const payload = {
        imagData: base64Data,
        fileKey,
        fileName,
        serviceId,
        businessId,
        userId
      };

      await rqstUploadImage({ requestBody: payload });
      setResizing(false);
    };
  };

  return (
    <div className="upload-popup">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h3>Subir nueva imagen</h3>

        <label className="custom-file">
          <input type="file" accept="image/*" onChange={handleResizeAndUpload} />
          <span>{file ? "Cambiar imagen" : "Seleccionar imagen"}</span>
        </label>

        {resizing && <p className="status">Procesando imagen...</p>}

        {preview && (
          <div className="preview">
            <Image src={preview} alt="preview" width={200} height={200} />
            <p>{file?.name}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadImagePopup;
