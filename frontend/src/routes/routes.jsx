import { createBrowserRouter } from 'react-router-dom';
import DefaultLayout from '../layout/DefaultLayout.jsx';
import Login from '../features/login/Login.jsx'
import Register from '../features/register/Register.jsx'
import GuestLayout from '../layout/GuestLayout.jsx';
import { lazy } from 'react';
import Loadable from '../components/Loadable.jsx'

const Manager_List = Loadable(lazy(() => import('../views/manager_list/ManagerList.jsx')));
const Main_Page = Loadable(lazy(() => import('../views/dashboard/MainPage.jsx')));
const Byb_List = Loadable(lazy(() => import('../views/byb_type/BybList.jsx')));
const Document_list = Loadable(lazy(() => import('../views/document_list/Document_list.jsx')));
const Byb_Recruit = Loadable(lazy(() => import('../views/client_list/BybRecruit.jsx')));
const Exam_Payment = Loadable(lazy(() => import('../views/exam_payment/ExamPayment.jsx')));

const routes = createBrowserRouter([
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/',
                element: <Login />,
            },
            {
                path: '/register',
                element: <Register />,
            }
        ],
    },
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/dashboard',
                element: <Main_Page />,
            },
            {
                path: '/manager-list',
                element: <Manager_List />
            },
            {
                path: '/byb-list',
                element: <Byb_List />
            },
            {
                path: '/req-list',
                element: <Document_list />
            },
            {
                path: 'new-recruit',
                element: <Byb_Recruit />
            },
            {
                path: '/exam-payment',
                element: <Exam_Payment />
            }
        ],
    },
])

export default routes;