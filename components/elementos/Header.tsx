import React from 'react';
import Image from 'next/image'
import Nav from './Nav';


export default function Header({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {

    return (
        <div className="border-b flex items-center space-between">
            <div className="flex items-center space-between">
                <Image
                    src='/logo-UEFS.png'
                    width={25}
                    height={25}
                    alt="Imagem referente a logo"
                    className='ml-5 mr-3'
                />
                <p>
                    Curso WEB
                </p>

            </div>

            <div className="flex h-16 items-center px-4 ml-auto">
                <Nav className='mx-6'/>
            </div>

        </div>

    )


}