'use client';
import React, { useEffect, useState } from 'react';

const LastUpdated: React.FC = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const rawDate = process.env.NEXT_PUBLIC_LAST_UPDATED;

    // If the site is building or the variable is missing, show nothing
    if (!mounted || !rawDate) return null;

    return (
        <span className="whitespace-nowrap text-xs">
            Dernière mise à jour : {new Date(rawDate).toLocaleString()}
        </span>
    );
};

export default LastUpdated;