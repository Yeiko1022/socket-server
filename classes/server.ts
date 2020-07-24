
import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io';
import http from 'http'; //compatible con express

import * as socket from '../sockets/socket'



export default class Server 
{

    private static _instance: Server;

    public app: express.Application; //servidor express
    public port: number;

    public io: socketIO.Server; //Configuración de la conexión de los sockets, encargado de emitir los eventos
    private httpServer: http.Server;


    private constructor() 
    { //patron singleton

        this.app = express();
        this.port = SERVER_PORT;

        //socket.io necesita reibir config del servidor (express)
        //socket y express no trabajan de la mano, se usa http

        this.httpServer = new http.Server(this.app); //intermediario
        this.io = socketIO( this.httpServer );

        this.escucharSockets();
    }

    public static get instance()
    {
        return this._instance || (this._instance = new this()); //Si ya existe una instancia regrese esa instancia, si no existe crea una instancia del servidor 
    }//algo que se llama directamente llamando a la clase

    private escucharSockets(){
        console.log('Escuchando conexiones - sockets');

        this.io.on('connection', cliente => {
            console.log('Cliente conectado');
        
        
            socket.mensaje( cliente, this.io);
            //Desconectar
            socket.desconectar( cliente ); //coleccion de metodos del lado del server
        });//escuchar evento


    }//es private porque solo se llama desde la inicialización de la clase

    //Metodo para levantar el servidor
    start ( callback: VoidFunction ) { 
        this.httpServer.listen( this.port,  callback  );
    }

}