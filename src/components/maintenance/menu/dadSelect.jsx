import { Select, SelectItem } from "@nextui-org/react";
import React, { useState, useEffect } from "react";

export default function PadreSelect({ padre, setPadre }) {
  const colors = ["primary"];
  const [padres, setPadres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function cargarPadre() {
      try {
        const response = await fetch("https://gesrtor-proyectos-back.onrender.com/Menu/dad", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setPadres(result);
      } catch (error) {
        console.error("Error al cargar menus:", error);
      } finally {
        setIsLoading(false);
      }
    }
    cargarPadre();
  }, []); 

  const handleMenuChange = (selectedKeys) => {
    setPadre(selectedKeys); 
  };

  return (
    <div className="w-full flex flex-row flex-wrap gap-4">
      {colors.map((color) => (
        <Select
          key={color}
          color={color}
          label="Menús"
          placeholder="Seleccione El Padre"
          className="max-w-xs"
          isDisabled={isLoading}
          defaultSelectedKeys={!isLoading && padre ? padre : new Set([])}
          selectedKeys={padre}
          onSelectionChange={handleMenuChange}
        >
          {padres.map((padre) => (
            <SelectItem key={padre.id} value={padre.id} textValue={padre.nombreMenu}>
              {padre.nombreMenu}
            </SelectItem>
          ))}
        </Select>
      ))}  
    </div>  
  );
}