// components/DynamicContent.jsx
import { Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { routeComponentMap } from './utils/routeMapping';

function DynamicContent() {
    const location = useLocation();
    const newPath = location.pathname.replace("/home/", "/");
    const Component = routeComponentMap[newPath];
    if (!Component) {
        return <div>Bienvenido al sistema de Gestión de Proyectos.</div>;
    }

    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <Component />
        </Suspense>
    );
}

export default DynamicContent;