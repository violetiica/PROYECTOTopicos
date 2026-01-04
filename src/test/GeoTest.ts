// Test que mockea el modelo `GeoReport` para no conectarse a la BD.
// Usamos `jest.mock` y `require()` dentro de cada test para evitar problemas de hoisting/import ESM.
jest.mock('../models/GeoReport', () => ({
	GeoReport: {
		find: jest.fn(),
		findById: jest.fn(),
		create: jest.fn(),
	},
}));

const { GeoReport } = require('../models/GeoReport');

describe('GeoService (tests con mocks)', () => {
	afterEach(() => { jest.clearAllMocks(); });

	test('obtenerTodosReporteGeo devuelve lista (mock)', async () => {
		const mock = [{ ciudad: 'A', descripcion: 'X', tipoIncidencia: 'Y', coordenadas: { lat: 0, lng: 0 } }];
		(GeoReport.find as jest.Mock).mockReturnValue({ sort: () => Promise.resolve(mock) });

		const { obtenerTodosReporteGeo } = require('../services/GeoService');
		const res = await obtenerTodosReporteGeo();
		expect(Array.isArray(res)).toBe(true);
		expect(res[0].ciudad).toBe('A');
	});

	test('obtenerReporteGeoPorID devuelve mensaje si no existe', async () => {
		(GeoReport.findById as jest.Mock).mockResolvedValue(null);
		const { obtenerReporteGeoPorID } = require('../services/GeoService');
		const res = await obtenerReporteGeoPorID('no-existe');
		expect(res).toHaveProperty('mensaje');
	});

	test('crearReporteGeo crea y devuelve el reporte', async () => {
		const datos = { ciudad: 'B', descripcion: 'desc', tipoIncidencia: 'X', coordenadas: { lat: 1, lng: 2 } };
		(GeoReport.create as jest.Mock).mockResolvedValue({ _id: '1', ...datos });
		const { crearReporteGeo } = require('../services/GeoService');
		const res = await crearReporteGeo(datos);
		expect(res).toHaveProperty('_id');
		expect(res.ciudad).toBe('B');
	});
});
