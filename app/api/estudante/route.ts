import Estudante from "@/models/Estudante";
import { NextResponse, NextRequest } from "next/server";
import connectToDatabase from "@/uteis/db";
const mongoose = require('mongoose');

type DadosEditarEstudante = {
    _id: string,

    nome: string,
    matricula: string,
    cpf: string,
    email: string
}

type DadosBaseEstudante = {
    nome: string,
    matricula: string,
    cpf: string,
    email: string,
}

export async function GET(request: NextRequest) {
    try {

        const IdParams = (request.nextUrl.searchParams).get("id")
        await connectToDatabase();

        if (IdParams) {
            const query = {
                _id: new mongoose.Types.ObjectId(IdParams)
            }

            const result = await Estudante.findOne(query);
            if (result) {
                return NextResponse.json({ data: result }, { status: 200 });
            } else {
                return NextResponse.json({ error: "Estudante não encontrado" }, { status: 404 });
            }

        } else {
            const result = await Estudante.find({});
            return NextResponse.json({ data: result }, { status: 200 });
        }


    } catch (error) {
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const data: DadosBaseEstudante = await request.json();
        const { nome, matricula, cpf, email } = data;

        await connectToDatabase();

        const query = {
            cpf: cpf.trim()
        };

        const result = await Estudante.findOne(query)

        if (result) {
            return NextResponse.json({ data: result }, { status: 409 });
        } else {
            const novoEstudante = new Estudante({
                nome: nome.trim(),
                matricula: matricula.trim(),
                cpf: cpf.trim(),
                email: email.trim(),
            });

            const estudanteSalvo = await novoEstudante.save();
            return NextResponse.json({ data: estudanteSalvo }, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ "ERRO": error }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const IdParams = (request.nextUrl.searchParams).get("id")
        await connectToDatabase();

        if (IdParams) {
            const id = new mongoose.Types.ObjectId(IdParams)
            const result = await Estudante.findByIdAndDelete(id);

            if (result) {
                return NextResponse.json({ message: 'Estudante excluído com sucesso!' });
            } else {
                return NextResponse.json({ error: 'Estudante não encontrado.' }, { status: 404 });
            }
        }
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao excluir o item.' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { _id, cpf, ...atualizacoes }: DadosEditarEstudante = await request.json();

        await connectToDatabase();

        const query = {
            _id: new mongoose.Types.ObjectId(_id)
        };

        const duplicateField: DadosEditarEstudante | null = await Estudante.findOne({ cpf: cpf });

        if (duplicateField && duplicateField._id.toString() !== _id) {
            return NextResponse.json({ error: "Entre os estudantes cadastrados, um já possui o CPF alterado acima." }, { status: 409 });
        }

        const dadosAtualizadosUsuario: DadosBaseEstudante = {
            cpf,
            ...atualizacoes
        };
        const result = await Estudante.findOneAndUpdate(query, dadosAtualizadosUsuario, { new: true });

        if (result) {
            return NextResponse.json({ data: result }, { status: 200 });
        } else {
            return NextResponse.json({ error: 'Estudante não foi encontrado.' }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao atualizar o item.' }, { status: 500 });
    }
}