import { Schema, model, Types }  from 'mongoose';

interface I_transporteincident{
    line_id : Types.ObjectId;
    line_name : string;
    line_status : string;
    line_severity : number;
}

const TransporteIncidentSchema = new Schema<I_transporteincident>({
    line_id: { type: Schema.Types.ObjectId, required: true },
    line_name: { type: String, required: true },
    line_status: { type: String, required: true },
    line_severity: { type: Number, required: true }
});

export const Transporte = model<I_transporteincident>('Transporte', TransporteIncidentSchema);