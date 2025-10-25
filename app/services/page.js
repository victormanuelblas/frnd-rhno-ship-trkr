'use client';
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import './style.sass';
import { formatDate, getCurrentDate, getMinDate } from '@/utils/tools'
import AvisoCargando from "@/components/recursos/cargando";
import AvisoError from "@/components/recursos/error";
import useFetch from "@/hooks/useFetch";
import useThemeByHour from "@/hooks/useThemeByHour";
import { Pencil, RefreshCw, Clipboard } from "lucide-react";
import { useForm } from "react-hook-form";
import TextInput from "@/components/recursos/textInput";
import DateInput from "@/components/recursos/dateInput";
import SelectInput from "@/components/recursos/selectInput";
import useAuthGuard from "@/hooks/useAuthGuard";
import { useDispatch, useSelector } from "react-redux";
import { setClients } from "../store/clientSlice";
import useFetchDdd from "@/hooks/useFetchDdd";

const pageSize = 10;

const servStcnls = [
    {
        id: 1,
        name: "Registrado"
    },
    {
        id: 2,
        name: "Embalado"
    },
    {
        id: 3,
        name: "Despachado"
    },
      {
        id: 4,
        name: "Transito"
    },
      {
        id: 5,
        name: "LlegadaDestino"
    },
      {
        id: 6,
        name: "Entregado"
    },
  
      {
        id: 7,
        name: "Devuelto"
    },
  ]

export default function ServicesPage() {
  useThemeByHour();
  const {user, checked } = useAuthGuard()
  const dispatch = useDispatch();
  const { list: clients } = useSelector((state) => state.clients);

  const hasClients = clients && clients.length > 0;

    const [rspnClients] = useFetchDdd(
    { path: 'clin'},
    undefined,
    "GET",
    !hasClients,
    () => {
      let rslt = data
      console.log('carga cliente', rslt);
    }
  );

  useEffect(() => {
    if (rspnClients.data && Array.isArray(rspnClients.data)) {
      dispatch(setClients(rspnClients.data));
    }
  }, [rspnClients.data, dispatch]);

  const filtersRef = useRef({
    owner: 1,
    client: user?.clientId,
    dateini: getMinDate(7),
    datefin: getCurrentDate(),
    servstte: "",
    clinname: "",
    destname: "",
    clinguia: "",
  });

  const [services, setServices] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [copiedCode, setCopiedCode] = useState(null); 

  const { register, handleSubmit } = useForm({
    defaultValues: filtersRef.current,
  });

  const [{ data, loading, error }, reload] = useFetch(
    { path: "serv", queryParams: { ...filtersRef.current,  pagenumb: 1 }},
    null,
    "GET",
    false,
    () => {

    }
  );

  useEffect(() => {
    //if(user?.clientId){
      reload({
        queryParams: { ...filtersRef.current, pagenumb: 1 },
      });
    //}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      setServices(data);
      const totalRecords = Number(data[0].servRecords || 0);
      setTotalPages(Math.max(1, Math.ceil(totalRecords / pageSize)));
    } else if (data && data.length === 0) {
      setServices([]);
      setTotalPages(1);
    }
  }, [data]);

  if (loading) return <AvisoCargando />;
  if (error) return <AvisoError />;
  if (!checked) return null 

  const copyToClipboard = (code) => {
    const fullUrl = `${window.location.origin}/services/tracker/?code=${code}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000); // tooltip se oculta en 2s
    });
  };
  
  const handleFilterSubmit = (formData) => {
    filtersRef.current = { ...formData};
    setPage(1);
    reload({
      queryParams: {
        ...filtersRef.current,
        pagenumb: 1,
      },
    });
  };

  const handlePage = (action) => {
    if (loading) return;

    const newPage =
      action === "a"
        ? Math.min(page + 1, totalPages)
        : Math.max(page - 1, 1);

    if (newPage === page) return;

    setPage(newPage);

    reload({
      queryParams: {
        ...filtersRef.current,
        pagenumb: newPage,
      },
    });
  };

  
  return (
    <>
    <div className="services-content">
      <div className="services-header">
        <h1>Servicios</h1>
        {(user?.clientId == 0) ? 
          <Link href="/services/info">
            <button className="btn-new-service">
              + Nuevo Servicio
            </button>
          </Link>
        :
          ""
        }
      </div>
      <section className="filters-section">
        <form onSubmit={handleSubmit(handleFilterSubmit)}>
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
            <SelectInput
              label="Estado"
              name="servstte"
              register={register}
              options={servStcnls}
              placeholder="—Todos—"
            />
            <TextInput
              label="Guía Cliente"
              name="clinguia"
              register={register}
              placeholder="Número de guía"
            />
            {(user?.clientId == 0) ? 
              <TextInput
                label="Cliente"
                name="clinname"
                register={register}
                placeholder="Nombre del cliente"
              />
            :
               ""
            }
            {(user?.clientId > 0) ? 
              <TextInput
                label="Destinatario"
                name="destname"
                register={register}
                placeholder="Destinatario"
              />
            :
               ""
            }
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
               {(user?.clientId == 0) ? 
                  <th>Cliente</th>
               :
               ""
               }
                <th>Destinatario</th>
                <th>Direccion</th>
                <th>Entregar en</th>
                <th>Fec.Estm.Entr.</th>
                <th>Estado</th>
                <th>Fec.Entrega</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {services.map((serv, i) => (
                <tr key={i}>
                  <td>{formatDate(serv.servDate)}</td>
                  {(user?.clientId == 0) ? 
                    <td>{serv.servClientName}</td>
                  :
                  ""
                  }
                  <td>{serv.servDestinyName}</td>
                  <td>{serv.servDestinyAddresses}</td>
                  <td>{serv.servDeliveredType}</td>
                  <td>{formatDate(serv.servEtaDate)}</td>
                  <td>{serv.servStateDetail}</td>
                  <td>{formatDate(serv.servDeliveredDate)}</td>
                  <td className="actions-cell">
                  {/* Editar */}
                  {(user?.clientId == 0) ? 
                    <div className="tooltip-wrapper">
                      <Link href={`/services/info/update?serv=${serv.servId}`}>
                        <Pencil size={18} />
                      </Link>
                      <span className="tooltip-text">Editar</span>
                    </div>
                  :
                    ""
                  }
                  {/* Actualizar eventos */}
                  <div className="tooltip-wrapper">
                    <Link href={`/services/trackerevent?code=${serv.servCode}`}>
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
                      {copiedCode === serv.servCode ? "Copiado" : "Copiar link"}
                    </span>
                  </div>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <button onClick={() => handlePage('r')} disabled={page === 1}>
            &laquo; Anterior
          </button>
          <span>
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => handlePage('a')}
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
