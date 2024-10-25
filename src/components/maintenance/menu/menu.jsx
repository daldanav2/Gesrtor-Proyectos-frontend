import React, { useState, useEffect } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow,
  TableCell,  Chip, Tooltip, 
} from "@nextui-org/react";
import { EditIcon, DeleteIcon, CheckCircleIcon } from "../../icons/icons.jsx";
import CrearMenu from './newMenu.jsx'; 

const statusColorMap = {
  1: "success",
  0: "danger",
};

const columns = [
    { name: "MENU", uid: "nombreMenu" },
    { name: "ESTADO", uid: "activo" },
    { name: "ACCIÓN", uid: "actions" },
  ];

export default function menu() {
    const [menus, setMenu] = useState([]);

    useEffect(() => {
        async function cargarMenus() {
          try {
            const response = await fetch("https://gesrtor-proyectos-back.onrender.com/Menu", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
            const result = await response.json();
            setMenu(result);
          } catch (error) {
            console.error("Error al cargar usuarios:", error);
          }
        }
    
        cargarMenus();
      }, []);

      const handleStatusChange = async (menuId, currentStatus) => {
        try {
          const url = currentStatus === 1 
          ? 'https://gesrtor-proyectos-back.onrender.com/Menu/Eliminar/'
          : 'https://gesrtor-proyectos-back.onrender.com/Menu/Activar/';
    
          
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({"id":menuId}),
          });
          const result = await response.json();
          if(result.reg===1){
            setMenu(prevUsers => 
                prevUsers.map(menu => 
                  menu.id === menuId 
                    ? { ...menu, activo: currentStatus === 1 ? 0 : 1 }
                    : menu
                )
              );
          }
          
        } catch (error) {
          console.error("Error al cambiar el estado del rol:", error);
        }
      };  

      const agregarMenu = (nuevoMenu) => {
        setMenu((prevUsers) => [...prevUsers, nuevoMenu]);
      };
  const renderCell = React.useCallback((menus, columnKey) => {
    const cellValue = menus[columnKey];

    switch (columnKey) {        
      case "nombreMenu":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
          </div>
        );
      case "activo":
        return (
          <Chip className="capitalize" color={statusColorMap[menus.activo]} size="sm" variant="flat">
            {menus.activo === 1 ? 'Activo' : 'Inactivo'}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">            
            <Tooltip content="Editar Menu">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content={menus.activo === 1 ? "Desactivar Menu" : "Activar Menu"}>
              <span className={`text-lg cursor-pointer active:opacity-50 ${
                  menus.activo === 1 ? 'text-danger' : 'text-success'
                }`}
                onClick={() => handleStatusChange(menus.id, menus.activo)}>
              {menus.activo === 1 ? <DeleteIcon /> : <CheckCircleIcon />}
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div>
        <CrearMenu agregarMenu={agregarMenu} />
        <div className="mt-5">
            <Table aria-label="Example table with custom cells">
            <TableHeader columns={columns}>
                {(column) => (
                <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                    {column.name}
                </TableColumn>
                )}
            </TableHeader>
            <TableBody items={menus}>
                {(item) => (
                <TableRow key={item.id}>
                    {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
    </div>
  
  );
}
