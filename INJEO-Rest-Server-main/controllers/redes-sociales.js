const {response, request} = require('express');

const { RedSocial, RedInstructor, RedParticipante}= require('../models/index');

/**
 *  Obtener Todas Las Redes Sociales
 */
 const obtenerRedesSociales = async(req, res= response)=>{ 
    const {limite=5, desde=0, estado=true} = req.query;
    const query={estado};

    const [total, redes] = await Promise.all([
        RedSocial.countDocuments(query),
        RedSocial.find(query)
                        // .populate('usuario_id',['user_name'])
        .sort({fecha_registro:-1})

                        .populate('usuario_id',{password:0, __v:0})
                        
                        .skip(Number( desde ) )
                         .limit(Number( limite) )
    ]);


    res.json({
        total,
        redes
    });    
    }

/**
 *  Obtener Una Red Social
 */
const obtenerRedSocial = async(req, res= response)=>{
    const {id}= req.params;
    const red = await RedSocial.findById(id)
    .populate('usuario_id',{password:0, __v:0})

                                        // .populate('usuario_id',['user_name']);
 res.json(red);    
}

/** 
 *  Crear Una Red Social
 */
const crearRedSocial = async(req, res= response)=>{

    const fecha_registro = Date.now();  
    const {red }= req.body;   

    const redDB = await RedSocial.findOne({red:red.toUpperCase(), estado:true});
    if (redDB) {
        return res.status(401).json({
            msg: ` ${red.toUpperCase()}, ya existe - No puede hacer esto`
        }); 
    } 
    const data = {
 
        red:red.toUpperCase(),
        usuario_id: req.usuario._id,
        fecha_registro
    }
    
               const redSocial = new RedSocial(data);
               await redSocial.save();      
res.status(201).json(redSocial);
}

/**
 *  Actualizar Una Red Social
 */
const actualizarRedSocial = async(req= request, res= response)=>{
  
const {id }= req.params;   
const {red }= req.body;

const redSocialDB = await  RedSocial.findById(id);

let permiso = true;
(redSocialDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}
const redDB = await  RedSocial.findOne({red:red.toUpperCase(), estado: true });

if (redDB && redDB._id!=id) {
    return res.status(401).json({
        msg: ` ${red.toUpperCase()}, ya existe - No puede hacer esto`
    }); 
} 


const data = {
    red:red.toUpperCase(),

}

   const redSocial = await RedSocial.findByIdAndUpdate(id,data, {new:true});
res.json(redSocial);    
}

/**
 *  Eliminar Una RedSocial
 */
const eliminarRedSocial = async(req= request, res= response)=>{
    const fecha_eliminacion = Date.now();

const {id} = req.params;
const redSocialDB = await  RedSocial.findById(id);
let permiso = true;
(redSocialDB.usuario_id.equals(req.usuario._id) || req.usuario.rol==='ADMIN_ROLE' ) ? permiso = true :permiso=false; 

if (!permiso ) {    
    return res.status(401).json({
        msg: `EL id ${req.usuario.id} No cuenta con los permisos necesarios - No puede hacer esto`
    }); 
}

// const redSocial = await RedSocial.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true});
const [redSocial, redInstructor, redParticipante]= await Promise.all([
/**
 * 
 */
    RedSocial.findByIdAndUpdate(id,{estado:false, fecha_eliminacion},{new:true}),
/**
 * 
 */     
     RedInstructor.find({red_id:id, estado:true
    }).then( (rI)=>{
        if (rI.length>0) {
            rI.forEach( async (i)=>{
                await RedInstructor.findByIdAndUpdate( i._id,{estado:false, fecha_eliminacion},{new:true})
            })
        }
     }),
/**
 * 
 */
     RedParticipante.find({red_id:id, estado:true
     }).then( (rP)=>{
         if (rP.length>0) {
             rP.forEach( async (i)=>{
                 await RedParticipante.findByIdAndUpdate( i._id,{estado:false, fecha_eliminacion},{new:true})
             })
         }
      }),
      

]);


   res.json(redSocial);    
}




module.exports={
             obtenerRedesSociales,
             obtenerRedSocial,
             crearRedSocial,
             actualizarRedSocial,
            eliminarRedSocial,
}



