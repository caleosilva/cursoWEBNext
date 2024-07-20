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

import { useState } from "react";
import { Pencil2Icon } from "@radix-ui/react-icons"
import { Loader2 } from "lucide-react"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"

import FormFieldBasic from '@/components/elementos/FormFieldBasic/FormFieldBasic'
import FormFieldCPF from "@/components/elementos/FormFieldCPF/FormFieldCPF"
import AlertDestructive from "@/components/elementos/AlertDestructive/AlertDestructive"
import AlertAttention from "@/components/elementos/AlertAttention/AlertDestructive";
import { useToast } from "@/components/ui/use-toast"

function isEmail(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
}

const formSchema = z.object({
    nome: z.string().min(2, { message: "O nome deve ter no mínimo 2 caracteres" }),
    matricula: z.string().min(4, { message: "A matrícula deve possuir no mínimo 4 caracteres" }),
    cpf: z.string().min(13, { message: "O CPF deve conter entre 13 e 14 números" }),
    email: z.string().refine(value => isEmail(value), {
        message: "O e-mail inserido é inválido",
    }),

    _id: z.string()
});

export default function DialogEditarEstudante({ data, update, setUpdate }: { data: any, update: any, setUpdate: any }) {
    const [open, setOpen] = useState(false);
    const [erroServer, setErroServer] = useState(false);
    const [erroUsuarioExiste, setErroUsuarioExiste] = useState(false);

    const { toast } = useToast()

    const [isFormSubmitting, setFormSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            _id: data._id,
            nome: data.nome,
            matricula: data.matricula,
            cpf: data.cpf,
            email: data.email,
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setFormSubmitting(true)
        setErroServer(false);
        setErroUsuarioExiste(false)

        try {
            const response = await fetch('/api/estudante', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });

            if (response.ok) {
                setOpen(false)
                setUpdate(!update)

                toast({
                    title: "Sucesso!",
                    description: "As informações foram atualizadas.",
                    duration: 5000,
                    variant: "success"
                });
            } else {
                const status = response.status
                if (status == 409) {
                    setErroUsuarioExiste(true)
                } else {
                    setErroServer(true)
                }
            }
        } catch (error) {
            setErroServer(true)
        } finally {
            setFormSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-md">
                    <Pencil2Icon className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[825px] " onInteractOutside={(event) => { event.preventDefault() }}>
                <DialogHeader>
                    <DialogTitle>Atualizar estudante</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="updateForm" className="space-y-2 flex flex-col">

                        <FormFieldBasic form={form} placeholder="" name="nome" label="Nome" />
                        <FormFieldBasic form={form} placeholder="" name="email" label="Email" className="flex-1" />

                        <div className="grid grid-cols-2 gap-8">
                            <FormFieldBasic form={form} placeholder="" name="matricula" label="Matrícula" />
                            <FormFieldCPF form={form} label="CPF" name="cpf" placeholder="XXX.XXX.XXX-XX" />
                        </div>
                    </form>
                </Form>

                {erroServer &&
                    <AlertDestructive descricao="Não foi possível atualizar as informações do estudante. Atualize a página e tente novamente!" titulo="Erro" />
                }

                {erroUsuarioExiste &&
                    <AlertAttention descricao="Já existe um estudante com o CPF inserido acima." titulo="Atenção" />
                }

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" className="">
                            Fechar
                        </Button>
                    </DialogClose>
                    <div>
                        <Button type="submit" form="updateForm" disabled={isFormSubmitting}>
                            {isFormSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                "Salvar"
                            )}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


