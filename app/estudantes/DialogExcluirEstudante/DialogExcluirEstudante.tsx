import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

import { TrashIcon } from "@radix-ui/react-icons"

import { useState } from "react";
import AlertDestructive from "@/components/elementos/AlertDestructive/AlertDestructive"
import AlertAttention from "@/components/elementos/AlertAttention/AlertDestructive"
import FormFieldView from "@/components/elementos/FormFieldView/FormFieldView"


export default function DialogExcluirEstudante({ data, update, setUpdate }: { data: any, update: any, setUpdate: any }) {
    const [open, setOpen] = useState(false);
    const [erroServer, setErroServer] = useState(false);
    const [erroNotFound, setErroNotFound] = useState(false);

    const { toast } = useToast()

    const handleExcluir = async () => {
        setErroServer(false);
        setErroNotFound(false);

        try {
            const response = await fetch(`/api/estudante?id=${data._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (response.ok) {
                setOpen(false)
                setUpdate(!update)

                toast({
                    title: "Sucesso!",
                    description: "O estudante foi excluido.",
                    duration: 5000,
                    variant: "success"
                });
            } else {
                const status = response.status;
                if (status === 404) {
                    setErroNotFound(true);
                }
            }
        } catch (error) {
            setErroServer(true);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-md">
                    <TrashIcon className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[825px] " onInteractOutside={(event) => { event.preventDefault() }}>
                <DialogHeader>
                    <DialogTitle>
                        Exclusão de registro
                    </DialogTitle>
                </DialogHeader>

                <>
                    <AlertDestructive titulo="Atenção" descricao="Após confirmar a exclusão, NÃO será possível reverter essa operação!" />

                    <div className="flex flex-wrap">
                        <div className="w-full md:w-1/2 lg:w-1/3 mb-4">
                            <FormFieldView label="Nome" placeholder={data.nome} />
                        </div>
                        <div className="w-full md:w-1/2 lg:w-1/3 mb-4">
                            <FormFieldView label="CPF" placeholder={data.cpf} />
                        </div>
                    </div>
                </>

                {erroServer &&
                    <AlertDestructive descricao="Não foi possível excluir o estudante. Tente novamente." titulo="Erro" />
                }

                {erroNotFound &&
                    <AlertAttention descricao="Não foi possível localizar o estudante em questão. Atualize a página e tente novamente!" titulo="Opa, tem algo de errado.." />
                }

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button onClick={handleExcluir} variant="destructive">Excluir</Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}


