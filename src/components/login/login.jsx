import { useState } from 'react';
import { Input, Button,Modal,Avatar } from '@nextui-org/react';


const Login = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const handdlelogin = async (e) => {
    e.preventDefault();
    const data = {
      correo: correo,
      contrasenia: password,
    };



    await fetch('https://gesrtor-proyectos-back.onrender.com/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(async (result) => {
        alert(result.message)
        const usuario = result.usuario;
        localStorage.setItem('usuario', JSON.stringify(usuario));
        if(result.redirect){
            window.location.href= result.redirect;
        }

      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        
      <div className="mb-8">
        <img src="src/assets/logo.png" alt="Logo" className="w-32 h-32" />
      </div>
      <form
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md"
        onSubmit={handdlelogin}
      >
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Correo
          </label>
          <Input
            type="email"
            fullWidth
            required
            placeholder="Ingresa tu correo"
            value={correo}
            onChange={(event) => setCorreo(event.target.value)}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <Input
            type="password"
            fullWidth
            required
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <Button type="submit" color="primary" fullWidth>
          Iniciar Sesión
        </Button>
      </form>
    </div>
  );
};

export default Login;
