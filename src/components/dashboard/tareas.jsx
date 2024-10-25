import React, { useState } from "react";
import {
  Input, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button, 
  useDisclosure,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from "@nextui-org/react";

export default function Tareas({ tarea, setTarea, usuarioDesarrollo }) {
  const [nombreTarea, setNombreTarea] = useState("");
  const [descripcionTarea, setDescripcionTarea] = useState("");
  const [usuarioAsignado, setUsuarioAsignado] = useState("");
  const [tareasList, setTareasList] = useState([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const hayUsuariosSeleccionados = usuarioDesarrollo && usuarioDesarrollo.size > 0;

  const handleSubmit = () => {
    if (!nombreTarea || !descripcionTarea || !usuarioAsignado) return;

    const usuarioSeleccionado = Array.from(usuarioDesarrollo)
      .find(user => user.id.toString() === usuarioAsignado.toString());

    const nuevaTarea = {
      id: Date.now(),
      nombreTarea,
      descripcionTarea,
      usuarioAsignado: {
        id: usuarioSeleccionado.id,
        nombre: usuarioSeleccionado.nombre
      }
    };

    setTareasList([...tareasList, nuevaTarea]);
    setTarea(new Set([...Array.from(tarea), nuevaTarea]));

    setNombreTarea("");
    setDescripcionTarea("");
    setUsuarioAsignado("");
  };

  const handleEliminarTarea = (tareaId) => {
    const tareasActualizadas = tareasList.filter(t => t.id !== tareaId);
    setTareasList(tareasActualizadas);
    setTarea(new Set(tareasActualizadas));
  };

  if (!hayUsuariosSeleccionados) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tareas del Proyecto</h3>
        <Button onPress={onOpen} color="secondary">Crear Nueva Tarea</Button>
      </div>

      <Table aria-label="Tabla de tareas" className="mt-3">
        <TableHeader>
          <TableColumn>NOMBRE TAREA</TableColumn>
          <TableColumn>DESCRIPCIÓN</TableColumn>
          <TableColumn>ID USUARIO</TableColumn>
          <TableColumn>USUARIO ASIGNADO</TableColumn>
          <TableColumn>ACCIÓN</TableColumn>
        </TableHeader>
        <TableBody>
          {tareasList.map((tarea) => (
            <TableRow key={tarea.id}>
              <TableCell>{tarea.nombreTarea}</TableCell>
              <TableCell>{tarea.descripcionTarea}</TableCell>
              <TableCell>{tarea.usuarioAsignado.id}</TableCell>
              <TableCell>{tarea.usuarioAsignado.nombre}</TableCell>
              <TableCell>
                <Button 
                  color="danger" 
                  size="sm"
                  onPress={() => handleEliminarTarea(tarea.id)}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
              <ModalHeader className="flex flex-col gap-1">Nueva Tarea</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Nombre"
                  placeholder="Ingrese Nombre de Tarea"
                  variant="bordered"
                  value={nombreTarea}
                  onChange={(e) => setNombreTarea(e.target.value)}
                />
                <Input                  
                  label="Descripción"
                  placeholder="Ingrese la descripción de la tarea"
                  variant="bordered"
                  value={descripcionTarea}
                  onChange={(e) => setDescripcionTarea(e.target.value)}
                />
                <Select
                  label="Usuario Asignado"
                  placeholder="Seleccione un usuario"
                  value={usuarioAsignado}
                  onChange={(e) => setUsuarioAsignado(e.target.value)}
                >
                  {Array.from(usuarioDesarrollo).map((usuario) => (
                    <SelectItem 
                      key={usuario.id.toString()} 
                      value={usuario.id.toString()}
                    >
                      {`${usuario.nombre} (ID: ${usuario.id})`}
                    </SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="red" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  className="bg-[#6f4ef2] shadow-lg shadow-indigo-500/20"
                  onPress={() => {
                    handleSubmit();
                    onClose();
                  }}
                  isDisabled={!nombreTarea || !descripcionTarea || !usuarioAsignado}
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