import { Options } from 'swagger-jsdoc';

export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CiudadData - Public Data Gateway API',
      version: '1.0.0',
      description: 'API REST para gestión de datos públicos urbanos con integración a GeoNames y Transport for London',
      contact: {
        name: 'Patricia y Violeta',
        email: 'tu-email@ejemplo.com'
      }
    },
    servers: [
      { 
        url: 'http://localhost:3005',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      schemas: {
        GeoReport: {
          type: 'object',
          required: ['ciudad', 'descripcion', 'tipoIncidencia', 'coordenadas'],
          properties: {
            ciudad: { 
              type: 'string',
              example: 'Caracas'
            },
            descripcion: { 
              type: 'string',
              example: 'Bache grande en la avenida principal'
            },
            tipoIncidencia: { 
              type: 'string',
              example: 'Infraestructura'
            },
            coordenadas: {
              type: 'object',
              required: ['lat', 'lng'],
              properties: {
                lat: { 
                  type: 'number',
                  minimum: -90,
                  maximum: 90,
                  example: 10.4806
                },
                lng: { 
                  type: 'number',
                  minimum: -180,
                  maximum: 180,
                  example: -66.9036
                }
              }
            },
            fecha: { 
              type: 'string', 
              format: 'date-time',
              example: '2026-01-04T00:25:33.490Z'
            }
          }
        },
        TransporteIncident: {
          type: 'object',
          required: ['line_id', 'line_name', 'line_status', 'line_severity'],
          properties: {
            line_id: {
              type: 'string',
              example: 'L1'
            },
            line_name: {
              type: 'string',
              example: 'Línea Roja'
            },
            line_status: {
              type: 'string',
              example: 'Retraso'
            },
            line_severity: {
              type: 'number',
              example: 3
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            mensaje: {
              type: 'string',
              example: 'Error al procesar la solicitud'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Geo Reports',
        description: 'Endpoints para gestión de reportes geográficos'
      },
      {
        name: 'Geo APIs',
        description: 'Integración con GeoNames API'
      },
      {
        name: 'Transporte',
        description: 'Endpoints para gestión de incidentes de transporte'
      },
      {
        name: 'Transport APIs',
        description: 'Integración con Transport for London API'
      }
    ]
  },
  apis: ['./src/routes/*.ts']
};