import { Request, Response } from 'express';
import { Transporte } from '../models/transporteincidents.js';

// Para obtener todos los transportes (opcionalmente filtrar por line_id en query)
export const getTransportes = async (req: Request, res: Response) => {
    try {
        const transportes = await Transporte.find({
            line_id: req.query.id,
        }).populate('line_id');
        return transportes;
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error del servidor' });
    }
}

// Para obtener mediante el id
export const getTransporteporID = async (req: Request, res: Response) => {
    try {
        const transporte = await Transporte.findById(req.params.id);
        if(!transporte) return res.status(404).json({message: "Transporte no encontrado"}) 
        return transporte;
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error del servidor' });
    }
}

// Para crear 
export const createTransporte = async (req: Request, res: Response) => {
    try {
        const { line_id, line_name, line_status, line_severity } = req.body;
        const nuevoTransporte = new Transporte({
            line_id: req.query.id, line_name, line_status, line_severity
        });
        const TransporteGuardado = await nuevoTransporte.save();
        return TransporteGuardado;
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error del servidor' });
    }
}

// Para actualizar
export const updateTransporte = async (req: Request, res: Response) => {
    try {
        const transporte = await Transporte.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if(!transporte) return res.status(404).json({message: "Transporte no encontrado"})
        return transporte;
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error del servidor' });
    }
}

// Para eliminar
export const deleteTransporte = async(req: Request, res: Response) => {
    try {
        const transporte = await Transporte.findByIdAndDelete(req.params.id)
        if(!transporte) return res.status(404).json({message: "Transporte no encontrado"})
        return res.sendStatus(204);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error del servidor' });
    }
}


