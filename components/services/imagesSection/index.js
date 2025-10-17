"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import UploadImagePopup from "../uploadImagePopup";
import useFetch from "@/hooks/useFetch";
import "./style.sass";

const imagesBucket = process.env.NEXT_PUBLIC_AWS_BUCKET || "";

const ImagesSection = ({ serviceId, businessId, userId, serviceCode, imgsList = []}) => {
  const [images, setImages] = useState(imgsList);
  const [showUploadPopup, setShowUploadPopup] = useState(false);

  return (
    <section className="images-section">
      <h3>Imágenes</h3>
      <div className="images-list">
      {images &&

        images.map((img, idx) => (
          <div key={idx} className="thumbnail">
            <Image
              src={`${imagesBucket}${serviceCode}/${img.fileKey}`}
              alt={img.fileKey}
              width={100}
              height={100}
              className="thumb"
            />
            <p className="filename">{img.fileKey}</p>
            <a
              href={`${imagesBucket}${img.fileKey}`}
              download={img.fileKey}
              className="download-btn"
            >
              Descargar
            </a>
          </div>
        ))

      }

        {images.length <2 && 
          <div className="thumbnail upload-new" onClick={() => setShowUploadPopup(true)}>
            <div className="plus">+</div>
            <p>SUBIR NUEVO</p>
          </div>        
        }
      </div>

      {showUploadPopup && (
        <UploadImagePopup
          serviceId={serviceId}
          businessId={businessId}
          userId={userId}
          serviceCode={serviceCode}
          onClose={() => setShowUploadPopup(false)}
          onUploaded={(newFileKey) => {

            setImages((prev) => [
              ...prev,
              { fileKey: newFileKey },
            ]);
          }}
        />

      )}
    </section>
    
  );
};

export default ImagesSection;
