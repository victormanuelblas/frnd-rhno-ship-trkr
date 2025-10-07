"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import TextInput from "@/components/recursos/textInput";
import DateInput from "@/components/recursos/dateInput";
import SelectInput from "@/components/recursos/selectInput";
import { getCurrentDate } from "@/utils/tools";
import "./style.sass";
import useFetch from "@/hooks/useFetch";
import SpinnerCentral from "@/components/recursos/spinnerCentral";

export default function ModalEvento({ event, onClose, onEventUpdated, serviceId, returnMtvs }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      servBussines: 1,
      servEventDate: getCurrentDate(),
      servReceptorGuia: "",
      servReceptorName: "",
      servReceptorDocument: "",
      servReturnMotive: 0,
      servCargo: "",
      servUser: 1
    },
  });
  const [{ data, loading, error }, saveEvent] = useFetch(
    { path: `evnt/regr/${serviceId}`},
    undefined,
    "PUT",
    false,
    () => {
      let rslt = data.b_rtrn_rslt.split("-")
      if(rslt[0] === "OK"){
       console.log("OK");
      }      
    }
  );
  
  const onSubmit = async (formData) => {
    try {
      const payload = {
      ...formData,
      servState: event.stateId,
      };

      await saveEvent({
        requestBody: payload,
      });
      onEventUpdated(event.stateId);
    } catch (error) {
      //console.log('Opps: ',error);
    }
    onClose();
  };
  
  return (
    <>
    <SpinnerCentral visible={loading} />    
    
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <h3>Actualizar evento: {event?.stateName}</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          <DateInput label="Fecha del evento" name="servEventDate" register={register} />
          {
            event?.stateName == "Entregado" ?
            <>
                <TextInput label="Nombre receptor" name="servReceptorName" register={register} />
                <TextInput label="Documento receptor" name="servReceptorDocument" register={register} />
                <TextInput label="Guía receptor" name="servReceptorGuia" register={register} />
            </>
            :
            ""
          }
          {
            event?.stateName == "Devuelto" ?
            <>
                <SelectInput
                  label="Motivo de devolución"
                  name="servReturnMotive"
                  register={register}
                  options={returnMtvs}
                  placeholder="—No aplica—"
                />
                <TextInput label="Cargo" name="servCargo" register={register} />
            </>
            :
            ""
          }
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
