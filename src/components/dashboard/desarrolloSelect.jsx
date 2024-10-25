import { Select, SelectItem } from "@nextui-org/react";
import React, { useState, useEffect } from "react";

export default function DesarrolloSelect({ usuarioDesarrollo, setUsuarioDesarrollo }) {
  const colors = ["primary"];
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function cargarUsuariosDesarrollo() {
      try {
        const response = await fetch("https://gesrtor-proyectos-back.onrender.com/Usuarios/Desarrollo", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setUsuarios(result);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      } finally {
        setIsLoading(false);
      }
    }
    cargarUsuariosDesarrollo();
  }, []);

  const handleSelectionChange = (selectedKeys) => {
    const selectedUsersSet = new Set(
      Array.from(selectedKeys).map(id => 
        usuarios.find(user => user.id.toString() === id.toString())
      ).filter(Boolean)
    );
    setUsuarioDesarrollo(selectedUsersSet);
  };

  const selectedKeys = new Set(
    Array.from(usuarioDesarrollo).map(user => user.id.toString())
  );


  return (
    <div className="w-full flex flex-row flex-wrap gap-4">
      {colors.map((color) => (
        <Select
          key={color}
          color={color}
          label="Asigne los usuarios de Desarrollo"
          placeholder="Usuarios"
          className="max-w-xs"
          isDisabled={isLoading}
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={handleSelectionChange}
        >
          {usuarios.map((usuario) => (
            <SelectItem 
              key={usuario.id.toString()} 
              value={usuario.id.toString()}
            >
              {usuario.nombre}
            </SelectItem>
          ))}
        </Select>
      ))}
    </div>
  );
}