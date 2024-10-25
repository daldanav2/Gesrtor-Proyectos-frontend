import React, { useState } from "react";
import {
  Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,
} from "@nextui-org/react";
import PadreSelect from "./dadSelect.jsx";

export default function CrearMenu({ agregarMenu }) {
    const [nombre, setNombre] = useState("");
    const [link, setLink] = useState("");
    const [icono, setIcono] = useState("");
    const [padre, setPadre] = useState(new Set());
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
    const handleSubmit = async () => {
      const idPadreArray = Array.from(padre)[0];
      
      try {
        const response = await fetch("https://gesrtor-proyectos-back.onrender.com/Menu/Crear", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nombre: nombre,
            link: link,
            idPadre: idPadreArray,
            icono: icono
        })
        });
        const result = await response.json();
        if (response.ok) {
          agregarMenu(result.menu);
        } else {
          console.error("Error:", result.message);
        }
  
      } catch (error) {
        console.error("Error al cargar los menu:", error);
      }
  
      setNombre("");
      setLink("");
      setIcono("");
      setPadre(new Set()); 
    };

  return (
    <div>
      <Button onPress={onOpen} color="secondary">Crear Nuevo Menu</Button>
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
              <ModalHeader className="flex flex-col gap-1">Nuevo Menu</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Nombre"
                  placeholder="Ingrese Nombre"
                  variant="bordered"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
                <Input                  
                  label="Link"
                  placeholder="Ingrese link"
                  variant="bordered"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
                <Input
                  label="Icono"
                  placeholder="Ingrese Icono"
                  variant="bordered"
                  value={icono}
                  onChange={(e) => setIcono(e.target.value)}
                />
                <PadreSelect padre={padre} setPadre={setPadre} />
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