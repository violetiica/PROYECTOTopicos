import {Router} from 'express';
import{
    postGeoReport,
    getAllGeoReports,
    getGeoReportById,
    updateGeoReport,
    deleteGeoReport,
    getCityInfo,
    getCachedCities
} from '../controller/GeoController.js';

const router = Router();

router.post('/reporte', postGeoReport);
router.get('/reportes', getAllGeoReports);
router.get('/reporte/:id', getGeoReportById);   //en los route donde hay :algo significa que despues de los dos puntos va eso que se pide, el id o el nombre de la ciudad
router.put('/reporte/:id', updateGeoReport);
router.delete('/reporte/:id', deleteGeoReport); 
router.get('/city/:city', getCityInfo);
router.get('/cities-cache', getCachedCities);

export default router;