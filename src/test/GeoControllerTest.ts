// Tests para asegurar comportamiento ante errores en los controladores de Georeports

// Silenciar logs de error 
beforeAll(() => { jest.spyOn(console, 'error').mockImplementation(() => {}); });
afterAll(() => { (console.error as jest.Mock).mockRestore(); });

// Constructor de mock para las respuestas
const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

//casos de prueba
describe('GeoController - manejo de errores', () => {
  afterEach(() => { jest.resetModules(); jest.clearAllMocks(); });

  //se asegura de que getGeoReportById devuelva el reporte cuando todo va bien
  test('getGeoReportById devuelve 200 y el reporte cuando existe', async () => {
    //mock del servicio para devolver un reporte válido
    const reporteMock = { _id: '1', ciudad: 'X', descripcion: 'd', tipoIncidencia: 't', coordenadas: [] };
    jest.mock('../services/GeoService', () => ({
      obtenerReporteGeoPorID: jest.fn().mockResolvedValue(reporteMock)
    }));

    //preparacion de parametros y la funcion a testear
    const { getGeoReportById } = require('../controller/GeoController');
    const req: any = { params: { id: '1' } };
    const res = mockResponse();

    //ejecucion de la funcion testeada
    await getGeoReportById(req, res);

    //validaciones/expectativas sobre lo q se espera obtener segun los datos simulados
    //en este caso, un 200 con el reporte mockeado
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(reporteMock);
  });

  //se asegura de que getGeoReportById maneje errores del servicio 
  test('getGeoReportById devuelve 500 cuando servicio lanza error', async () => {
    //evita que se obtenga el geoservice real y en su lugar use el mock
    //fuerza una respuesta de error
    jest.mock('../services/GeoService', () => ({
      obtenerReporteGeoPorID: jest.fn().mockRejectedValue(new Error('boom'))
    }));

    //preparacion de parametros y la funcion a testear
    const { getGeoReportById } = require('../controller/GeoController');
    const req: any = { params: { id: 'err' } };
    const res = mockResponse();

    //ejecucion de la funcion testeada
    await getGeoReportById(req, res);

    //validaciones/expectativas sobre lo q se espera obtener segun los datos simulados
    //en este caso, un error 500 debido a la excepcion lanzada por el servicio
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'Error al obtener el reporte' });
  });

  //se asegura de ver la respuesta del servicio de creacion cuando hay un error
  test('postGeoReport devuelve 500 cuando crearReporteGeo retorna mensaje', async () => {
    //error hecho objeto q se va a enviar desde el servicio mockeado
    const errorObj = { mensaje: 'Error: geoservice' };
    jest.mock('../services/GeoService', () => ({
      crearReporteGeo: jest.fn().mockResolvedValue(errorObj)
    }));

    //preparacion de parametros y la funcion a testear
    const { postGeoReport } = require('../controller/GeoController');
    const req: any = { body: { ciudad: 'X', descripcion: 'd', tipoIncidencia: 't', coordenadas: [] } };
    const res = mockResponse();

    //ejecucion de la funcion testeada
    await postGeoReport(req, res);

    //validaciones/expectativas sobre lo q se espera obtener segun los datos simulados
    //en este caso, retransmision del error del servicio
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(errorObj);
  });

  //se asegura de que getCityInfo maneje la falta de parametros
  test('getCityInfo devuelve 400 cuando falta parámetro', async () => {
    //preparacion de funcion a testear sin los parametros
    const { getCityInfo } = require('../controller/GeoController');
    //req sin el parametro city
    const req: any = { params: {} };
    const res = mockResponse();

    //ejecucion de la funcion testeada
    await getCityInfo(req, res);

    //validaciones/expectativas sobre lo q se espera obtener segun los datos simulados
    //en este caso, un  error 400 indicando que hace falta el parametro
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'El parámetro city es requerido' });
  });

  //se asegura de que getCityInfo identifique los mensajes del servicio
  test('getCityInfo devuelve 500 cuando buscarCiudad indica Error', async () => {
    //evita que se obtenga el geosnameservice real y en su lugar use el mock
    //fuerza una respuesta de error
    jest.mock('../services/GeoNamesService', () => ({
      buscarCiudad: jest.fn().mockResolvedValue({ mensaje: 'Error: servicio' })
    }));

    //preparacion de parametros y la funcion a testear
    const { getCityInfo } = require('../controller/GeoController');
    const req: any = { params: { city: 'X' } };
    const res = mockResponse();

    //ejecucion de la funcion testeada
    await getCityInfo(req, res);

    //validaciones/expectativas sobre lo q se espera obtener segun los datos simulados
    //en este caso, un  error 500 tras detectar el mensaje de error del servicio
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'Error: servicio' });
  });

});
