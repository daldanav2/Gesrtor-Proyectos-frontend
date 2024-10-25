import React, { useState, useEffect } from "react";
import { Input, Card, Progress, CardBody, Tooltip } from "@nextui-org/react";

const columns = [
    { key: "nombreMetrica", label: "METRICA" },
    { key: "justificacion", label: "JUSTIFICACION" },
    { key: "ponderacion", label: "PONDERACION" }
];

const columns2 = [
    { key: "nombrePrueba", label: "PRUEBA" },
    { key: "nota", label: "NOTA" },
    { key: "estado", label: "ESTADO" }
];

export default function DetalleProyecto({ proyecto, setProyecto }) {
    const [pruebas, setPruebas] = useState([]);
    const [notas, setNotas] = useState({});
    const [metricas, setMetricas] = useState([]);
    const [proyectoCabecera, setProyectoCabecera] = useState([]);
    const [usuario, setUsuario] = useState("");

    const handleEstado = async (estado, prueba, nota) => {
        try {
            const response = await fetch("https://gesrtor-proyectos-back.onrender.com/Proyectos/ActualizarEstadoPrueba", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    idPrueba: prueba.id,
                    estado: estado,
                    nota: nota,
                    usuario: usuario,
                    idProyecto: proyecto.idProyecto
                }),
            });

            const result = await response.json();
            if (Array.isArray(result) && result.length > 0) {
                setProyecto(result[0]);
                setProyectoCabecera(result[0]);
            } else {
                setProyecto(result);
                setProyectoCabecera(result);
            }
            const pruebasActualizadas = pruebas.map(t => {
                if (t.id === prueba.id) {
                    return {
                        ...t,
                        estado: estado,
                        nota: nota
                    };
                }
                return t;
            });

            setPruebas(pruebasActualizadas);
        } catch (error) {
            console.error("Error al actualizar la prueba:", error);
        }
    };

    useEffect(() => {
        async function cargarProyecto() {
            const user = JSON.parse(localStorage.getItem("usuario"));
            setUsuario(user.id);
            setProyectoCabecera(proyecto);
            try {
                const response = await fetch("https://gesrtor-proyectos-back.onrender.com/Proyectos/proyectoDetalleQA", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        idUsuario: user.id,
                        idProyecto: proyecto.idProyecto,
                    }),
                });
                const result = await response.json();
                setPruebas(result.pruebas);
                setMetricas(result.metricas);
                const resultPrueba = result.pruebas;
                const initialNotas = resultPrueba.reduce((acc, prueba) => {
                    acc[prueba.id] = prueba.nota || "";
                    return acc;
                }, {});
                setNotas(initialNotas);
            } catch (error) {
                console.error("Error al cargar los proyectos:", error);
            }
        }

        if (proyecto) {
            cargarProyecto();
        }
    }, [proyecto]);

    const handleNotaChange = (idPrueba, nuevaNota) => {
        setNotas(prevNotas => ({
            ...prevNotas,
            [idPrueba]: nuevaNota
        }));
    };

    const handleJustificacionChange = (idMetrica, nuevaJustificacion) => {
        const metricasActualizadas = metricas.map(metrica =>
            metrica.id === idMetrica ? { ...metrica, justificacion: nuevaJustificacion } : metrica
        );
        setMetricas(metricasActualizadas);
    };

    const handlePonderacionChange = (idMetrica, nuevaPonderacion) => {
        const metricasActualizadas = metricas.map(metrica =>
            metrica.id === idMetrica ? { ...metrica, ponderacion: nuevaPonderacion } : metrica
        );
        setMetricas(metricasActualizadas);
    };

    const handleSaveMetrica = async (idMetrica, tipo, valor) => {
        try {
            const response = await fetch("https://gesrtor-proyectos-back.onrender.com/Proyectos/ActualizarMetricas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    idMetrica: idMetrica,
                    tipo: tipo, 
                    valor: valor,
                }),
            });
    
            const result = await response.json();
            if (result.success) {
                console.log("Métrica actualizada correctamente");
            } else {
                console.error("Error al actualizar la métrica");
            }
        } catch (error) {
            console.error("Error al enviar la métrica:", error);
        }
    };
    
    const handleKeyDownJustificacion = (e, idMetrica) => {
        if (e.key === "Enter" || e.key === "Tab") {
            const metrica = metricas.find(m => m.id === idMetrica);
            handleSaveMetrica(idMetrica, "justificacion", metrica.justificacion);
        }
    };
    
    const handleKeyDownPonderacion = (e, idMetrica) => {
        if (e.key === "Enter" || e.key === "Tab") {
            const metrica = metricas.find(m => m.id === idMetrica);
            handleSaveMetrica(idMetrica, "ponderacion", metrica.ponderacion);
        }
    };

    const renderCell = (prueba, columnKey) => {
        const cellValue = prueba[columnKey];

        switch (columnKey) {
            case "nombrePrueba":
                return (
                    <Tooltip content={"Descripción: " + prueba.descripcion}>
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            {cellValue}
                        </span>
                    </Tooltip>
                );
            case "nota":
                return (
                    <Input
                        className="text-lg text-default-400 active:opacity-50"
                        label="Nota"
                        placeholder="Ingrese nota"
                        variant="bordered"
                        value={notas[prueba.id] || ""}
                        onChange={(e) => handleNotaChange(prueba.id, e.target.value)}
                    />
                );
            case "estado":
                return (
                    <select
                        className="text-lg text-default-400 cursor-pointer active:opacity-50"
                        value={prueba.estado}
                        onChange={(e) => handleEstado(e.target.value, prueba, notas[prueba.id])}
                    >
                        <option value="1">Abierto</option>
                        <option value="2">En Proceso</option>
                        <option value="3">Pendiente</option>
                        <option value="4">Completado</option>
                        <option value="5">Cancelado</option>
                    </select>
                );
            default:
                return cellValue;
        }
    };

    const renderCellMetrica = (metrica, columnKey) => {
        const cellValue = metrica[columnKey];

        switch (columnKey) {
            case "nombreMetrica":
                return (
                    <Tooltip content={"Descripción: " + metrica.descripcion}>
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            {cellValue}
                        </span>
                    </Tooltip>
                );
            case "justificacion":
                return (
                    <Input
                        className="text-lg text-default-400 active:opacity-50"
                        label="Justificación"
                        placeholder="Ingrese justificación"
                        variant="bordered"
                        value={metrica.justificacion || ""}
                        onChange={(e) => handleJustificacionChange(metrica.id, e.target.value)}
                        onKeyDown={(e) => handleKeyDownJustificacion(e, metrica.id)} 
                    />
                );
            case "ponderacion":
                return (
                    <Input
                        type="number"
                        className="text-lg text-default-400 cursor-pointer active:opacity-50"
                        label="Ponderación"
                        placeholder="Ingrese ponderación"
                        variant="bordered"
                        value={metrica.ponderacion || ""}
                        onChange={(e) => handlePonderacionChange(metrica.id, e.target.value)}
                        onKeyDown={(e) => handleKeyDownPonderacion(e, metrica.id)}                                     
                    />
                );
            default:
                return cellValue;
        }
    };

    return (
        <div>
            <Card>
                <CardBody>
                    <p>Nombre de Proyecto: {proyectoCabecera.nombreProyecto}</p>
                    <p>Descripcion del Proyecto: {proyectoCabecera.descripcion}</p>
                    <Progress
                        aria-label="Downloading..."
                        size="md"
                        value={proyectoCabecera.porcentaje_desarrollo}
                        color="success"
                        showValueLabel={true}
                        className="max-w-md"
                    />
                    <div className="border rounded-lg overflow-hidden mt-5">
                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">Pruebas</span>
                        <div className="flex justify-between items-center px-4 py-2 bg-gray-100">
                            {columns2.map(column => (
                                <div key={column.key} className="w-1/4 text-center">
                                    <label className="font-semibold">{column.label}</label>
                                </div>
                            ))}
                        </div>

                        {pruebas.map((prueba, index) => (
                            <div
                                key={prueba.id || index}
                                className="flex justify-between items-center px-4 py-2 border-b hover:bg-gray-50"
                            >
                                {columns2.map(column => (
                                    <div key={column.key} className="w-1/4 text-center">
                                        {renderCell(prueba, column.key)}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="border rounded-lg overflow-hidden mt-5">
                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">Metricas</span>
                        <div className="flex justify-between items-center px-4 py-2 bg-gray-100">
                            {columns.map(column => (
                                <div key={column.key} className="w-1/4 text-center">
                                    <label className="font-semibold">{column.label}</label>
                                </div>
                            ))}
                        </div>

                        {metricas.map((metrica, index) => (
                            <div
                                key={metrica.id || index}
                                className="flex justify-between items-center px-4 py-2 border-b hover:bg-gray-50"
                            >
                                {columns.map(column => (
                                    <div key={column.key} className="w-1/4 text-center">
                                        {renderCellMetrica(metrica, column.key)}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
