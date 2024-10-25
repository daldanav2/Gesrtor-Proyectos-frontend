import React, { useState, useEffect } from "react";
import {
    Table, TableHeader, TableColumn, TableBody, TableRow,
    TableCell, Chip, Tooltip,
} from "@nextui-org/react";
import { EditIcon, DeleteIcon, CheckCircleIcon } from "../../icons/icons.jsx";
import CrearRol from './newRol.jsx';
import ModificarRol from './modRol.jsx'; 

const statusColorMap = {
    1: "success",
    0: "danger",
};

const columns = [
    { name: "ROL", uid: "nombreRol" },
    { name: "ESTADO", uid: "activo" },
    { name: "ACCIÓN", uid: "actions" },
];

export default function Rol() {
    const [roles, setRoles] = useState([]);
    const [rolToEdit, setRolToEdit] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        async function cargarRoles() {
            try {
                const response = await fetch("https://gesrtor-proyectos-back.onrender.com/Roles", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const result = await response.json();
                setRoles(result);
            } catch (error) {
                console.error("Error al cargar roles:", error);
            }
        }

        cargarRoles();
    }, []);

    const handleStatusChange = async (rolId, currentStatus) => {
        try {
            const url = currentStatus === 1
                ? 'https://gesrtor-proyectos-back.onrender.com/Roles/Eliminar/'
                : 'https://gesrtor-proyectos-back.onrender.com/Roles/Activar/';

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ "id": rolId }),
            });
            const result = await response.json();
            if (result.reg === 1) {
                setRoles(prevRoles =>
                    prevRoles.map(rol =>
                        rol.id === rolId
                            ? { ...rol, activo: currentStatus === 1 ? 0 : 1 }
                            : rol
                    )
                );
            }
        } catch (error) {
            console.error("Error al cambiar el estado del rol:", error);
        }
    };

    const agregarRol = (nuevoRol) => {
        setRoles((prevRoles) => [...prevRoles, nuevoRol]);
    };

    const actualizarRol = (rolActualizado) => {
        setRoles((prevRoles) =>
            prevRoles.map((rol) =>
                rol.id === rolActualizado.id ? rolActualizado : rol
            )
        );
    };

    const renderCell = (rol, columnKey) => {
        const cellValue = rol[columnKey];

        switch (columnKey) {
            case "nombreRol":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">{cellValue}</p>
                    </div>
                );
            case "activo":
                return (
                    <Chip className="capitalize" color={statusColorMap[rol.activo]} size="sm" variant="flat">
                        {rol.activo === 1 ? 'Activo' : 'Inactivo'}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Editar Rol">
                            <span
                                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                onClick={() => {
                                    setRolToEdit(rol);
                                    setIsModalOpen(true);
                                }}
                            >
                                <EditIcon />
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content={rol.activo === 1 ? "Desactivar Rol" : "Activar Rol"}>
                            <span
                                className={`text-lg cursor-pointer active:opacity-50 ${rol.activo === 1 ? 'text-danger' : 'text-success'
                                    }`}
                                onClick={() => handleStatusChange(rol.id, rol.activo)}
                            >
                                {rol.activo === 1 ? <DeleteIcon /> : <CheckCircleIcon />}
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    };

    return (
        <div>
            <CrearRol agregarRol={agregarRol} />
            <div className="mt-5">
                <Table aria-label="Example table with custom cells">
                    <TableHeader columns={columns}>
                        {(column) => (
                            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                                {column.name}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody items={roles}>
                        {(item) => (
                            <TableRow key={item.id}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {rolToEdit && (
                <ModificarRol
                    rol={rolToEdit} 
                    actualizarRol={actualizarRol} 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </div>
    );
}
