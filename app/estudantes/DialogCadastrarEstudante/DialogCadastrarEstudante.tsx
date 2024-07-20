import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import { Form } from "@/components/ui/form"
import { useState } from "react";

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";

import FormFieldBasic from "@/components/elementos/FormFieldBasic/FormFieldBasic"
import FormFieldCPF from "@/components/elementos/FormFieldCPF/FormFieldCPF";
import { DialogClose } from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import AlertDestructive from "@/components/elementos/AlertDestructive/AlertDestructive"
import AlertAttention from "@/components/elementos/AlertAttention/AlertDestructive"


function isEmail(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
}

const formSchema = z.object({
    nome: z.string().min(2, { message: "O nome deve ter no mínimo dois caracteres" }),
    matricula: z.string().min(6, { message: "A matricula deve ter no mínimo seis caracteres" }),
    cpf: z.string().min(13, { message: "O CPF deve conter entre 13 e 14 número" }),
    email: z.string().refine(value => isEmail(value), {
        message: "O E-mail inserido é inválido"
    })
})



export default function DialogCadastrarEstudante({ update, setUpdate }: { update: any, setUpdate: any }) {

    const [open, setOpen] = useState(false);
    const [isFormSubmitting, setFormSubmitting] = useState(false);

    const { toast } = useToast()

    const [erroServer, setErroServer] = useState(false)
    const [erroUsuarioExiste, setErroUsuarioExiste] = useState(false)


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome: "",
            matricula: "",
            cpf: "",
            email: ""
        }
    })


    const limparCampos = () => {
        form.reset();
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log("Valores: ", values);

        setFormSubmitting(true);
        setErroServer(false);
        setErroUsuarioExiste(false);

        try {

            const response = await fetch('/api/estudante', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            })

            if (response.ok) {
                setOpen(false);
                limparCampos();
                setUpdate(!update);

                toast({
                    title: "Sucesso!",
                    description: "O estudante foi cadastrado.",
                    duration: 5000,
                    variant: "success"
                });
            } else {
                const status = response.status;
                if (status === 409) {
                    setErroUsuarioExiste(true);
                } else if (status === 500) {
                    setErroServer(true);
                } else {
                    setErroServer(true);
                }
            }
        } catch (error) {
            setErroServer(true);
        } finally {
            setFormSubmitting(false);
        }
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button variant="outline">Cadastrar estudante</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[825px] " onInteractOutside={(event) => { event.preventDefault() }}>

                <DialogHeader>
                    <DialogTitle>Cadastrar estudante</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="cadastroForm" className="space-y-2 flex flex-col">
                        <FormFieldBasic form={form} placeholder="" name="nome" label="Nome" />
                        <FormFieldBasic form={form} placeholder="" name="email" label="Email" />

                        <div className="grid grid-cols-2 gap-8">
                            <FormFieldBasic form={form} placeholder="" name="matricula" label="Matrícula" />
                            <FormFieldCPF form={form} label="CPF" name="cpf" placeholder="XXX.XXX.XXX-XX" />
                        </div>
                    </form>
                </Form>

                {erroServer &&
                    <AlertDestructive descricao="Não foi possível cadastrar o estudante. Tente novamente." titulo="Erro" />
                }

                {erroUsuarioExiste &&
                    <AlertAttention descricao="Já existe um estudante com o CPF inserido acima." titulo="Atenção!" />
                }



                <DialogFooter>

                    <DialogClose>
                        <Button type="button" variant="secondary" className="">
                            Cancelar
                        </Button>
                    </DialogClose>
                    <div>
                        <Button type="submit" form="cadastroForm" disabled={isFormSubmitting}>
                            {isFormSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Cadastrando...
                                </>
                            ) : (
                                "Cadastrar"
                            )}
                        </Button>
                    </div>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}


