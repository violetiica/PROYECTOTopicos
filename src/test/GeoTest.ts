// Test que mockea el modelo GeoReport para que no se conecte con la bd
// Se hizo esto usando jest.mock y require 

//Aqui copiamos la estructura del modelo Georeports y
//cuadramos la simulacion de las funciones a usar 
jest.mock('../models/GeoReport', () => ({
	GeoReport: {
		find: jest.fn(),
		findById: jest.fn(),
		create: jest.fn(),
	},
}));

//obtencion del modelo mockeado
const { GeoReport } = require('../models/GeoReport');

//casos de prueba
describe('GeoService (tests con mocks)', () => {
	afterEach(() => { jest.clearAllMocks(); });

	//evalua si la funcion q obtiene la lista de reportes funciona independientemente de la bd
	test('obtenerTodosReporteGeo devuelve lista (mock)', async () => {
		//reporte simulado
		const mock = [{ ciudad: 'A', descripcion: 'X', tipoIncidencia: 'Y', coordenadas: { lat: 0, lng: 0 } }];
		//retorna sort con promesa q tenga los datos simulados
		(GeoReport.find as jest.Mock).mockReturnValue({ sort: () => Promise.resolve(mock) });

		//ejecucion de la funcion testeada
		const { obtenerTodosReporteGeo } = require('../services/GeoService');
		const res = await obtenerTodosReporteGeo();

		//validaciones/expectativas sobre lo q se espera obtener segun los datos simulados
		//en este caso, el reporte simulado
		expect(Array.isArray(res)).toBe(true);
		expect(res[0].ciudad).toBe('A');
	});

	//evalua si la funcion q obtiene un reporte por id funciona independientemente de q no exista en la bd
	test('obtenerReporteGeoPorID devuelve mensaje si no existe', async () => {
		//retorna promesa sin data, es decir null.
		(GeoReport.findById as jest.Mock).mockResolvedValue(null);

		//ejecucion de la funcion testeada
		const { obtenerReporteGeoPorID } = require('../services/GeoService');
		const res = await obtenerReporteGeoPorID('no-existe');
		//validaciones/expectativas sobre lo q se espera obtener segun los datos simulados
		//en este caso un mensaje de no encontrado
		expect(res).toHaveProperty('mensaje');
	});

	//evalua si la funcion q crea los reportes funciona independientemente de la bd
	test('crearReporteGeo crea y devuelve el reporte', async () => {
		//datos simulados
		const datos = { ciudad: 'B', descripcion: 'desc', tipoIncidencia: 'X', coordenadas: { lat: 1, lng: 2 } };
		//retorna promesa con el nuevo reporte simulado
		//como es simulado, le agregamos un id manualmente (esto lo hace la bd)
		(GeoReport.create as jest.Mock).mockResolvedValue({ _id: '1', ...datos });

		//ejecucion de la funcion testeada
		const { crearReporteGeo } = require('../services/GeoService');
		const res = await crearReporteGeo(datos);

		//validaciones/expectativas sobre lo q se espera obtener segun los datos simulados
		//en este caso, que tenga el id creado y q la integridad de datos persista
		expect(res).toHaveProperty('_id');
		expect(res.ciudad).toBe('B');
	});
});
