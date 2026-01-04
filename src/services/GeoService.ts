import { GeoReport } from '../models/GeoReport.js';

//Crear un reporte
export const crearReporteGeo = async (datosReporte: {
    ciudad: string;
    descripcion: string 
    tipoIncidencia: string;
    coordenadas:{
        lat: number;
        lng: number;
    };
}) => {

    try {
        const nuevoReporte = await GeoReport.create(datosReporte); //para crear el nuevo reporte
        return nuevoReporte;  // ← Devuelve solo el reporte, sin envolver

   } catch (error: any) {   //capturar errores
    return {
        mensaje: 'Error al crear el reporte', 
    };
   }
};


//Obtener todos los reportes
export const obtenerTodosReporteGeo = async () => {
    try {
        const reportes = await GeoReport.find().sort({ fecha: -1 });  //ordenados por fecha 
        return reportes;    //devuelve un array :)
    } catch (error: any) {
        return {
            mensaje: 'Error al obtener los reportes',
        };
    }
};


//Obtener reportes por id 
export const obtenerReporteGeoPorID = async (id: string) => {
    try {
        const reporte = await GeoReport.findById(id); 

        if (!reporte) {
            return {
                mensaje: 'Reporte no encontrado',
            };
        }
 
        return reporte;

    } catch (error: any) {
        return {
            mensaje: 'Error al obtener el reporte',
        };
    }
};


//Actualizar reportes 
export const actualizarReporteGeo = async (id: string, datosActualizados: any) => {
    try {
        const reporteActualizado = await GeoReport.findByIdAndUpdate(
            id, 
            datosActualizados, 
            { new: true, runValidators: true }  
        );

        if (!reporteActualizado) {
            return {
                mensaje: 'Reporte no encontrado',
            };
        }

        return reporteActualizado;

    } catch (error: any) {
        return {
            mensaje: 'Error al actualizar el reporte',
        };
    }
};


//Eliminar reportes 
export const eliminarReporteGeo = async (id: string) => {
    try{
        const reporteEliminado = await GeoReport.findByIdAndDelete(id);

        if (!reporteEliminado){
            return{
                mensaje: 'Reporte no encontrado',
            };
        }

        return{
            mensaje: 'Reporte eliminado', 
        }

        }catch(error: any){
            return{
                mensaje: 'Error al eliminar el reporte',
            };
   
        }

};
