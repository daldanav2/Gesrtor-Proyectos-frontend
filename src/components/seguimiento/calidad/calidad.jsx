import React, { useState, useEffect } from "react";
import {
    Progress,
    Listbox,
    ListboxItem,
    Tooltip,
} from "@nextui-org/react";
import DetalleProyecto from "./detalleProyecto";

export default function App() {
    const [proyecto, setProyecto] = useState(null);
    const [proyectos, setProyectos] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("usuario"));
        async function cargarProyectos() {
            try {
                const response = await fetch("https://gesrtor-proyectos-back.onrender.com/Proyectos/usuarioQAProyecto", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        idUsuario: user.id
                    })
                });
                const result = await response.json();
                setProyectos(result);
            } catch (error) {
                console.error("Error al cargar los proyectos:", error);
            }
        }
        cargarProyectos();
    }, []);

    const handleGetProyect = (idProyecto) => {
        setProyecto(idProyecto);
    };

    const actualizarProyectoEnLista = (proyectoActualizado) => {
        const proyectosActualizados = proyectos.map(p => 
            p.idProyecto === proyectoActualizado.idProyecto ? proyectoActualizado : p
        );
        setProyectos(proyectosActualizados);
    };

    return (
        <div className="flex w-full h-screen">
            {/* Sidebar de selección de proyectos */}
            <div className="w-64 border-r border-gray-200 bg-gray-50 p-4">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">Proyectos Asignados</span>
                <Listbox
                    classNames={{
                        base: "max-w-xs",
                    }}
                    items={proyectos}
                    label="Proyectos Asignados"
                    onSelectionChange={(key) => handleGetProyect(key)}
                    variant="flat"
                >
                    {(item) => (
                        <ListboxItem
                            key={item.idProyecto}
                            onClick={() => handleGetProyect(item)}
                            textValue={item.nombreProyecto}
                        >
                            <Tooltip content={item.descripcion}>
                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                    {item.nombreProyecto}
                                    <Progress
                                        aria-label="Downloading..."
                                        size="md"
                                        value={item.porcentaje_desarrollo}
                                        color="success"
                                        showValueLabel={true}
                                        className="max-w-md"
                                    />

                                </span>
                            </Tooltip>
                        </ListboxItem>
                    )}
                </Listbox>
            </div>
            <div className="flex-1 p-6">
                {proyecto ? (
                    <DetalleProyecto
                            proyecto={proyecto}
                            setProyecto={(proyectoActualizado) => {
                            setProyecto(proyectoActualizado);
                            actualizarProyectoEnLista(proyectoActualizado); // Actualizar también la lista de proyectos
                        }} />
                ) : (
                    <div className="text-center text-gray-500 mt-10">
                        Selecciona un proyecto para ver sus detalles
                    </div>
                )}
            </div>
        </div>
    );
}
