import React, { useState, useEffect } from "react";
import { Select, SelectItem } from "@nextui-org/react";

export default function SelectEstados({ idEstado, onChange }) {
    const [estados, setEstados] = useState([]);
    const [estadoSeleccionado, setEstadoSeleccionado] = useState(idEstado);

    useEffect(() => {
        async function cargarEstados() {
            try {
                const response = await fetch("https://gesrtor-proyectos-back.onrender.com/Estados", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                const result = await response.json();
                setEstados(result);
            } catch (error) {
                console.error("Error al cargar los estados:", error);
            }
        }

        cargarEstados();
    }, []);

    useEffect(() => {
        setEstadoSeleccionado(idEstado);
    }, [idEstado]);

    const handleChange = (newEstado) => {
        setEstadoSeleccionado(newEstado);
        if (onChange) {
            onChange(newEstado); // Llama a la función `onChange` pasada como prop
        }
    };

    return (
        <Select
            items={estados}
            placeholder="Seleccione un estado"
            label="Estados"
            className="max-w-xs"
            selectedKey={estadoSeleccionado}
            onSelectionChange={(key) => handleChange(key)} // Actualiza el estado y llama a `onChange`
        >
            {estados.map((estado) => (
                <SelectItem key={estado.id} textValue={estado.nombreEstado}>
                    {estado.nombreEstado}
                </SelectItem>
            ))}
        </Select>
    );
}
