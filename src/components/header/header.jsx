import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Navbar, NavbarBrand, NavbarContent, Button, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar } from "@nextui-org/react";


export default function App() {
    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const avatar = usuario.avatar;
    const correo = usuario.correo;
    const nombre = usuario.nombre.split(' ')[0];
    const id = usuario.id;

    const handdlelogon = async (e) => {
        e.preventDefault();
        localStorage.removeItem('usuario');
        window.location.href = '/login';
    }

    const [menuData, setMenuData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const abortController = new AbortController();

        async function cargarMenu(id) {
            setIsLoading(true);
            try {
                const response = await fetch('https://gesrtor-proyectos-back.onrender.com/menuRol/CargarMenu', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id }),
                    signal: abortController.signal
                });
                const result = await response.json();
                setMenuData(result);
            } catch (error) {
                if (error.name === 'AbortError') {
                } else {
                    console.log(error);
                }
            } finally {
                setIsLoading(false);
            }
        }

        cargarMenu(id);

        return () => {
            abortController.abort();
        };
    }, [id]);

    const handleMenuClick = (link) => {
        if (link !== "#") {
            const newLink = link.startsWith('/') ? `/home${link}` : `/home/${link}`;
            navigate(newLink);
        }
    };

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    return (

        <Navbar isBordered>
            <NavbarBrand className="mr-4">
                <img src="../src/assets/logo2.png" alt="Logo" className="w-10 h-10" />
                <p className="hidden sm:block font-bold text-inherit ml-2">GESSTTOR</p>
            </NavbarBrand>

            <div className="flex gap-4"> 
                {menuData?.menuPadre.map((padre) => (
                    <Dropdown key={padre.id} backdrop="blur">
                        <DropdownTrigger>
                            <Button
                                variant="bordered"
                                className="capitalize"
                                startContent={padre.icono && <span>{padre.icono}</span>}
                            >
                                {padre.nombreMenu}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            variant="faded"
                            aria-label={`${padre.nombreMenu} submenu`}
                            className="w-[200px]" 
                        >
                            {menuData?.menusHijos
                                .filter(hijo => hijo.padre === padre.id)
                                .map(hijo => (
                                    <DropdownItem
                                        key={hijo.id}
                                        onClick={() => handleMenuClick(hijo.link)}
                                        startContent={hijo.icono && <span>{hijo.icono}</span>}
                                        className="hover:bg-default-100" 
                                    >
                                        {hijo.nombreMenu}
                                    </DropdownItem>
                                ))}
                        </DropdownMenu>
                    </Dropdown>
                ))}
            </div>

            <NavbarContent as="div" className="items-center" justify="end">
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <Avatar
                            isBordered
                            as="button"
                            className="transition-transform"
                            color="secondary"
                            name={nombre}
                            size="sm"
                            src={avatar}
                        />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                        <DropdownItem
                            key="profile"
                            className="h-14 gap-2"
                            textValue={`Conectado como ${correo}`} 
                        >
                            <p className="font-semibold">Conectado como</p>
                            <p className="font-semibold">{correo}</p>
                        </DropdownItem>
                        <DropdownItem
                            key="logout"
                            onClick={handdlelogon}
                            color="danger"
                            textValue="Cerrar Sesión"
                        >
                            Cerrar Sesión
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
        </Navbar>
    );
}