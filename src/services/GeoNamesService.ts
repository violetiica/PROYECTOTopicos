import axios from 'axios';
import { CityCache } from '../models/City.js';

interface GeoNamesCity {
    name: string;
    lat: string;
    lng: string;
    countryName: string;
    population: number;
    adminName1?: string;
}

interface GeoNamesResponse {
    geonames: GeoNamesCity[];
}

export const buscarCiudad = async (nombreCiudad: string) => {
    try {
        const nombreBusqueda = nombreCiudad.toLowerCase().trim();

        // Busca en la bd
        const ciudadEnCache = await CityCache.findOne({ nombreBusqueda });

        if (ciudadEnCache) {
            console.log(`Ciudad "${nombreCiudad}" encontrada en caché`);
            return {
                ciudad: ciudadEnCache.ciudad,
                pais: ciudadEnCache.pais,
                estado: ciudadEnCache.estado,
                coordenadas: {
                    lat: ciudadEnCache.coordenadas.lat,
                    lng: ciudadEnCache.coordenadas.lng
                },
                poblacion: ciudadEnCache.poblacion,
                fuente: 'Caché local',
                ultimaActualizacion: ciudadEnCache.ultimaActualizacion
            };
        }

        // si no esta en la bd, lo busca en API
        console.log(`Ciudad "${nombreCiudad}" no está en caché, consultando GeoNames...`);

        const username = process.env.GEONAMES_USERNAME;

        if (!username) {
            return {
                mensaje: 'Error: GEONAMES_USERNAME no está configurado en .env'
            };
        }

        const url = `http://api.geonames.org/searchJSON`;

        const params = {
            name: nombreCiudad,
            maxRows: 1,
            username: username,
            featureClass: 'P',
            style: 'FULL'
        };

        const response = await axios.get<GeoNamesResponse>(url, { params });

        if (response.data.geonames && response.data.geonames.length > 0) {
            const ciudad = response.data.geonames[0];

            const datosRespuesta = {
                ciudad: ciudad.name,
                pais: ciudad.countryName,
                estado: ciudad.adminName1 || 'N/A',
                coordenadas: {
                    lat: parseFloat(ciudad.lat),
                    lng: parseFloat(ciudad.lng)
                },
                poblacion: ciudad.population || 0
            };

            // Guarda en la bd, lo que le dio la API
            try {
                await CityCache.create({
                    nombreBusqueda,
                    ...datosRespuesta
                });
                console.log(`Ciudad "${nombreCiudad}" guardada en caché`);
            } catch (cacheError: any) {
                console.error('Error al guardar en caché:', cacheError.message);
            }

            return {
                ...datosRespuesta,
                fuente: 'GeoNames API (nuevo)',
                ultimaActualizacion: new Date()
            };

        } else {
            return {
                mensaje: `No se encontró información para la ciudad: ${nombreCiudad}`
            };
        }

    } catch (error: any) {
        console.error('Error al consultar GeoNames:', error.message);
        return {
            mensaje: 'Error al consultar la API de GeoNames',
            error: error.message
        };
    }
};