import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"


interface FormFieldBasicProps {
    form: any;
    placeholder: string;
    name: string;
    label: string;
    className?: string;
}


export default function FormFieldBasic({form, placeholder, name, label, className}: FormFieldBasicProps){
    return (
        <FormField
            control={form.control}
            name={name}
            render={({field}) => (
                <FormItem className={className}>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input placeholder={placeholder} {...field} type="text" value={field.value} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}