import React, { useState } from "react";
import RolSelect from "../rol/rolSelect.jsx";
import {
  Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,
} from "@nextui-org/react";
import { MailIcon, CameraIcon } from "../../icons/icons.jsx";

export default function CrearUsuario({ agregarUsuario }) {
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [idRol, setIdRol] = useState(new Set()); 
    const [avatar, setAvatar] = useState(null); 
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
    const handleAvatarChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const fileType = file.type;
        if (fileType === "image/png" || fileType === "image/jpeg" || fileType === "image/jpg") {
          setAvatar(file);
        } else {
          alert("Por favor selecciona una imagen válida (PNG, JPEG, JPG).");
          setAvatar(null);
        }
      }
    };
  
    const handleSubmit = async () => {
      const idRolValue = Array.from(idRol)[0]; 
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("correo", correo);
      formData.append("avatar", avatar);
      formData.append("idRol", idRolValue);
  
      try {
        const response = await fetch("https://gesrtor-proyectos-back.onrender.com/Usuarios/Crear", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
  
        if (response.ok) {
          agregarUsuario(result.usuario); 
          alert(result.message);
        } else {
          console.error("Error:", result.message);
        }
  
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
  
      setNombre("");
      setCorreo("");
      setIdRol(new Set()); 
      setAvatar(null);
    };

  return (
    <div>
      <Button onPress={onOpen} color="secondary">Crear Nuevo Usuario</Button>
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
              <ModalHeader className="flex flex-col gap-1">Nuevo Usuario</ModalHeader>
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
                  endContent={
                    <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Correo"
                  placeholder="Ingrese correo"
                  variant="bordered"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
                <Input
                  endContent={
                    <CameraIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Avatar"
                  placeholder="Ingrese Avatar"
                  type="file"
                  variant="bordered"
                  onChange={handleAvatarChange}
                />
                <RolSelect setIdRol={setIdRol} /> {/* Pasar la función setIdRol como prop */}
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
