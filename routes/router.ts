import { Router, Request, Response } from 'express';
import Server from '../classes/server';
import { usuariosConectados } from '../sockets/socket';

const router = Router(); //Se usa para los Api Enpoint - Servicios res

router.get('/mensajes', (req: Request, res: Response) => {
    res.json({
        ok: true,
        mensaje: 'Todo esta bien!!',
    });
});

router.post('/mensajes', (req: Request, res: Response) => {
    const server = Server.instance;

    const payload = {
        de: req.body.de,
        cuerpo: req.body.cuerpo,
    };
    server.io.emit('mensaje-nuevo', payload);
    res.json({
        ok: true,
        mensaje: 'POST: Todo esta bien!!',
    });
});

router.post('/mensajes/:id', (req: Request, res: Response) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const id = req.params.id;

    const payload = {
        de,
        cuerpo,
    };

    const server = Server.instance;
    server.io.in(id).emit('mensaje-privado', payload);

    res.json({
        ok: true,
        cuerpo,
        de,
        id,
    });
});

//servicio para obtener todos los IDs de los usuarios
router.get('/usuarios', (req: Request, res: Response) => {
    const server = Server.instance;

    server.io.clients((err: any, clientes: string[]) => {
        if (err) {
            res.json({
                ESTADO: false,
                MENSAJE: err,
                RESULTADO: '',
            });
        }

        res.json({
            ESTADO: true,
            MENSAJE: '',
            RESULTADO: clientes,
        });
    });
});

router.get('/usuarios/detalle', (req: Request, res: Response) => {
    res.json({
        ESTADO: true,
        MENSAJE: '',
        RESULTADO: usuariosConectados.getLista(),
    });
});

//Obtener usuarios y sus nombres

export default router;
