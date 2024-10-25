import React, { useState, useEffect } from "react";
import RolSelect from "../rol/rolSelect.jsx";
import {
  Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button,
} from "@nextui-org/react";
import { MailIcon, CameraIcon } from "../../icons/icons.jsx";

export default function ModificarUsuario({ usuario, actualizarUsuario, isOpen, onClose }) {
  const [nombre, setNombre] = useState(usuario?.name || "");
  const [correo, setCorreo] = useState(usuario?.email || "");
  const [idRol, setIdRol] = useState(usuario?.idRol || ""); 
  const [avatar, setAvatar] = useState(null); 
    
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType === "image/png" || fileType === "image/jpeg" || fileType === "image/jpg") {
        setAvatar(file);
      } else {
        alert("Selecciona una imagen válida (PNG, JPEG, JPG).");
        setAvatar(null);
      }
    }
  };

  const handleSubmit = async () => {
    const idRolValue = Array.from(idRol)[0];
    const formData = new FormData();
    formData.append("id", usuario.id)
    formData.append("nombre", nombre);
    formData.append("correo", correo);
    formData.append("idRol", idRolValue); 
    if (avatar) formData.append("avatar", avatar); 
    
    try {
      const response = await fetch(`https://gesrtor-proyectos-back.onrender.com/Usuarios/Modificar/`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      actualizarUsuario(result.usuario); 
      onClose(); 
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  useEffect(() => {
    setNombre(usuario?.name || "");
    setCorreo(usuario?.email || "");
    setIdRol(usuario?.idRol || ""); 
  }, [usuario]);

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
        <ModalHeader>Editar Usuario</ModalHeader>
        <ModalBody>
          <Input
            label="Nombre"
            placeholder="Nombre del Usuario"
            variant="bordered"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <Input
            endContent={<MailIcon className="text-2xl text-default-400" />}
            label="Correo"
            placeholder="Correo Electrónico"
            variant="bordered"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          <Input
            endContent={<CameraIcon className="text-2xl text-default-400" />}
            label="Avatar"
            placeholder="Cargar Avatar"
            type="file"
            variant="bordered"
            onChange={handleAvatarChange}
          />
          <RolSelect idRol={idRol} setIdRol={setIdRol} /> {/* Asegúrate de pasar `idRol` como prop */}
        </ModalBody>
        <ModalFooter>
          <Button color="red" variant="light" onPress={onClose}>
            Cancelar
          </Button>
          <Button color="primary" onPress={handleSubmit}>
            Actualizar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
