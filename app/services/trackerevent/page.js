"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./style.sass";
import { formatDate } from "@/utils/tools";
import useFetch from "@/hooks/useFetch";
import AvisoCargando from "@/components/recursos/cargando";
import AvisoError from "@/components/recursos/error";
import ModalEvento from "@/components/services/ModalEvento";
import ImagesSection from "@/components/services/imagesSection";
import { useSelector } from 'react-redux';
import useAuthGuard from "@/hooks/useAuthGuard";

let returnMotivels = [
    {
        id: 1,
        name: "Rechazado"
    },
    {
        id: 2,
        name: "Ausente"
    },
    {
        id: 3,
        name: "Direccion Incorrecta"
    },
]

export default function ServicioDetalle() {
  const {user} = useSelector((state) => state.auth);
  useAuthGuard(true);
  const [trackerCode, setTrackerCode] = useState("")

   useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      setTrackerCode(code);
    }
  }, []);

  const [service, setService] = useState(null);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [rspnService,rqstService] = useFetch(
    {
      path: `evnt/view/${trackerCode}`,
      queryParams: { owner: 1, usrid: 2 },
    },
    null,
    "GET",
    false,
    () => {
      if(rspnService.data[0].length > 0) setService(rspnService.data);
    }
  );

  useEffect(() => {
    if(!trackerCode) return;
    rqstService();
  }, [trackerCode])

  if (rspnService.loading) return <AvisoCargando />;
  if (rspnService.error) return <AvisoError msg={`Ops! ${error}`} />;

  const handleOpenModal = (item) => {
    if(user.clientId == 0){
      setSelectedEvent(item);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const handleEventUpdated = (updatedStateId) => {
    console.log('updatedStateId: ', updatedStateId);
    
    setService((prevService) => {
      if (!prevService) return prevService;

      const newService = [...prevService];

      const updatedStates = newService[1].map((item) =>
        item.stateId === updatedStateId
          ? { ...item, stateExecuted: 1 }
          : item
      );
      
      newService[1] = updatedStates;
      return newService;
    });
  };

  return (
    <div className="service-content">
      <h2>Detalle del servicio {trackerCode}</h2>
      {service && (
        <>
        <section className="service-items">
          <p>
            <b>Fecha</b>
            <span>{formatDate(service[0][0].servDate)}</span>
          </p>
          <p>
            <b>Guia</b>
            <span>{service[0][0].servClientGuia}</span>
          </p>
          <p>
            <b>Origen</b>
            <span>{service[0][0].servOriginName}</span>
          </p>
          <p>
            <b>Entregar en</b>
            <span>{service[0][0].servDeliveredType}</span>
          </p>
          <p>
            <b>Fec.Est.Entrega</b>
            <span>{formatDate(service[0][0].servEtaDate)}</span>
          </p>
          <p>
            <b>Estado</b>
            <span>{service[0][0].servStateDetail}</span>
          </p>
        </section>
        <section className="service-items-large">
          <p>
            <b>Cliente</b>
            <span>{service[0][0].servClientName}</span>
          </p>
          <p>
            <b>Destinatario</b>
            <span>{service[0][0].servClientName}</span>
          </p>
          <p>
            <b>Dirección</b>
            <span>{service[0][0].servDestinyAddresses}</span>
          </p>
        </section>
        <h3>Recepción</h3>
        <section className="service-items">
          <p>
            <b>Nombre</b>
            <span>{service[0][0].servReceptorName}</span>
          </p>
          <p>
            <b>Documento</b>
            <span>{service[0][0].servReceptorDocument}</span>
          </p>
          <p>
            <b>Guia</b>
            <span>{service[0][0].servReceptorGuia}</span>
          </p>
        </section>
        {service[0][0].servRerturnMotive !== 0 &&
        <>
          <h3>Devolución</h3>
          <section className="service-items">
            <p>
              <b>Motivo de devolución</b>
              <span>{service[0][0].servRerturnMotiveDetail}</span>
            </p>
            <p>
              <b>Cargo</b>
              <span>{service[0][0].servCargo}</span>
            </p>
          </section>
          </>
        }
        <h3>Seguimiento</h3>
        <section className="service-tracker">
          {service[1].map((item) => {
            return (
              <p key={item.stateId} onClick={() => handleOpenModal(item)}>
                <b>{item.stateName}</b>
                <img alt="" src={`/assets/tracker/${item.stateName.toLowerCase()}.png`} className={item.stateExecuted === 0 ? "bw" : ""}></img>
                <span>{formatDate(item.stateExecutedDate)}</span>
              </p>
            )
          })}
        </section>
         {showModal && (
          <ModalEvento
            event={selectedEvent}
            onClose={handleCloseModal}
            onEventUpdated={handleEventUpdated}
            serviceId={service[0][0].servId}
            returnMtvs={returnMotivels}
          />
        )}
        
        <section>
          <ImagesSection serviceCode={trackerCode} imgsList={service[2]} serviceId={service[0][0].servId} userId="1" businessId="1" addMore={(user.clientId == 0)} />
        </section>
        </>
      )}
      <h2></h2>
      <section className="section-actions">
        <Link href="/services">
          <button className="btn-back">
            ← Volver al listado
          </button>
        </Link>
      </section>
    </div>
  );
}
