"use client"

import * as React from "react"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"


export default function FormFieldCPF({ form, placeholder, name, label }: { form: any, placeholder: string, name: string, label:string }) {

    const formatCPF = (value: string) => {
        const cpfLimpo = value.replace(/\D/g, "");

        let cpfComMascara = '';
        if (cpfLimpo.length <= 3) {
            cpfComMascara = cpfLimpo;
        } else if (cpfLimpo.length <= 6) {
            cpfComMascara = `${cpfLimpo.slice(0, 3)}.${cpfLimpo.slice(3)}`;
        } else if (cpfLimpo.length <= 9) {
            cpfComMascara = `${cpfLimpo.slice(0, 3)}.${cpfLimpo.slice(3, 6)}.${cpfLimpo.slice(6)}`;
        } else {
            cpfComMascara = `${cpfLimpo.slice(0, 3)}.${cpfLimpo.slice(3, 6)}.${cpfLimpo.slice(6, 9)}-${cpfLimpo.slice(9, 11)}`;
        }

        return cpfComMascara;
    };

    const handleCPFChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const formattedCPF = formatCPF(event.target.value);
        form.setValue(name, formattedCPF);
    };

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex-1">
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input placeholder={placeholder} {...field} onChange={(e) => handleCPFChange(e)} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}