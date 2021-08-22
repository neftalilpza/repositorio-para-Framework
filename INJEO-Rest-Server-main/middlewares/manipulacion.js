const { response } = require('express')


const manipulacionValida = ( req, res = response, next ) => {

    /*     console.log(req.usuario);
        console.log(req.params);
    console.log(req.usuario._id);
    console.log(req.params.id); */
    
    
    // (req.usuario._id===req.params.id)?console.log('iguales'):console.log('diferentes');
    
    if ( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        });
    }
    const { rol,} = req.usuario;
    

let permiso =false;
((req.usuario._id.equals(req.params.id)) ||  (rol === 'ADMIN_ROLE'))?permiso=true: permiso=false;

if (!permiso) {
    return res.status(401).json({
        msg: `El id: '${req.usuario._id}'No cuenta con los permisos necesarios - No puede hacer esto`
    });
}

/*     if ((req.usuario._id!==req.params.id) ||  (rol !== 'ADMIN_ROLE')) {
        // console.log('iguales');
        return res.status(401).json({
            msg: `El id: '${req.usuario._id}'No cuenta con los permisos necesarios - No puede hacer esto`
        });
    }  */
    
    
    
        next();
    }


    const manipulacionPersonaExterno = ( req, res = response, next ) => {

    /*     console.log(req.usuario);
        console.log(req.params);
    console.log(req.usuario._id);
    console.log(req.params.id); */
    
    
    // (req.usuario._id===req.params.id)?console.log('iguales'):console.log('diferentes');
    
    if ( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        });
    }
    const { rol} = req.usuario;
    
    if (req.usuario._id!==req.params.usuario_id ||  rol !== 'ADMIN_ROLE') {
        // console.log('iguales');
        return res.status(401).json({
            msg: `No cuenta con los permisos necesarios - No puede hacer esto`
        });
    } 
    
    
    
        next();
    }
    



    module.exports = {
        manipulacionValida,
        manipulacionPersonaExterno,
     
     
    }