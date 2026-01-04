// Mock del modelo `Transporte` para ejecutar tests sin BD.
jest.mock('../models/transporteincidents', () => ({
	Transporte: {
		find: jest.fn(),
		findById: jest.fn(),
		create: jest.fn(),
		findByIdAndUpdate: jest.fn(),
		findByIdAndDelete: jest.fn(),
	},
}));

const { Transporte } = require('../models/transporteincidents');

describe('TransporteService (tests con mocks)', () => {
	afterEach(() => { jest.clearAllMocks(); });

	test('getTransportes devuelve array (mock)', async () => {
		const datosMock = [{ line_id: '1', line_name: 'L1', line_status: 'OK', line_severity: 0 }];
		(Transporte.find as jest.Mock).mockResolvedValueOnce(datosMock);

		const { getTransportes } = require('../services/TransporteService');
		const res = await getTransportes();

		expect(Array.isArray(res)).toBe(true);
		expect(res[0].line_name).toBe('L1');
	});

	test('getTransportes maneja error y devuelve mensaje', async () => {
		(Transporte.find as jest.Mock).mockRejectedValueOnce(new Error('boom'));
		const { getTransportes } = require('../services/TransporteService');
		const res = await getTransportes();
		expect(res).toHaveProperty('mensaje');
	});

	test('createTransporte crea y devuelve transporte', async () => {
		const datos = { line_id: '2', line_name: 'L2', line_status: 'OK', line_severity: 1 };
		(Transporte.create as jest.Mock).mockResolvedValueOnce({ _id: 'abc', ...datos });
		const { createTransporte } = require('../services/TransporteService');
		const res = await createTransporte(datos);
		expect(res).toHaveProperty('mensaje', 'Transporte creado con exito');
		expect(res.transporte).toBeDefined();
	});
});
