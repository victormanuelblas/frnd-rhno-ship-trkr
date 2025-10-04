'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import './style.sass';
import { formatDate, getCurrenDate, getMinDate } from '@/utils/tools'
import AvisoCargando from "@/components/recursos/cargando";
import AvisoError from "@/components/recursos/error";
import useFetch from "@/hooks/useFetch";
import useThemeByHour from "@/hooks/useThemeByHour";
import { Pencil, RefreshCw, Clipboard } from "lucide-react";
import { useForm } from "react-hook-form";
import TextInput from "@/components/recursos/textInput";
import DateInput from "@/components/recursos/dateInput";

export default function ServicesPage() {
  useThemeByHour();

  const [services, setServices] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [copiedCode, setCopiedCode] = useState(null); 

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      owner: 1,
      usrid: 1,
      dateini: getMinDate(7),       // fecha inicio
      datefin: getCurrenDate(),       // fecha fin
      clinname: "",        // cliente
      clinguia: "",   // guía de cliente
    }
  });

  const filters = watch();

  const [{ data, loading, error }, reload] = useFetch(
    { path: "serv", queryParams: { owner: 1, ...filters }},
    null,
    "GET",
    true,
  );

   // 👇 controlamos la actualización de services con useEffect
  useEffect(() => {
    if (data) setServices(data);
  }, [data]);

  if (loading) return <AvisoCargando />;
  if (error) return <AvisoError />;

  const copyToClipboard = (code) => {
    const fullUrl = `${window.location.origin}/servicescontent/tracker/${code}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000); // tooltip se oculta en 2s
    });
  };
  
  return (
    <>
    <div className="services-content">
      <div className="services-header">
        <h1>Servicios</h1>
        <Link href="/servicescontent/info">
          <button className="btn-new-service">
            + Nuevo Servicio
          </button>
        </Link>
      </div>
      <section className="filters-section">
        <form
          onSubmit={handleSubmit((formData) => {
            reload({
              queryParams: {
                owner: 1,
                dateini: formData.dateIni,
                datefin: formData.dateFin,
                client: formData.client,
                clientGuide: formData.clientGuide,
              },
            });
          })}
        >
          <div className="filters-row">
            <DateInput
              label="Fecha Inicio"
              name="dateini"
              register={register}
            />
            <DateInput
              label="Fecha Fin"
              name="datefin"
              register={register}
            />
            <TextInput
              label="Cliente"
              name="clinname"
              register={register}
              placeholder="Nombre del cliente"
            />
            <TextInput
              label="Guía Cliente"
              name="clinguia"
              register={register}
              placeholder="Número de guía"
            />
            <button type="submit" className="btn-filter">
              Filtrar
            </button>
          </div>
        </form>
      </section>

      <section id='services-items'>
        <div className="table-wrapper">
          <table className="services-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Origen</th>
                <th>Cliente</th>
                <th>Destinatario</th>
                <th>Direccion</th>
                <th>Entregar en</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {services.map((serv, i) => (
                <tr key={i}>
                  <td>{formatDate(serv.servDate)}</td>
                  <td>{serv.servOriginName}</td>
                  <td>{serv.servClientName}</td>
                  <td>{serv.servDestinyName}</td>
                  <td>{serv.servDestinyAddresses}</td>
                  <td>{serv.servDeliveredType}</td>
                  <td>{serv.servStateDetail}</td>
                  <td className="actions-cell">
                  {/* Editar */}
                  <div className="tooltip-wrapper">
                    <Link href={`/servicescontent/info/${serv.servId}`}>
                      <Pencil size={18} />
                    </Link>
                    <span className="tooltip-text">Editar</span>
                  </div>

                  {/* Actualizar eventos */}
                  <div className="tooltip-wrapper">
                    <Link href={`/servicescontent/events/${serv.servCode}`}>
                      <RefreshCw size={18} />
                    </Link>
                    <span className="tooltip-text">Actualizar eventos</span>
                  </div>

                  {/* Copiar link */}
                  <div className="tooltip-wrapper">
                    <button onClick={() => copyToClipboard(serv.servCode)}>
                      <Clipboard size={18} />
                    </button>
                    <span className="tooltip-text">
                      {copiedCode === serv.servCode ? "Copiado ✅" : "Copiar link"}
                    </span>
                  </div>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
            &laquo; Anterior
          </button>
          <span>
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page === totalPages}
          >
            Siguiente &raquo;
          </button>
        </div>
      </section>
    </div>
    </>
  );
}
