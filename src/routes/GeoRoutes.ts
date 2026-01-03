import {Router} from 'express';
import{
    postGeoReport,
    getAllGeoReports,
    getGeoReportById,
    updateGeoReport,
    deleteGeoReport
} from '../controller/GeoController.js';

const router = Router();

router.post('/reporte', postGeoReport);
router.get('/reportes', getAllGeoReports);
router.get('/reporte/:id', getGeoReportById);
router.put('/reporte/:id', updateGeoReport);
router.delete('/reporte/:id', deleteGeoReport); 

export default router;