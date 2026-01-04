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

/**
 * @swagger
 * /transporte/transporte:
 *   post:
 *     summary: Crear un nuevo incidente de transporte
 *     description: Permite reportar incidencias en líneas de transporte urbano
 *     tags: [Transporte]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransporteIncident'
 *           example:
 *             line_id: "L1"
 *             line_name: "Línea Roja"
 *             line_status: "Retraso"
 *             line_severity: 3
 *     responses:
 *       201:
 *         description: Incidente creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Transporte creado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/TransporteIncident'
 *       500:
 *         description: Error del servidor
 */
router.post('/transporte', createTransporte);

/**
 * @swagger
 * /transporte/transportes:
 *   get:
 *     summary: Obtener todos los incidentes de transporte
 *     description: Devuelve una lista completa de todos los incidentes reportados por los ciudadanos
 *     tags: [Transporte]
 *     responses:
 *       200:
 *         description: Lista de incidentes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Transportes obtenidos exitosamente"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TransporteIncident'
 *       500:
 *         description: Error del servidor
 */
router.get('/transportes', getTransportes);

/**
 * @swagger
 * /transporte/transporte/{id}:
 *   get:
 *     summary: Obtener un incidente por ID
 *     description: Busca y devuelve un incidente específico usando su ID único
 *     tags: [Transporte]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del incidente (MongoDB ObjectId)
 *         example: "6959b37d2d550b153b1a24a6"
 *     responses:
 *       200:
 *         description: Incidente encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransporteIncident'
 *       404:
 *         description: Incidente no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/transporte/:id', getTransporteporID);

/**
 * @swagger
 * /transporte/transporte/{id}:
 *   put:
 *     summary: Actualizar un incidente de transporte
 *     description: Modifica los datos de un incidente existente
 *     tags: [Transporte]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del incidente a actualizar
 *         example: "6959b37d2d550b153b1a24a6"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransporteIncident'
 *           example:
 *             line_status: "Servicio normal"
 *     responses:
 *       200:
 *         description: Incidente actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Transporte actualizado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/TransporteIncident'
 *       404:
 *         description: Incidente no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/transporte/:id', updateTransporte);

/**
 * @swagger
 * /transporte/transporte/{id}:
 *   delete:
 *     summary: Eliminar un incidente de transporte
 *     description: Elimina permanentemente un incidente de la base de datos
 *     tags: [Transporte]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del incidente a eliminar
 *         example: "6959b37d2d550b153b1a24a6"
 *     responses:
 *       200:
 *         description: Incidente eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Transporte eliminado exitosamente"
 *       404:
 *         description: Incidente no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/transporte/:id', deleteTransporte);

/**
 * @swagger
 * /transporte/status:
 *   get:
 *     summary: Obtener estado de todas las líneas de transporte de Londres
 *     description: Consulta el estado en tiempo real de todas las líneas de metro, DLR y Overground de Londres usando la API de Transport for London (TfL). Los resultados se guardan en caché.
 *     tags: [Transport APIs]
 *     responses:
 *       200:
 *         description: Estado obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Estado de transporte obtenido exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     ciudad:
 *                       type: string
 *                       example: "London"
 *                     totalLineas:
 *                       type: number
 *                       example: 15
 *                     lineas:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           lineId:
 *                             type: string
 *                             example: "central"
 *                           lineName:
 *                             type: string
 *                             example: "Central"
 *                           modeOfTransport:
 *                             type: string
 *                             example: "tube"
 *                           status:
 *                             type: string
 *                             example: "Good Service"
 *                           severity:
 *                             type: number
 *                             example: 10
 *                           reason:
 *                             type: string
 *                             example: "No issues reported"
 *                     fuente:
 *                       type: string
 *                       example: "TfL API (actualizado)"
 *                     ultimaActualizacion:
 *                       type: string
 *                       format: date-time
 *       500:
 *         description: Error al consultar la API de TfL
 */
router.get('/status', getTransportStatus);

/**
 * @swagger
 * /transporte/line/{lineId}:
 *   get:
 *     summary: Obtener información de una línea específica de transporte
 *     description: Consulta información detallada de una línea de transporte de Londres por su ID. Los datos se guardan en caché para consultas futuras.
 *     tags: [Transport APIs]
 *     parameters:
 *       - in: path
 *         name: lineId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la línea de transporte (central, northern, piccadilly, etc.)
 *         example: "central"
 *     responses:
 *       200:
 *         description: Información de línea obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Información de línea obtenida exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     lineId:
 *                       type: string
 *                       example: "central"
 *                     lineName:
 *                       type: string
 *                       example: "Central"
 *                     modeOfTransport:
 *                       type: string
 *                       example: "tube"
 *                     status:
 *                       type: string
 *                       example: "Good Service"
 *                     severity:
 *                       type: number
 *                       example: 10
 *                     reason:
 *                       type: string
 *                       example: "No issues reported"
 *                     fuente:
 *                       type: string
 *                       example: "Caché local"
 *                     ultimaActualizacion:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Línea no encontrada
 *       500:
 *         description: Error al consultar la API de TfL
 */
router.get('/line/:lineId', getLineInfo);

export default router;