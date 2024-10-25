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

export default function Metricas({ setMetrica, usuarioCalidad }) {
  const [nombreMetrica, setNombreMetrica] = useState("");
  const [descripcionMetrica, setDescripcionMetrica] = useState("");
  const [usuarioAsignado, setUsuarioAsignado] = useState("");
  const [metricasList, setMetricasList] = useState([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const hayUsuariosSeleccionados = usuarioCalidad && usuarioCalidad.size > 0;

  const handleSubmit = () => {
    if (!nombreMetrica || !descripcionMetrica || !usuarioAsignado || !usuarioCalidad) return;

    const usuariosArray = Array.from(usuarioCalidad);
    const usuarioSeleccionado = usuariosArray.find(user => user.id.toString() === usuarioAsignado.toString());

    if (!usuarioSeleccionado) {
      console.error('Usuario seleccionado no encontrado');
      return;
    }

    const nuevaMetrica = {
      id: Date.now(),
      nombreMetrica,
      descripcionMetrica,
      usuarioAsignado: {
        id: usuarioSeleccionado.id,
        nombre: usuarioSeleccionado.nombre
      }
    };

    const nuevasMetricas = [...metricasList, nuevaMetrica];
    setMetricasList(nuevasMetricas);
    setMetrica(new Set(nuevasMetricas));

    setNombreMetrica("");
    setDescripcionMetrica("");
    setUsuarioAsignado("");
  };

  const handleEliminarMetrica = (metricaId) => {
    const metricasActualizadas = metricasList.filter(t => t.id !== metricaId);
    setMetricasList(metricasActualizadas);
    setMetrica(new Set(metricasActualizadas));
  };

  if (!hayUsuariosSeleccionados) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Metricas del Proyecto</h3>
        <Button onPress={onOpen} color="secondary">Crear Nueva Metrica</Button>
      </div>

      <Table aria-label="Tabla de Metricas" className="mt-3">
        <TableHeader>
          <TableColumn>NOMBRE METRICA</TableColumn>
          <TableColumn>DESCRIPCIÓN</TableColumn>
          <TableColumn>ID USUARIO</TableColumn>
          <TableColumn>USUARIO ASIGNADO</TableColumn>
          <TableColumn>ACCIÓN</TableColumn>
        </TableHeader>
        <TableBody>
          {metricasList.map((metrica) => (
            <TableRow key={metrica.id}>
              <TableCell>{metrica.nombreMetrica}</TableCell>
              <TableCell>{metrica.descripcionMetrica}</TableCell>
              <TableCell>{metrica.usuarioAsignado.id}</TableCell>
              <TableCell>{metrica.usuarioAsignado.nombre}</TableCell>
              <TableCell>
                <Button 
                  color="danger" 
                  size="sm"
                  onPress={() => handleEliminarMetrica(metrica.id)}
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
              <ModalHeader className="flex flex-col gap-1">Nueva Metrica</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Nombre"
                  placeholder="Ingrese Nombre de Metrica"
                  variant="bordered"
                  value={nombreMetrica}
                  onChange={(e) => setNombreMetrica(e.target.value)}
                />
                <Input                  
                  label="Descripción"
                  placeholder="Ingrese la descripción de la metrica"
                  variant="bordered"
                  value={descripcionMetrica}
                  onChange={(e) => setDescripcionMetrica(e.target.value)}
                />
                <Select
                  label="Usuario Asignado"
                  placeholder="Seleccione un usuario"
                  value={usuarioAsignado}
                  onChange={(e) => setUsuarioAsignado(e.target.value)}
                >
                  {usuarioCalidad && Array.from(usuarioCalidad).map((usuario) => (
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
                  isDisabled={!nombreMetrica || !descripcionMetrica || !usuarioAsignado}
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