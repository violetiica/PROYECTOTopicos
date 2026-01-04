//para guardar en la bd
import { Schema, model, Document } from 'mongoose';

interface ICityCache extends Document {
    nombreBusqueda: string;
    ciudad: string;
    pais: string;
    estado: string;
    coordenadas: {
        lat: number;
        lng: number;
    };
    poblacion: number;
    fechaConsulta: Date;
    ultimaActualizacion: Date;
}

const cityCacheSchema = new Schema<ICityCache>({
    nombreBusqueda: { 
        type: String, 
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    ciudad: { type: String, required: true },
    pais: { type: String, required: true },
    estado: { type: String, required: true },
    coordenadas: {
        lat: { type: Number, required: true, min: -90, max: 90 },
        lng: { type: Number, required: true, min: -180, max: 180 }
    },
    poblacion: { type: Number, default: 0 },
    fechaConsulta: { type: Date, default: Date.now },
    ultimaActualizacion: { type: Date, default: Date.now }
});

cityCacheSchema.index({ nombreBusqueda: 1 });

export const CityCache = model<ICityCache>('CityCache', cityCacheSchema);
