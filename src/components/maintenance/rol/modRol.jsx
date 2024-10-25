import React, { useState, useEffect } from "react";
import MenuSelect from "../menu/menuSelect.jsx";
import {
  Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button,
} from "@nextui-org/react";

export default function ModificarRol({ rol, actualizarRol, isOpen, onClose }) {
  const [nombre, setNombre] = useState(rol?.nombreRol || "");
  const [idMenu, setIdMenu] = useState(new Set([]));
  
  useEffect(() => {
    if (rol) {
      setNombre(rol.nombreRol || "");
      setIdMenu(new Set([]));
    }
  }, [rol]);

  const handleSubmit = async () => {
    const idMenuArray = Array.from(idMenu);

    try {
      const response = await fetch(`https://gesrtor-proyectos-back.onrender.com/Roles/Modificar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            idRol: rol.id,
            nombre,
            idMenus: idMenuArray,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        actualizarRol(result.rol);
        onClose();
      } else {
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Error al modificar el rol:", error);
    }
  };

  return (
    <Modal
      backdrop="opaque"
      isOpen={isOpen}
      onOpenChange={onClose}
      radius="lg"
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
        <ModalHeader className="flex flex-col gap-1">Modificar Rol</ModalHeader>
        <ModalBody>
          <Input
            label="Nombre"
            placeholder="Ingrese Nombre del Rol"
            variant="bordered"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <MenuSelect idMenu={idMenu} setIdMenu={setIdMenu} />
        </ModalBody>
        <ModalFooter>
          <Button color="red" variant="light" onPress={onClose}>
            Cancelar
          </Button>
          <Button
            className="bg-[#6f4ef2] shadow-lg shadow-indigo-500/20"
            onPress={handleSubmit}
          >
            Actualizar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}