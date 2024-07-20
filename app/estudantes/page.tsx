'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from "./data-table"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

import DialogVisualizarEstudante from "./DialogVisualizarEstudante/DialogVisualizarEstudante"
import DialogEditarEstudante from "./DialogEditarEstudante/DialogEditarEstudante"
import DialogExcluirEstudante from "./DialogExcluirEstudante/DialogExcluirEstudante"

type Estudantes = {
  _id: string,

  nome: string,
  matricula: string,
  cpf: string,
  email: string,
}


export default function Estudantes() {

  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);

  const columns: ColumnDef<Estudantes>[] = [
    {
      accessorKey: "nome",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="pl-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Estudante
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const nome = row.getValue("nome");
        return nome
      },
    },

    {
      accessorKey: "cpf",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="pl-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            CPF
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },

    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="pl-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },

    {
      header: "Operações",
      id: "actions",

      cell: ({ row }) => {
        return MenuOperacoes(row)
      },

    },
  ]

  function MenuOperacoes(row: any) {
    const dados = row.original

    return (
      <div className="flex hover:opacity-100 opacity-40" >
        <DialogVisualizarEstudante data={dados} />

        <DialogEditarEstudante data={dados} update={update} setUpdate={setUpdate} />

        <DialogExcluirEstudante data={dados} update={update} setUpdate={setUpdate} />
      </div>
    )
  }

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/estudante`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await res.json();
      setData(result.data);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchData()
  }, [update])

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tabela de estudantes</h2>
        </div>
      </div>
      <DataTable columns={columns} data={data} update={update} setUpdate={setUpdate} />
    </div>
  );
}
