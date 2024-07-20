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
import { Label } from "@/components/ui/label"


interface FormFieldViewProps {
    placeholder: string;
    label: string;
    className?: string; // Parâmetro opcional para className
}


export default function FormFieldView({placeholder, label, className }: FormFieldViewProps) {
    return (

        <div className={className}>
            <Label>{label}</Label>

            <div className="text-sm text-muted-foreground mt-2">
                {placeholder}
            </div>
        </div>
    )
}