import React, { useState, useEffect } from "react";
import {
    Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Progress,
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
} from "@nextui-org/react";

const columnsM = [
    { name: "METRICA", uid: "nombreMetrica" },
    { name: "DESCRIPCON", uid: "descripcion" },
    { name: "JUSTIFICACION", uid: "justificacion" },
    { name: "PONDERACION", uid: "ponderacion" }
];

const columnsT = [
    { name: "TAREA", uid: "nombreTarea" },
    { name: "DESCRIPCION", uid: "descripcion" },
    { name: "NOTA", uid: "nota" },
    { name: "ESTADO", uid: "estado" },
];

const columnsP = [
    { name: "PRUEBA", uid: "nombrePrueba" },
    { name: "DESCRIPCION", uid: "descripcion" },
    { name: "NOTA", uid: "nota" },
    { name: "ESTADO", uid: "estado" }
];

export default function CrearProyecto({ proyecto, isOpen, onClose }) {
    const [proyectoCabecera, setProyectoCabecera] = useState([]);
    const [promedioTotal, setPromedioTotal] = useState([]);
    const [tareas, setTareas] = useState([]);
    const [pruebas, setPruebas] = useState([]);
    const [metricas, setMetricas] = useState([]);

    useEffect(() => {
        if (proyecto) {
            setProyectoCabecera(proyecto);
            const porcentajeCalidad = parseFloat(proyecto.porcentaje_calidad) || 0;
            const porcentajeDesarrollo = parseFloat(proyecto.porcentaje_desarrollo) || 0;

            const promedio = (porcentajeCalidad + porcentajeDesarrollo) / 2;
            setPromedioTotal(promedio);

            async function cargarRoles() {
                try {
                    const response = await fetch("https://gesrtor-proyectos-back.onrender.com/Proyectos/proyectoDetalle", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            idProyecto: proyecto.idProyecto
                        }),
                    });
                    const result = await response.json();
                    setTareas(result.tareas);
                    setPruebas(result.pruebas);
                    setMetricas(result.metricas);
                } catch (error) {
                    console.error("Error al cargar roles:", error);
                }
            }

            cargarRoles();
        }
    }, [proyecto]);

    const renderCellT = (tarea, columnKey) => {
        const cellValue = tarea[columnKey];

        switch (columnKey) {
            case "nombreTarea":
                return (
                    <Tooltip >
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            {cellValue}
                        </span>
                    </Tooltip>
                );
            case "descripcion":
                return (
                    <Tooltip >
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            {cellValue}
                        </span>
                    </Tooltip>
                );
            case "nota":
                return (
                    <Tooltip >
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            {cellValue}
                        </span>
                    </Tooltip>
                );
            case "estado":
                return (
                    <Tooltip >
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            {cellValue}
                        </span>
                    </Tooltip>
                );
            default:
                return cellValue;
        }
    };

    const renderCellM = (metrica, columnKey) => {
        const cellValue = metrica[columnKey];

        switch (columnKey) {
            case "nombreMetrica":
                return (
                    <Tooltip >
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            {cellValue}
                        </span>
                    </Tooltip>
                );
            case "descripcion":
                return (
                    <Tooltip >
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            {cellValue}
                        </span>
                    </Tooltip>
                );
            case "justificacion":
                return (
                    <Tooltip >
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            {cellValue}
                        </span>
                    </Tooltip>
                );
            case "ponderacion":
                return (
                    <Tooltip >
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            {cellValue}
                        </span>
                    </Tooltip>
                );
            default:
                return cellValue;
        }
    };

    const renderCellP = (rol, columnKey) => {
        const cellValue = rol[columnKey];

        switch (columnKey) {
            case "nombrePrueba":
                return (
                    <Tooltip >
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            {cellValue}
                        </span>
                    </Tooltip>
                );
            case "descripcion":
                return (
                    <Tooltip >
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            {cellValue}
                        </span>
                    </Tooltip>
                );
            case "nota":
                return (
                    <Tooltip >
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            {cellValue}
                        </span>
                    </Tooltip>
                );
            case "estado":
                return (
                    <Tooltip >
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            {cellValue}
                        </span>
                    </Tooltip>
                );
            default:
                return cellValue;
        }
    };

    return (
        <div>
        <Modal
          backdrop="opaque"
          isOpen={isOpen}
          size="full"
          radius="lg"
          scrollBehavior="inside"
          classNames={{
            body: "py-6",
            backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
            base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
            header: "border-b-[1px] border-[#292f46]",
            footer: "border-t-[1px] border-[#292f46]",
            closeButton: "hover:bg-white/5 active:bg-white/10",
          }}
        >
          <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Informacion del Proyecto</ModalHeader>
                <ModalBody>
                <Tooltip >
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            Nombre: {proyectoCabecera.nombre}
                        </span>
                    </Tooltip>
                    <Tooltip >
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            Descripción: {proyectoCabecera.descripcion}
                        </span>
                    </Tooltip>
                    <Progress
                        aria-label="Downloading..."
                        size="md"
                        value={promedioTotal}
                        color="success"
                        showValueLabel={true}
                        className="max-w-md"
                    />
                    <div className="border rounded-lg  mt-2">
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">Tareas</span>
                        <Progress
                            aria-label="Downloading..."
                            size="md"
                            value={proyectoCabecera.porcentaje_desarrollo}
                            color="success"
                            showValueLabel={true}
                            className="max-w-md"
                        />
                        <Tooltip >
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                Usuarios de Desarrollo asignados: {proyectoCabecera.usuarios_desarrollo}
                            </span>
                        </Tooltip>
                        <div className="mt-1">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                Tareas
                            </span>
                            <Table aria-label="Example table with custom cells">
                                <TableHeader columns={columnsT}>
                                    {(column) => (
                                        <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                                            {column.name}
                                        </TableColumn>
                                    )}
                                </TableHeader>
                                <TableBody items={tareas}>
                                    {(item) => (
                                        <TableRow key={item.id}>
                                            {(columnKey) => <TableCell>{renderCellT(item, columnKey)}</TableCell>}
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    <div className="border rounded-lg  mt-2">
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">Pruebas</span>
                        <Progress
                            aria-label="Downloading..."
                            size="md"
                            value={proyectoCabecera.porcentaje_calidad}
                            color="success"
                            showValueLabel={true}
                            className="max-w-md"
                        />
                        <Tooltip >
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                Usuarios de Calidad asignados: {proyectoCabecera.usuarios_calidad}
                            </span>
                        </Tooltip>
                        <div className="mt-1">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                Pruebas
                            </span>
                            <Table aria-label="Example table with custom cells">
                                <TableHeader columns={columnsP}>
                                    {(column) => (
                                        <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                                            {column.name}
                                        </TableColumn>
                                    )}
                                </TableHeader>
                                <TableBody items={pruebas}>
                                    {(item) => (
                                        <TableRow key={item.id}>
                                            {(columnKey) => <TableCell>{renderCellP(item, columnKey)}</TableCell>}
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="mt-1">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                Metricas
                            </span>
                            <Table aria-label="Example table with custom cells">
                                <TableHeader columns={columnsM}>
                                    {(column) => (
                                        <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                                            {column.name}
                                        </TableColumn>
                                    )}
                                </TableHeader>
                                <TableBody items={metricas}>
                                    {(item) => (
                                        <TableRow key={item.id}>
                                            {(columnKey) => <TableCell>{renderCellM(item, columnKey)}</TableCell>}
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="red" variant="light" onPress={onClose}>
                    Cerrar
                  </Button>
                </ModalFooter>
          </ModalContent>
        </Modal>
        </div>
        
        
    );
}