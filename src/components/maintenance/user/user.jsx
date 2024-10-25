import React, { useState, useEffect } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow,
  TableCell, User, Chip, Tooltip,
} from "@nextui-org/react";
import { EditIcon, DeleteIcon, CheckCircleIcon } from "../../icons/icons.jsx";
import CrearUsuario from './newUser.jsx';
import ModificarUsuario from './modUser.jsx';

const columns = [
  { name: "NOMBRE", uid: "name" },
  { name: "ROL", uid: "role" },
  { name: "ESTADO", uid: "status" },
  { name: "ACCIÓN", uid: "actions" },
];

const statusColorMap = {
  active: "success",
  inactive: "danger",
};

export default function App() {
  const [users, setUsers] = useState([]);
  const [userToEdit, setUserToEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function cargarUsuarios() {
      try {
        const response = await fetch("https://gesrtor-proyectos-back.onrender.com/Usuarios", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setUsers(result);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    }

    cargarUsuarios();
  }, []);

  const actualizarUsuario = (usuarioActualizado) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === usuarioActualizado.id ? usuarioActualizado : user
      )
    );
  };

  const agregarUsuario = (nuevoUsuario) => {
    setUsers((prevUsers) => [...prevUsers, nuevoUsuario]);
  };

  const handleStatusChange = async (userId, currentStatus) => {
    try {
      const url = currentStatus === 'active'
        ? 'https://gesrtor-proyectos-back.onrender.com/Usuarios/Eliminar/'
        : 'https://gesrtor-proyectos-back.onrender.com/Usuarios/Activar/';


      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "id": userId }),
      });
      const result = await response.json();
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId
            ? { ...user, status: currentStatus === 'active' ? 'inactive' : 'active' }
            : user
        )
      );
    } catch (error) {
      console.error("Error al cambiar el estado del usuario:", error);
    }
  };

  const renderCell = (user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.avatar }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.status]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Editar Usuario">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => {
                  setUserToEdit(user);
                  setIsModalOpen(true);
                }}
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content={user.status === 'active' ? "Desactivar Usuario" : "Activar Usuario"}>
              <span
                className={`text-lg cursor-pointer active:opacity-50 ${user.status === 'active' ? 'text-danger' : 'text-success'
                  }`}
                onClick={() => handleStatusChange(user.id, user.status)}
              >
                {user.status === 'active' ? <DeleteIcon /> : <CheckCircleIcon />}
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
      <CrearUsuario agregarUsuario={agregarUsuario} />
      <div className="mt-5">
        <Table aria-label="Example table with custom cells">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={users}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {userToEdit && (
        <ModificarUsuario
          usuario={userToEdit}
          actualizarUsuario={actualizarUsuario}
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
