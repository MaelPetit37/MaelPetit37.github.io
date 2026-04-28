import React from 'react';
import Image from 'next/image';
import { Tool } from '@/types';

interface ToolProps extends Tool { }

const ToolLogo: React.FC<ToolProps> = ({
    name,
    logo,
    invert
}) => {
    return (
        <div className="relative h-16 w-16 transition duration-300 ease-in-out hover:scale-130">
            <a title={name} className="relative block h-full w-full">
                <Image
                    src={`/logos/${logo}`}
                    alt={name}
                    fill
                    className={`object-contain ${invert ? 'dark:invert' : ''}`}
                />
            </a>
        </div>
    );
};

export default ToolLogo;