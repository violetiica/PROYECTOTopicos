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
router.get('/transportes', getTransportes);
router.get('/transporte/:id', getTransporteporID);
router.put('/transporte/:id', updateTransporte);
router.delete('/transporte/:id', deleteTransporte);

export default router;