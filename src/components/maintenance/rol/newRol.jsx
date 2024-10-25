import React, { useState } from "react";
import MenuSelect from "../menu/menuSelect.jsx";
import {
  Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,
} from "@nextui-org/react";

export default function CrearRol({ agregarRol }) {
    const [nombre, setNombre] = useState("");
    const [idMenu, setIdMenu] = useState(new Set()); 
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
    const handleSubmit = async () => {
      const idMenuArray = Array.from(idMenu);
      
      try {
        const response = await fetch("https://gesrtor-proyectos-back.onrender.com/Roles/Crear", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nombre: nombre,
            idMenus: idMenuArray
        })
        });
        const result = await response.json();
        if (response.ok) {
          agregarRol(result.rol);
        } else {
          console.error("Error:", result.message);
        }
  
      } catch (error) {
        console.error("Error al cargar roles:", error);
      }
  
      setNombre("");
      setIdMenu(new Set()); 
    };

  return (
    <div>
      <Button onPress={onOpen} color="secondary">Crear Nuevo Rol</Button>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
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
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Nuevo Rol</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Nombre"
                  placeholder="Ingrese Nombre"
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
                  onPress={async () => {
                    await handleSubmit();
                    onClose();
                  }}
                >
                  Grabar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}