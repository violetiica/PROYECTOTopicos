import { Transporte } from '../models/transporteincidents.js';

// Para obtener todos los transportes (opcionalmente filtrar por line_id en query)
export const getTransportes = async () => {
    try {
        const transportes = await Transporte.find();
        return transportes;
    } catch (error: any) {
        return {
            mensaje: 'Error al obtener los transportes',
        };
    }
};

// Para obtener mediante el id
export const getTransporteporID = async (id: string) => {
    try {
        const transporte = await Transporte.findById(id);
        if(!transporte) { 
            return{
                mensaje: 'Transporte no encontrado',
            };  
        }
    } catch (error: any) {
        return {
            mensaje: 'Error al obtener el transporte',
        };
    }
};

// Para crear 
export const createTransporte = async (datosTransporte: {
    line_id: string, 
    line_name: string, 
    line_status: string, 
    line_severity: number
}) => {
    try {
        const nuevoTransporte = await Transporte.create(datosTransporte);
    return{
        mensaje: 'Transporte creado con exito',
        transporte: nuevoTransporte
    };

    } catch (error: any) {
        return {
            mensaje: 'Error al crear el transporte',
        };
    }
};

// Para actualizar
export const updateTransporte = async (id: string, datosModificados: any) => {
    try {
        const transporteModificado = await Transporte.findByIdAndUpdate(id, datosModificados, { new: true });
        if(!transporteModificado) {
            return {
                mensaje: "Transporte no encontrado"
            }
        }
        return transporteModificado;

    } catch (error: any) {
        return{
            mensaje: 'Error del servidor',
        };
    }
};

// Para eliminar
export const deleteTransporte = async(id: string) => {
    try {
        const transporteEliminado = await Transporte.findByIdAndDelete(id);
        if(!transporteEliminado) {
            return {
                mensaje: 'Transporte no encontrado',
            };
        }

        return {
            mensaje: 'Transporte eliminado con exito',
        }
    } catch (error: any) {
        return{
            mensaje: 'Error al eliminar el reporte',
        };
    }
};


