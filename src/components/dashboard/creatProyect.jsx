import React, { useState } from "react";
import {
  Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure,
} from "@nextui-org/react";
import DesarrolloSelect from "./desarrolloSelect.jsx";
import CalidadSelect from "./calidadSelect.jsx";
import Tareas from "./tareas.jsx"
import Pruebas from "./pruebas.jsx"
import Metricas from "./metricas.jsx"

export default function CrearProyecto({agregarProyecto}) {
    const [nombreProyecto, setNombreProyecto] = useState("");
    const [descripcionProyecto, setDescripcionProyecto] = useState("");
    const [usuarioDesarrollo, setUsuarioDesarrollo] = useState(new Set([]));
    const [usuarioCalidad, setUsuarioCalidad] = useState(new Set([]));
    const [tarea, setTarea] = useState(new Set([]));
    const [prueba, setPrueba] = useState(new Set([]));
    const [metrica, setMetrica] = useState(new Set([]));
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
    const handleSubmit = async () => {
      const usuarioDesarrolloArray = Array.from(usuarioDesarrollo).map(user => user.id);
      const usuarioCalidadArray = Array.from(usuarioCalidad).map(user => user.id);
      const tareaArray = Array.from(tarea);
      const pruebaArray = Array.from(prueba);
      const metricaArray = Array.from(metrica);
      const data = {nombreProyecto,
        descripcionProyecto,
        usuarioDesarrolloArray,
        usuarioCalidadArray,
        tareaArray,
        pruebaArray,
        metricaArray}

      try {
        const response = await fetch("https://gesrtor-proyectos-back.onrender.com/Proyectos/crear", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        const result = await response.json();
          agregarProyecto(result);
        
  
      } catch (error) {
        console.error("Error al cargar los proyectos:", error);
      }
  
      setNombreProyecto("");
      setDescripcionProyecto("");
      setUsuarioDesarrollo(new Set([]));
      setUsuarioCalidad(new Set([]));
      setTarea(new Set([]));
      setPrueba(new Set([]));
      setMetrica(new Set([]));
    };

    return (
      <div>
        <Button onPress={onOpen} color="secondary">Crear Nuevo Proyecto</Button>
        <Modal
          backdrop="opaque"
          isOpen={isOpen}
          size="full"
          onOpenChange={onOpenChange}
          radius="lg"
          scrollBehavior="inside"
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
                    value={nombreProyecto}
                    onChange={(e) => setNombreProyecto(e.target.value)}
                  />
                  <Input                  
                    label="descripción"
                    placeholder="Ingrese Descripción del Proyecto"
                    variant="bordered"
                    value={descripcionProyecto}
                    onChange={(e) => setDescripcionProyecto(e.target.value)}
                  />
                  <DesarrolloSelect 
                    usuarioDesarrollo={usuarioDesarrollo} 
                    setUsuarioDesarrollo={setUsuarioDesarrollo} 
                  />
                  <Tareas 
                    tarea={tarea} 
                    setTarea={setTarea}
                    usuarioDesarrollo={usuarioDesarrollo}
                  />
                  <CalidadSelect 
                    usuarioCalidad={usuarioCalidad} 
                    setUsuarioCalidad={setUsuarioCalidad} 
                  />
                  <Pruebas 
                    setPrueba={setPrueba}
                    usuarioCalidad={usuarioCalidad}
                  />
                  <Metricas 
                    metrica={metrica} 
                    setMetrica={setMetrica}
                    usuarioCalidad={usuarioCalidad}
                  />
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