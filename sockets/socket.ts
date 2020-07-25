import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';

export const usuariosConectados = new UsuariosLista();

export const conectarCliente = (cliente: Socket, io: socketIO.Server) => {
    const usuario = new Usuario(cliente.id);
    usuariosConectados.agregarUsuario(usuario);

    
};

export const desconectar = (cliente: Socket, io:socketIO.Server) => {
    cliente.on('disconnect', () => {
        // console.log('Cliente desconectado');
        usuariosConectados.borrarUsuario(cliente.id);

        io.emit('usuarios-activos', usuariosConectados.getLista())

    });
};

// escuchar mensajes
export const mensaje = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('mensaje', (payload: { de: string; cuerpo: string }) => {
        console.log('Mensaje recibido', payload);

        io.emit('mensaje-nuevo', payload);
    });
};

//Configurar usuario
export const configurarUsuario = (cliente: Socket, io: socketIO.Server) => {
    cliente.on(
        'configurar-usuario',
        (payload: { nombre: string }, callback: Function) => {
            usuariosConectados.actualizarNombre(cliente.id, payload.nombre);
            io.emit('usuarios-activos', usuariosConectados.getLista());
            callback({
                ESTADO: true,
                MENSAJE: `Usuario ${payload.nombre}, configurado`,
                RESULTADO: '',
            });


        
        }
    );
};

//Obtener Usuarios
export const obtenerUsuarios = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('obtener-usuarios', () => {
        io.emit('usuarios-activos', usuariosConectados.getLista());
    });
};
