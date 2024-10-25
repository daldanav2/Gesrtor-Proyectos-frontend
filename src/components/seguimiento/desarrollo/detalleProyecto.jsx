import React, { useState, useEffect } from "react";
import {
    Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,
    Card, Progress, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell,
    CardBody, Tooltip,
    Listbox,Textarea,
    ListboxSection,
    ListboxItem
} from "@nextui-org/react";

const columns = [
    { name: "TAREA", uid: "nombreTarea" },
    { name: "DESCRIPCION", uid: "descripcion" },
    { name: "ESTADO", uid: "estado" },
];

const columns2 = [
    { key: "nombreTarea", label: "TAREA" },
    { key: "nota", label: "NOTA" },
    { key: "estado", label: "ESTADO" }
];

export default function DetalleProyecto({ proyecto, setProyecto }) {
    const [tareas, setTareas] = useState([]);
    const [notas, setNotas] = useState({});
    const [proyectoCabecera, setProyectoCabecera] = useState([]);
    const [usuario, setUsuario] = useState("");
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleEstado = async (estado, tarea, nota) => {
        try {



            try {
                const response = await fetch("https://gesrtor-proyectos-back.onrender.com/Proyectos/ActualizarEstadoTarea", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        idTarea: tarea.id,
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
                const tareasActualizadas = tareas.map(t => {
                    if (t.id === tarea.id) {
                        return {
                            ...t,
                            estado: estado,
                            nota: nota
                        };
                    }
                    return t;
                });

                setTareas(tareasActualizadas);
            } catch (error) {
                console.error("Error al actualizar la tarea:", error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        async function cargarProyecto() {

            const user = JSON.parse(localStorage.getItem("usuario"));
            setUsuario(user.id);
            setProyectoCabecera(proyecto);
            try {
                const response = await fetch("https://gesrtor-proyectos-back.onrender.com/Proyectos/proyectoDetalleD", {
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
                setTareas(result);

                // Inicializar las notas con valores existentes
                const initialNotas = result.reduce((acc, tarea) => {
                    acc[tarea.id] = tarea.nota || "";
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

    const handleNotaChange = (idTarea, nuevaNota) => {
        setNotas(prevNotas => ({
            ...prevNotas,
            [idTarea]: nuevaNota
        }));
    };

    const renderCell = (tarea, columnKey) => {
        const cellValue = tarea[columnKey];

        switch (columnKey) {
            case "nombreTarea":
                return (
                    <Tooltip content={"Descripción: " + tarea.descripcion}>
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            {cellValue}
                        </span>
                    </Tooltip>
                );
            case "nota":
                return <Textarea
                    className="text-lg text-default-400 active:opacity-50"
                    label="Nota"
                    placeholder="Ingrese nota"
                    value={notas[tarea.id] || ""} // Usar el valor de nota individual para la tarea
                    onChange={(e) => handleNotaChange(tarea.id, e.target.value)}
                />
                    ;
            case "estado":
                return (
                    <select
                        className="text-lg text-default-400 cursor-pointer active:opacity-50"
                        value={tarea.estado}
                        onChange={(e) => handleEstado(e.target.value, tarea, notas[tarea.id])}
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
                        {/* Cabecera */}
                        <div className="flex justify-between items-center px-4 py-2 bg-gray-100">
                            {columns2.map(column => (
                                <div key={column.key} className="w-1/4 text-center">
                                    <label className="font-semibold">{column.label}</label>
                                </div>
                            ))}
                        </div>

                        {/* Filas de datos */}
                        {tareas.map((tarea, index) => (
                            <div
                                key={tarea.id || index}
                                className="flex justify-between items-center px-4 py-2 border-b hover:bg-gray-50"
                            >
                                {columns2.map(column => (
                                    <div key={column.key} className="w-1/4 text-center">
                                        {renderCell(tarea, column.key)}
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
