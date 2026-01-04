import {Router} from 'express';
import{
    createTransporte,
    getTransportes,
    getTransporteporID,
    updateTransporte,
    deleteTransporte,
    getTransportStatus,
    getLineInfo
} from '../controller/TransportesController.js';

const router = Router();

router.post('/transporte', createTransporte);
router.get('/transportes', getTransportes);
router.get('/transporte/:id', getTransporteporID);
router.put('/transporte/:id', updateTransporte);
router.delete('/transporte/:id', deleteTransporte);
router.get('/status', getTransportStatus);
router.get('/line/:lineId', getLineInfo);

export default router;