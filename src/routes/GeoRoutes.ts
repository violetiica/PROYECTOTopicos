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

/**
 * @swagger
 * /geo/reporte:
 *   post:
 *     summary: Crear un nuevo reporte geográfico
 *     description: Permite a los ciudadanos reportar incidencias urbanas con ubicación geográfica
 *     tags: [Geo Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GeoReport'
 *           example:
 *             ciudad: "Caracas"
 *             descripcion: "Bache grande en la avenida principal"
 *             tipoIncidencia: "Infraestructura"
 *             coordenadas:
 *               lat: 10.4806
 *               lng: -66.9036
 *     responses:
 *       201:
 *         description: Reporte creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Se creo el reporte con exito"
 *                 reporte:
 *                   $ref: '#/components/schemas/GeoReport'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/reporte', postGeoReport);

/**
 * @swagger
 * /geo/reportes:
 *   get:
 *     summary: Obtener todos los reportes geográficos
 *     description: Devuelve una lista completa de todos los reportes ciudadanos ordenados por fecha
 *     tags: [Geo Reports]
 *     responses:
 *       200:
 *         description: Lista de reportes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Los reportes se han obtenido con exito"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GeoReport'
 *       500:
 *         description: Error del servidor
 */
router.get('/reportes', getAllGeoReports);

/**
 * @swagger
 * /geo/reporte/{id}:
 *   get:
 *     summary: Obtener un reporte por ID
 *     description: Busca y devuelve un reporte específico usando su ID único
 *     tags: [Geo Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del reporte (MongoDB ObjectId)
 *         example: "6959b37d2d550b153b1a24a6"
 *     responses:
 *       200:
 *         description: Reporte encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeoReport'
 *       404:
 *         description: Reporte no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Reporte no encontrado"
 *       500:
 *         description: Error del servidor
 */
router.get('/reporte/:id', getGeoReportById);

/**
 * @swagger
 * /geo/reporte/{id}:
 *   put:
 *     summary: Actualizar un reporte geográfico
 *     description: Modifica los datos de un reporte existente
 *     tags: [Geo Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del reporte a actualizar
 *         example: "6959b37d2d550b153b1a24a6"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GeoReport'
 *           example:
 *             descripcion: "Bache reparado parcialmente"
 *     responses:
 *       200:
 *         description: Reporte actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Reporte actualizado"
 *                 reporte:
 *                   $ref: '#/components/schemas/GeoReport'
 *       404:
 *         description: Reporte no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/reporte/:id', updateGeoReport);

/**
 * @swagger
 * /geo/reporte/{id}:
 *   delete:
 *     summary: Eliminar un reporte geográfico
 *     description: Elimina permanentemente un reporte de la base de datos
 *     tags: [Geo Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del reporte a eliminar
 *         example: "6959b37d2d550b153b1a24a6"
 *     responses:
 *       200:
 *         description: Reporte eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Se ha eliminado el reporte"
 *       404:
 *         description: Reporte no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/reporte/:id', deleteGeoReport);

/**
 * @swagger
 * /geo/city/{city}:
 *   get:
 *     summary: Buscar información de una ciudad (GeoNames API)
 *     description: Consulta información geográfica de cualquier ciudad del mundo usando GeoNames API. Los resultados se guardan en caché para consultas futuras.
 *     tags: [Geo APIs]
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de la ciudad a buscar
 *         example: "Tokyo"
 *     responses:
 *       200:
 *         description: Ciudad encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Ciudad encontrada exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     ciudad:
 *                       type: string
 *                       example: "Tokyo"
 *                     pais:
 *                       type: string
 *                       example: "Japan"
 *                     estado:
 *                       type: string
 *                       example: "Tokyo"
 *                     coordenadas:
 *                       type: object
 *                       properties:
 *                         lat:
 *                           type: number
 *                           example: 35.6895
 *                         lng:
 *                           type: number
 *                           example: 139.69171
 *                     poblacion:
 *                       type: number
 *                       example: 9733276
 *                     fuente:
 *                       type: string
 *                       example: "GeoNames API (nuevo)"
 *                     ultimaActualizacion:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Ciudad no encontrada
 *       500:
 *         description: Error al consultar la API de GeoNames
 */
router.get('/city/:city', getCityInfo);

/**
 * @swagger
 * /geo/cities-cache:
 *   get:
 *     summary: Ver todas las ciudades guardadas en caché
 *     description: Devuelve la lista completa de ciudades que han sido consultadas previamente y están almacenadas en la base de datos
 *     tags: [Geo APIs]
 *     responses:
 *       200:
 *         description: Lista de ciudades en caché obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Ciudades en caché obtenidas exitosamente"
 *                 total:
 *                   type: number
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       nombreBusqueda:
 *                         type: string
 *                       ciudad:
 *                         type: string
 *                       pais:
 *                         type: string
 *                       coordenadas:
 *                         type: object
 *                       poblacion:
 *                         type: number
 *       500:
 *         description: Error del servidor
 */
router.get('/cities-cache', getCachedCities);

export default router;