import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Progress } from "@nextui-org/react";
import { EyeIcon } from "../icons/icons.jsx";
import CrearProyecto from "./creatProyect.jsx"
import VerDetalleProyecto from "./detalleProyecto.jsx"

const columns = [
    { name: "PROYECTO", uid: "nombre" },
    { name: "USUARIOS DESARROLLO", uid: "usuarios_desarrollo" },
    { name: "PORCENTAJE AREA DESARROLLO", uid: "porcentaje_desarrollo" },
    { name: "USUARIOS QA", uid: "usuarios_calidad" },
    { name: "PORCENTAJE AREA QA", uid: "porcentaje_calidad" },
    { name: "ACTIONS", uid: "actions" },
];

export default function Dashboard() {
    const [proyectos, setProyectos] = useState([]);
    const [proyectToView, setProyectToView] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        async function cargarProyectos() {
            try {
                const response = await fetch("https://gesrtor-proyectos-back.onrender.com/Proyectos", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const result = await response.json();
                setProyectos(result);
            } catch (error) {
                console.error("Error al cargar los proyectos:", error);
            }
        }

        cargarProyectos();
    }, []);

    const renderCell = React.useCallback((proyecto, columnKey) => {
        const cellValue = proyecto[columnKey];

        switch (columnKey) {
            case "nombre":
                return (
                    <Tooltip content={proyecto.descripcion}>
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            {cellValue}
                        </span>
                    </Tooltip>
                );

            case "usuarios_desarrollo":
                const usuariosDesarrollo = cellValue.split(", ").map((usuario, index) => (
                    <span key={index} style={{ display: "block" }} className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        {usuario}
                    </span>
                ));
                return usuariosDesarrollo;

            case "porcentaje_desarrollo":
                return (
                    <Progress
                        aria-label="Downloading..."
                        size="md"
                        value={cellValue}
                        color="success"
                        showValueLabel={true}
                        className="max-w-md"
                    />
                );

            case "usuarios_calidad":
                const usuariosCalidad = cellValue.split(", ").map((usuario, index) => (
                    <span key={index} style={{ display: "block" }} className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        {usuario}
                    </span>
                ));
                return usuariosCalidad;
            case "porcentaje_calidad":
                return (
                    <Progress
                        aria-label="Downloading..."
                        size="md"
                        value={cellValue}
                        color="success"
                        showValueLabel={true}
                        className="max-w-md"
                    />
                );

            case "actions":
                return (
                    <div className="relative flex items-center justify-center gap-2">
                        <Tooltip content="Details">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                onClick={() => {
                                    setProyectToView(proyecto);
                                    setIsModalOpen(true);
                                }}
                            >
                                <EyeIcon />

                            </span>
                        </Tooltip>
                    </div>
                );


            default:
                return cellValue;
        }
    }, []);

    const agregarProyecto = (nuevoProyecto) => {
        window.location.reload();
    };


    return (
        <div>
            < CrearProyecto agregarProyecto={agregarProyecto} />
            <div className="mt-5">
                <Table aria-label="Example table with custom cells">
                    <TableHeader columns={columns}>
                        {(column) => (
                            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                                {column.name}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody items={proyectos}>
                        {(item) => (
                            <TableRow key={item.idProyecto}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {proyectToView && (
                    <VerDetalleProyecto
                        proyecto={proyectToView}
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
            </div>
        </div>

    );
}
