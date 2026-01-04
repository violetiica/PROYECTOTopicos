import axios from 'axios';
import { TransportCache } from '../models/Transporte.js';

const TFL_BASE_URL = 'https://api.tfl.gov.uk';

interface LineStatus {
    id: string;
    name: string;
    modeName: string;
    lineStatuses: {
        statusSeverity: number;
        statusSeverityDescription: string;
        reason?: string;
    }[];
}

export const obtenerEstadoLineas = async () => {
    try {
        const lineasEnCache = await TransportCache.find();

        if (lineasEnCache && lineasEnCache.length > 0) {
            console.log(`Líneas de transporte encontradas en caché (${lineasEnCache.length})`);
            
            const lineas = lineasEnCache.map(linea => ({
                lineId: linea.lineId,
                lineName: linea.lineName,
                modeOfTransport: linea.modeOfTransport,
                status: linea.status,
                severity: linea.severity,
                reason: linea.reason
            }));

            return {
                ciudad: 'London',
                totalLineas: lineas.length,
                lineas: lineas,
                fuente: 'Caché local',
                ultimaActualizacion: lineasEnCache[0].ultimaActualizacion
            };
        }

        console.log(`Consultando TfL API...`);
        const url = `${TFL_BASE_URL}/Line/Mode/tube,dlr,overground/Status`;
        const response = await axios.get<LineStatus[]>(url);

        if (response.data && response.data.length > 0) {
            const lineas = response.data.map(linea => ({
                lineId: linea.id,
                lineName: linea.name,
                modeOfTransport: linea.modeName,
                status: linea.lineStatuses[0]?.statusSeverityDescription || 'Unknown',
                severity: linea.lineStatuses[0]?.statusSeverity || 0,
                reason: linea.lineStatuses[0]?.reason || 'No issues reported'
            }));

            try {
                for (const linea of lineas) {
                    await TransportCache.findOneAndUpdate(
                        { lineId: linea.lineId },
                        { ...linea, ultimaActualizacion: new Date() },
                        { upsert: true, new: true }
                    );
                }
                console.log(`${lineas.length} líneas guardadas en caché`);
            } catch (cacheError: any) {
                console.error('Error al guardar en caché:', cacheError.message);
            }

            return {
                ciudad: 'London',
                totalLineas: lineas.length,
                lineas: lineas,
                fuente: 'TfL API (actualizado)',
                ultimaActualizacion: new Date()
            };
        } else {
            return {
                mensaje: 'No se encontraron datos de transporte'
            };
        }

    } catch (error: any) {
        console.error('Error al consultar TfL API:', error.message);
        return {
            mensaje: 'Error al consultar la API de TfL',
            error: error.message
        };
    }
};

export const obtenerInfoLinea = async (lineId: string) => {
    try {
        const lineIdLower = lineId.toLowerCase();

        const lineaEnCache = await TransportCache.findOne({ lineId: lineIdLower });

        if (lineaEnCache) {
            console.log(`Línea "${lineId}" encontrada en caché`);
            return {
                lineId: lineaEnCache.lineId,
                lineName: lineaEnCache.lineName,
                modeOfTransport: lineaEnCache.modeOfTransport,
                status: lineaEnCache.status,
                severity: lineaEnCache.severity,
                reason: lineaEnCache.reason,
                fuente: 'Caché local',
                ultimaActualizacion: lineaEnCache.ultimaActualizacion
            };
        }

        console.log(`Línea "${lineId}" no está en caché, consultando TfL...`);
        const url = `${TFL_BASE_URL}/Line/${lineId}`;
        const response = await axios.get(url);

        if (response.data) {
            const linea = Array.isArray(response.data) ? response.data[0] : response.data;

            try {
                await TransportCache.create({
                    lineId: linea.id.toLowerCase(),
                    lineName: linea.name,
                    modeOfTransport: linea.modeName,
                    status: 'Unknown',
                    severity: 0,
                    reason: 'Información básica'
                });
                console.log(`Línea "${lineId}" guardada en caché`);
            } catch (cacheError: any) {
                console.error('Error al guardar en caché:', cacheError.message);
            }

            return {
                lineId: linea.id,
                lineName: linea.name,
                modeOfTransport: linea.modeName,
                fuente: 'TfL API (nuevo)',
                ultimaActualizacion: new Date()
            };
        } else {
            return {
                mensaje: `No se encontró información para la línea: ${lineId}`
            };
        }

    } catch (error: any) {
        console.error('Error al consultar línea específica:', error.message);
        return {
            mensaje: 'Error al consultar la API de TfL',
            error: error.message
        };
    }
};

