import { Select, SelectItem } from "@nextui-org/react";
import React, { useState, useEffect } from "react";

export default function RolSelect({ idRol, setIdRol }) { 
  const colors = ["primary"];
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    async function cargarRol() {
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
      } finally {
        setIsLoading(false); 
      }
    }
    cargarRol();
  }, []); 

  const handleRoleChange = (selectedKey) => {
    setIdRol(selectedKey); 
  };

  return (
    <div className="w-full flex flex-row flex-wrap gap-4">
      {colors.map((color) => (
        <Select
          key={color}
          color={color}
          label="Rol"
          placeholder="Seleccione un rol"
          className="max-w-xs"
          isDisabled={isLoading} 
          defaultSelectedKeys={!isLoading && idRol ? new Set([idRol]) : undefined} 
          onSelectionChange={handleRoleChange} 
        >
          {roles.map((rol) => (
            <SelectItem key={rol.id} value={rol.id} textValue={rol.nombreRol}>
              {rol.nombreRol}
            </SelectItem>
          ))}
        </Select>
      ))}  
    </div>  
  );
}
