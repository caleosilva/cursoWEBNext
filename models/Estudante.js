const mongoose = require('mongoose');

const estudanteSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    matricula: { type: String, required: true },
    cpf: { type: String, required: true },
    email: { type: String, required: true },
});

const Estudante = mongoose.models.Estudantes || mongoose.model("Estudantes", estudanteSchema, 'estudantes');
export default Estudante;