import {Request, Response } from "express";

import {
    crearReporteGeo,
    obtenerTodosReporteGeo,
    obtenerReporteGeoPorID,
    actualizarReporteGeo,
    eliminarReporteGeo
} from "../services/GeoService.js";


//Crear reporte 
export const postGeoReport = async (req: Request, res: Response) => {
    try {
        const { ciudad, descripcion, tipoIncidencia, coordenadas } = req.body;
        const nuevoReporte: any = await crearReporteGeo({ ciudad, descripcion, tipoIncidencia, coordenadas });
        
        if (nuevoReporte && 'mensaje' in nuevoReporte) {
            return res.status(500).json(nuevoReporte);
        }
        
        return res.status(201).json({        //el estatus lo que hace es evitar que se ejecute el codigo despues de enviar la respuesta
            mensaje: 'Se creo el reporte con exito',
            reporte: nuevoReporte
        });  
        
    } catch (error: any) {
        return res.status(500).json({ 
            mensaje: 'Error al crear el reporte',
        });
    }
};


//Obtener todos los reportes
export const getAllGeoReports = async (req: Request, res: Response) => {
    try {
        const reportes = await obtenerTodosReporteGeo();
        
        if (Array.isArray(reportes)) {
            return res.status(200).json({
                mensaje: 'Los reportes se han obtenido con exito',
                data: reportes  //es para que se vea la informacion del reporte 
            });
        } else {
            return res.status(500).json(reportes); 
        }

    } catch (error: any) {        
        return res.status(500).json({ 
            mensaje: 'Error al mostrar todos los reportes',
        });
    }
};


//Obtener reportes por id 
export const getGeoReportById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const reporte: any = await obtenerReporteGeoPorID(id);

        if (reporte && !('mensaje' in reporte)) {
            return res.status(200).json(reporte);
        } else {  
            return res.status(404).json({
                mensaje: 'Reporte no encontrado'
            });
        }

    } catch (error: any) {
        return res.status(500).json({
            mensaje: 'Error al obtener el reporte'
        });
    }
};


//Actualizar reportes 
export const updateGeoReport =  async (req: Request, res: Response) => {
    try{
        const {id} = req.params;
        const datosActualizados = req.body;
        const reporteActualizado = await actualizarReporteGeo (id, datosActualizados);

        if(reporteActualizado && !('mensaje' in reporteActualizado)){  //cuando en el service no hay mensaje entra a este if, porque es ahi cuando se actualiza 
            return res.status(200).json({
                mensaje: 'Reporte actualizado',
                reporte: reporteActualizado
            });
        }else{
            return res.status(404).json({
                mensaje:'No se encontro el reporte'
            });
        }
    }catch(error: any){
        return res.status(500).json({
            mensaje:'No se ha podido actualizar el reporte'
        })
    }
};


//Eliminar reportes
export const deleteGeoReport = async (req: Request, res: Response) => {
    try{
        const {id} = req.params;
        const reporteEliminado: any = await eliminarReporteGeo(id);

        if(reporteEliminado.mensaje === 'Reporte eliminado'){  // ← CAMBIO AQUÍ
            return res.status(200).json({
                mensaje: 'Se ha eliminado el reporte'
            });
        }else{
            return res.status(404).json({
                mensaje: 'No encontro el reporte'
            });
        }
    }catch (error: any){
        return res.status(500).json({
            mensaje: 'No se pudo eliminar el reporte'
        })
    }
};
