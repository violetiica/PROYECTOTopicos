import { Schema, model, Document } from 'mongoose';

interface ITransportCache extends Document {
    lineId: string;
    lineName: string;
    modeOfTransport: string;
    status: string;
    severity: number;
    reason: string;
    ciudad: string;
    fechaConsulta: Date;
    ultimaActualizacion: Date;
}

const transportCacheSchema = new Schema<ITransportCache>({
    lineId: { 
        type: String, 
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    lineName: { type: String, required: true },
    modeOfTransport: { type: String, required: true },
    status: { type: String, required: true },
    severity: { type: Number, default: 0 },
    reason: { type: String, default: 'No issues reported' },
    ciudad: { type: String, default: 'London' },
    fechaConsulta: { type: Date, default: Date.now },
    ultimaActualizacion: { type: Date, default: Date.now }
});

transportCacheSchema.index({ lineId: 1 });

export const TransportCache = model<ITransportCache>('TransportCache', transportCacheSchema);
