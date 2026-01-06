// Test que mockea el modelo transporteincidents para q no se conecte con la bd

//Aqui copiamos la estructura del modelo Georeports y
//cuadramos la simulacion de las funciones a usar 
jest.mock('../models/transporteincidents', () => ({
	Transporte: {
		find: jest.fn(),
		findById: jest.fn(),
		create: jest.fn(),
		findByIdAndUpdate: jest.fn(),
		findByIdAndDelete: jest.fn(),
	},
}));

//obtencion del modelo mockeado
const { Transporte } = require('../models/transporteincidents');

//casos de prueba
describe('TransporteService (tests con mocks)', () => {
	afterEach(() => { jest.clearAllMocks(); });

	//evalua si la funcion q obtiene la lista de transportesincidents funciona independientemente de la bd
	test('getTransportes devuelve array (mock)', async () => {
		//transporte simulado
		const datosMock = [{ line_id: '1', line_name: 'L1', line_status: 'OK', line_severity: 0 }];
		//retorna promesa con los datos simulados
		(Transporte.find as jest.Mock).mockResolvedValueOnce(datosMock);

		//ejecucion de la funcion testeada
		const { getTransportes } = require('../services/TransporteService');
		const res = await getTransportes();

		//validaciones/expectativas sobre lo q se espera obtener segun los datos simulados
		//en este caso, el array simulado y los datos exactos
		expect(Array.isArray(res)).toBe(true);
		expect(res[0].line_name).toBe('L1');
	});

	//evalua si la funcion gettransportes puede manejar errores y mandar el mensaje
	test('getTransportes maneja error y devuelve mensaje', async () => {
		//retorna error llamado "boom" en vez de datos
		(Transporte.find as jest.Mock).mockRejectedValueOnce(new Error('boom'));

		//ejecucion de la funcion testeada
		const { getTransportes } = require('../services/TransporteService');
		const res = await getTransportes();

		//validaciones/expectativas sobre lo q se espera obtener segun los datos simulados
		//en este caso, un mensaje de error
		expect(res).toHaveProperty('mensaje');
	});

	//evalua si la funcion q crea transportesincidents funciona independientemente de la bd
	test('createTransporte crea y devuelve transporte', async () => {
		//transporte simulado
		const datos = { line_id: '2', line_name: 'L2', line_status: 'OK', line_severity: 1 };

		//retorna promesa con el nuevo transportesimulado
		//como es simulado, le agregamos un id manualmente (esto lo hace la bd)
		(Transporte.create as jest.Mock).mockResolvedValueOnce({ _id: 'abc', ...datos });

		//ejecucion de la funcion testeada
		const { createTransporte } = require('../services/TransporteService');
		const res = await createTransporte(datos);

		//validaciones/expectativas sobre lo q se espera obtener segun los datos simulados
		//en este caso, que tenga el id creado y q la respuesta tenga algo llamado transporte
		expect(res).toHaveProperty('mensaje', 'Transporte creado con exito');
		expect(res.transporte).toBeDefined();
	});
});
