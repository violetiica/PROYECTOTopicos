import { Request, Response } from 'express';
import { Transporte } from '../models/transporteincidents.js';
import { 
    obtenerEstadoLineas, 
    obtenerInfoLinea 
} from '../services/TransporteLondonAPI.js';

// Obtener todos los transportes
export const getTransportes = async (req: Request, res: Response) => {
    try {
        const transportes = await Transporte.find();
        
        return res.status(200).json({
            mensaje: 'Transportes obtenidos exitosamente',
            data: transportes
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error del servidor' });
    }
}

// Obtener transporte por ID
export const getTransporteporID = async (req: Request, res: Response) => {
    try {
        const transporte = await Transporte.findById(req.params.id);
        
        if(!transporte) {
            return res.status(404).json({message: "Transporte no encontrado"});
        }
        
        return res.status(200).json(transporte);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error del servidor' });
    }
}

// Crear transporte
export const createTransporte = async (req: Request, res: Response) => {
    try {
        const { line_id, line_name, line_status, line_severity } = req.body;
        
        const nuevoTransporte = new Transporte({
            line_id,
            line_name,
            line_status,
            line_severity
        });
        
        const TransporteGuardado = await nuevoTransporte.save();
        
        return res.status(201).json({
            mensaje: 'Transporte creado exitosamente',
            data: TransporteGuardado
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error del servidor' });
    }
}

// Actualizar transporte
export const updateTransporte = async (req: Request, res: Response) => {
    try {
        const transporte = await Transporte.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        
        if(!transporte) {
            return res.status(404).json({message: "Transporte no encontrado"});
        }
        
        return res.status(200).json({
            mensaje: 'Transporte actualizado exitosamente',
            data: transporte
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error del servidor' });
    }
}

// Eliminar transporte
export const deleteTransporte = async(req: Request, res: Response) => {
    try {
        const transporte = await Transporte.findByIdAndDelete(req.params.id);
        
        if(!transporte) {
            return res.status(404).json({message: "Transporte no encontrado"});
        }
        
        return res.status(200).json({
            mensaje: 'Transporte eliminado exitosamente'
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error del servidor' });
    }
}


// Obtener estado de todas las líneas de la API
export const getTransportStatus = async (req: Request, res: Response) => {
    try {
        const resultado = await obtenerEstadoLineas();

        if ('mensaje' in resultado) {
            if (resultado.mensaje && resultado.mensaje.includes('Error')) {
                return res.status(500).json(resultado);
            }
            return res.status(404).json(resultado);
        }

        return res.status(200).json({
            mensaje: 'Estado de transporte obtenido exitosamente',
            data: resultado
        });

    } catch (error: any) {
        return res.status(500).json({
            mensaje: 'Error al obtener estado de transporte',
            error: error.message
        });
    }
};


// Obtener información de una línea 
export const getLineInfo = async (req: Request, res: Response) => {
    try {
        const { lineId } = req.params;

        if (!lineId) {
            return res.status(400).json({
                mensaje: 'El parámetro lineId es requerido'
            });
        }

        const resultado = await obtenerInfoLinea(lineId);

        if ('mensaje' in resultado) {
            if (resultado.mensaje && resultado.mensaje.includes('Error')) {
                return res.status(500).json(resultado);
            }
            return res.status(404).json(resultado);
        }

        return res.status(200).json({
            mensaje: 'Información de línea obtenida exitosamente',
            data: resultado
        });

    } catch (error: any) {
        return res.status(500).json({
            mensaje: 'Error al obtener información de línea',
            error: error.message
        });
    }
};