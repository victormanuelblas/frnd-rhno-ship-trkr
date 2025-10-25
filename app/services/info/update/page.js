"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import TextInput from "@/components/recursos/textInput";
import SelectInput from "@/components/recursos/selectInput";
import DateInput from "@/components/recursos/dateInput";
import ProcessButton from "@/components/recursos/processButtom";
import useThemeByHour from "@/hooks/useThemeByHour";
import AlertBar from "@/components/recursos/alertBar";
import SpinnerCentral from "@/components/recursos/spinnerCentral";
import AddItemsPopup from "@/components/recursos/addItemsPopup";
import { useRouter } from "next/navigation";
import { getCurrentDate, getMinDate,getMaxDate, formatDate, formatDateYMD } from "@/utils/tools";
import useAuthGuard from "@/hooks/useAuthGuard";

import "./style.sass";

let clientls = [
  {
    value: 10,
    label: "INNOVA TRANSPORT S.A.C."
  },
  {
    value: 11,
    label: "BROTHER INTERNATIONAL DEL PERU S.A.C."
  },
]
let originls = [
    {
        id: 1,
        name: "Indepencia"
    },
]
let deliveredls = [
    {
        id: 0,
        name: "Por confirmar"
    },
    {
        id: 1,
        name: "Domicilio"
    },
    {
        id: 2,
        name: "Agencia"
    },
]
let itemsTypels = [
    {
        id: 1,
        name: "Bulto"
    },
    {
        id: 2,
        name: "Caja"
    },
]

export default function NuevoServicio() {
  const {user, checked } = useAuthGuard()

  useThemeByHour();
  
  const router = useRouter();

  const [serviceId, setServiceId] = useState(null);
  const [selectedService, setSelectedService] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const srvc = params.get('serv');
    if (srvc) {
      setServiceId(srvc);
    }
  }, []);

  const [origins, setOrigins] = useState(originls);
  const [clients, setClients] = useState(clientls);
  const [delivereds, setDelivereds] = useState(deliveredls);
  const [itemsTypes, setItemsTypes] = useState(itemsTypels);
  
  const [alertMessage, setAlertMessage] = useState({ message: "", type: "success" });

  const [items, setItems] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
    servDate: getCurrentDate(),
    servBussines: 1,
    servUser: 1,
    },
    mode: "onChange"
  });

  const [{ data, loading, error }, saveService] = useFetch(
    { path: serviceId ? `serv/${serviceId}` : `serv` },
    undefined,
    serviceId ? "PUT" : "POST",
    false,
    () => {
      let rslt = data.b_rtrn_rslt.split("-")
      if(rslt[0] === "OK"){
        if (!serviceId) {
          setAlertMessage({ message: "Servicio creado correctamente", type: "success" });
          reset(); // limpiar form
        }else{
          setAlertMessage({ message: "Servicio actualizado correctamente", type: "success" });
        }
      }else
      {
        setAlertMessage({ message: rslt[3], type: "error" });
      }      
    }
  );

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        servClient: parseInt(data.servClient),
        servDeliveredType: parseInt(data.servDeliveredType),
        servOrigin: parseInt(data.servOrigin),
      };

      await saveService({
        requestBody: payload,
      }); 
    } catch (error) {
      console.error(error);
      setAlertMessage({ message: "Error al crear servicio", type: "error" });
    }
  };
  
  const addItem = (item) => {
    const newItems = [...items, item];
    setItems(newItems);

    const itemsString = newItems
      .map((i) => `${i.type};${i.qty},${i.weight}`)
      .join("|");

    setValue("servItems", itemsString); // ✅ actualiza el campo oculto
  };

  const [rspnService , rqstService] = useFetch(
    {
      path: serviceId ? `serv/${serviceId}` : `serv`,
      queryParams: { owner: 1, usrid: 2 },
    },
    undefined,
    "GET",
    false,
    () => {
      setSelectedService(rspnService);
    }
  );

  useEffect(() => {
    if(serviceId == null) return
    rqstService()
  }, [serviceId])
  
  useEffect(() => {
    if(!selectedService.data) return
    if (selectedService.data) {
      
      const servData = selectedService.data[0][0];
      const serv = {...servData, servDate: formatDateYMD(servData.servDate), servEtaDate: formatDateYMD(servData.servEtaDate)}       
      reset(serv);
      
      const itms = (selectedService.data[1] || []).map(i => ({
        id: i.itemId,
        type: i.itemType,
        qty: i.itemQnty,
        weight: i.itemWeight
      }));

      setItems(itms);

      const itemsString = itms
        .map(i => `${i.type};${i.qty},${i.weight}`)
        .join("|");
        setValue("servItems", itemsString);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedService.data, reset]);
  
  if (!checked) return null 

  return (
    <div className="info-content">
      <SpinnerCentral visible={loading || rspnService.loading} />
      <AlertBar
        message={alertMessage.message}
        type={alertMessage.type}
        onClose={() => setAlertMessage({ message: "", type: "success" })}
      />

      <h1>{serviceId ? "Editar Servicio" : "Nuevo Servicio"}</h1>
      {(user?.clientId == 0) ? 
        <form onSubmit={handleSubmit(onSubmit)}>

        <section className="info-elements">
          <DateInput
            label="Fecha del Servicio"
            name="servDate"
            register={register}
            required={true}
            errors={errors}
            min={getMinDate(7)}
            max={getMaxDate(3)}
          />

          <TextInput
            label="Número de Guía"
            name="servGuia"
            register={register}
            placeholder="Guia de envío"
            required={true}
            errors={errors}
            rules={{
              pattern: {
                value: /^[A-Za-z0-9-]+$/, // letras, números y guion
                message: "Solo letras, números y guion (-)"
              },
              maxLength: { value: 14, message: "Máximo 14 caracteres" }
            }}
          />

          <SelectInput
            label="Origen"
            name="servOrigin"
            register={register}
            required={true}
            options={origins}
            errors={errors}
            placeholder="—Seleccione el origen—"
          />
          <DateInput
            label="Fec.Est.Entrega"
            name="servEtaDate"
            register={register}
            required={true}
            errors={errors}
            min={getMinDate(7)}
            max={getMaxDate(3)}
          />

        </section>
        <section className="info-elements">
          <SelectInput
            label="Cliente"
            name="servClient"
            register={register}
            required={true}
            options={clients}
            errors={errors}
            placeholder="—Seleccione el cliente—"
          />
          <TextInput
            label="Guía de cliente"
            name="servClientGuia"
            register={register}
            placeholder="Guía de cliente"
            required={true}
            errors={errors}
          />

          <SelectInput
            label="Entregar en"
            name="servDeliveredType"
            register={register}
            required={true}
            options={delivereds}
            errors={errors}
            placeholder="—Forma de entrega—"
          />

        </section>
        <section className="info-elements">
          <TextInput
            label="Destinatario"
            name="servDestinyName"
            register={register}
            placeholder="Nombre del destinatario"
            required={true}
            errors={errors}
          />
          <TextInput
            label="Dirección"
            name="servDestinyAddress"
            register={register}
            placeholder="Domicilio del destinatario"
            required={true}
            errors={errors}
          />
          <TextInput
            label="Referencia"
            name="servDestinyAddressRefr"
            register={register}
            placeholder="Referencia del destinatario"
            required={false}
            errors={errors}
          />
        </section>
        <section className="info-elements items-section">
          <h2>Contenido del servicio</h2>

          <button
            type="button"
            className="add-item-btn"
            onClick={() => setShowPopup(true)}
            >
            + Agregar Item
          </button>

          <table className="items-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Peso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const typeName =
                  itemsTypes.find((t) => t.id == item.type)?.name || item.type;
                return (
                  <tr key={index}>
                    <td>{typeName}</td>
                    <td>{item.qty}</td>
                    <td>{item.weight}</td>
                    <td>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => {
                          const newItems = items.filter((_, i) => i !== index);
                          setItems(newItems);
                          const itemsString = newItems
                            .map((i) => `${i.type};${i.qty},${i.weight}`)
                            .join("|");
                          setValue("servItems", itemsString);
                        }}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <input type="hidden" {...register("servItems")} />
        </section>

        <AddItemsPopup
          visible={showPopup}
          onClose={() => setShowPopup(false)}
          onAdd={addItem}
        />      
        <section>
          <ProcessButton type="submit" variant="success" size="sm">
            Guardar Servicio
          </ProcessButton>
        </section>
        </form>      
      : ""}

      <div className="actions">
        <button onClick={() => router.push("/services")}/*{() => router.back()}*/ className="btn-back">
          ← Volver al listado
        </button>
      </div>
    </div>
  );
}
