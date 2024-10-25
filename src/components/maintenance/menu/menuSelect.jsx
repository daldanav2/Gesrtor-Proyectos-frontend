import { Select, SelectItem } from "@nextui-org/react";
import React, { useState, useEffect } from "react";

export default function MenuSelect({ idMenu, setIdMenu }) {
  const colors = ["primary"];
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function cargarMenu() {
      try {
        const response = await fetch("https://gesrtor-proyectos-back.onrender.com/Menu/son", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setMenus(result);
      } catch (error) {
        console.error("Error al cargar menus:", error);
      } finally {
        setIsLoading(false);
      }
    }
    cargarMenu();
  }, []); 

  const handleMenuChange = (selectedKeys) => {
    setIdMenu(selectedKeys); 
  };

  return (
    <div className="w-full flex flex-row flex-wrap gap-4">
      {colors.map((color) => (
        <Select
          key={color}
          color={color}
          label="Menús"
          placeholder="Seleccione los menús"
          className="max-w-xs"
          isDisabled={isLoading}
          selectionMode="multiple"
          defaultSelectedKeys={!isLoading && idMenu ? idMenu : new Set([])}
          selectedKeys={idMenu}
          onSelectionChange={handleMenuChange}
        >
          {menus.map((menu) => (
            <SelectItem key={menu.id} value={menu.id} textValue={menu.nombreMenu}>
              {menu.nombreMenu}
            </SelectItem>
          ))}
        </Select>
      ))}  
    </div>  
  );
}