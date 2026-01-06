// Tests para asegurar comportamiento ante errores en los controladores de transporte

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
describe('TransportesController - manejo de errores', () => {
  afterEach(() => { jest.resetAllMocks(); jest.resetModules(); });

  //se asegura de que getTransporteporID maneje el caso de no encontrado y devuelva un error 404
  test('getTransporteporID devuelve 404 cuando no existe', async () => {
    //mockea el modelo transporteincidents y la funcion findById para que retorne null
    jest.mock('../models/transporteincidents', () => ({
        //se asegura q sin importar q id sea, retorne null 
      Transporte: { findById: jest.fn().mockResolvedValue(null) }
    }));

    //preparacion de parametros y la funcion a testear
    const { getTransporteporID } = require('../controller/TransportesController');
    const req: any = { params: { id: 'noex' } };
    const res = mockResponse();

    //ejecucion de la funcion testeada
    await getTransporteporID(req, res);

    //validaciones/expectativas sobre lo q se espera obtener segun los datos simulados
    //En este caso, un  error 404 con mensaje de Transporte no encontrado
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Transporte no encontrado" });
  });

    //se asegura de que getTransporteporID maneje errores de BD y devuelva un error 500
  test('getTransporteporID devuelve 500 cuando hay error en BD', async () => {
    jest.mock('../models/transporteincidents', () => ({
        //asegura q retorne error "boom" en vez de datos
        //crea la funcion mockeada que registra el error
      Transporte: { findById: jest.fn().mockRejectedValue(new Error('boom')) }
    }));

    //preparacion de funcion a testear y sus parametros
    const { getTransporteporID } = require('../controller/TransportesController');
    const req: any = { params: { id: 'err' } };
    const res = mockResponse();

    //ejecucion de la funcion testeada
    await getTransporteporID(req, res);

    //validaciones/expectativas sobre lo q se espera obtener segun los datos simulados
    //en este caso, un error 500 con mensaje de error del servidor
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error del servidor' });
  });

    //se asegura de que createTransporte maneje errores de guardado y devuelva un error 500
  test('createTransporte devuelve 500 cuando save falla', async () => {
    //crea el modelo de transporteincidents y cdo quiera crear uno, se usa este objeto simulador transporte
    jest.mock('../models/transporteincidents', () => ({
        //define lo que debe salir de nuestro objeto mockeado, en este caso un metodo save
      Transporte: jest.fn().mockImplementation(() => ({ 
        //asegura q retorne error "boom" en vez de datos
        //crea la funcion mockeada que registra el error
        save: jest.fn().mockRejectedValue(new Error('boom')) }))
    }));

    //preparacion de funcion a testear y sus parametros
    const { createTransporte } = require('../controller/TransportesController');
    const req: any = { body: { line_id: '1', line_name: 'L', line_status: 'OK', line_severity: 0 } };
    const res = mockResponse();

    //ejecucion de la funcion testeada
    await createTransporte(req, res);

    //validaciones/expectativas sobre lo q se espera obtener segun los datos simulados
    //en este caso, un error 500 con mensaje de error del servidor
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error del servidor' });
  });

  //asegura que createTransporte devuelve 201 cuando el guardado es exitoso
  test('createTransporte devuelve 201 y el transporte creado cuando save tiene exito', async () => {
    //crea el modelo de transporteincidents y cdo quiera crear uno, se usa este objeto simulador transporte
    const saved = { _id: 'abc', line_id: '1', line_name: 'L', line_status: 'OK', line_severity: 0 };
    jest.mock('../models/transporteincidents', () => ({
        //define lo que debe salir de nuestro objeto mockeado, en este caso un metodo save
      Transporte: jest.fn().mockImplementation(() => ({ 
        //asegura q retorne el objeto guardado con exito
        save: jest.fn().mockResolvedValue(saved) }))
    }));

    //preparacion de funcion a testear y sus parametros
    const { createTransporte } = require('../controller/TransportesController');
    const req: any = { body: { line_id: '1', line_name: 'L', line_status: 'OK', line_severity: 0 } };
    const res = mockResponse();

    //ejecucion de la funcion testeada
    await createTransporte(req, res);

    //validaciones/expectativas sobre lo q se espera obtener segun los datos simulados
    //en este caso, un 201 con el transporte creado
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'Transporte creado exitosamente', data: saved });
  });
});
