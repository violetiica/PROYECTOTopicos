import {Router} from 'express';
import{
    createTransporte,
    getTransportes,
    getTransporteporID,
    updateTransporte,
    deleteTransporte
} from '../controller/TransportesController.js';

const router = Router();

router.post('/transporte', createTransporte);
router.get('/transportes', getTransporteporID);
router.get('/transporte', getTransporteporID);
router.put('/transporte', updateTransporte);
router.delete('/transporte', deleteTransporte);

export default router;