import { Schema, model }  from 'mongoose';

interface I_transitoincident{
    line_id : string;
    line_name : string;
    line_status : string;
    line_severity : number;
}

const TransitoIncidentSchema = new Schema<I_transitoincident>({
    line_id: { type: String, required: true },
    line_name: { type: String, required: true },
    line_status: { type: String, required: true },
    line_severity: { type: Number, required: true }
});

export const Transporte = model<I_transitoincident> ('Transporte', TransitoIncidentSchema);