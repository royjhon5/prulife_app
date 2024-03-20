import ReactDOM from 'react-dom/client'
import './index.css'
import { AuthProvider } from './modules/authentication/AuthContext'
import { RouterProvider } from 'react-router-dom'
import routes from './routes/routes'

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <RouterProvider router={routes} />
    </AuthProvider>
)
