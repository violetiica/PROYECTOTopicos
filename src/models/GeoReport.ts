import { Schema, model } from "mongoose";

interface IGeoReport {
  ciudad: string;
  descripcion: string;
  tipoIncidencia: string;
  coordenadas: {
    lat: number;
    lng: number;
  };
  fecha: Date;
}

const geoReportsSchema = new Schema({
  ciudad: { type: String, required: true },
  descripcion: { type: String, required: true },
  tipoIncidencia: { type: String, required: true },
  coordenadas:{
    lat: {type: Number, required: true, min: -90, max: 90 },
    lng: {type: Number, required: true, min: -180, max: 180 }
  },
  fecha:{type: Date, default: Date.now} //el default es para que se ponga la fecha actual en caso de no tenerla
});

export const GeoReport = model("GeoReport", geoReportsSchema);