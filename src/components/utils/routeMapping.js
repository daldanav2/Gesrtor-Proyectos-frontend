import { lazy } from 'react';

export const routeComponentMap = {
    '/usuario': lazy(() => import('../maintenance/user/user.jsx')),
    '/rol': lazy(() => import('../maintenance/rol/rol.jsx')),
    '/menu': lazy(() => import('../maintenance/menu/menu.jsx')),
    '/dashboard': lazy(() => import('../dashboard/dashboard.jsx')),
    '/seguimientoD': lazy(() => import('../seguimiento/desarrollo/desarrollo.jsx')),
    '/seguimientoQA': lazy(() => import('../seguimiento/calidad/calidad.jsx')),
};