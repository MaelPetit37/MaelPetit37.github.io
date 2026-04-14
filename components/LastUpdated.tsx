'use client'
import { useEffect, useState } from 'react'
import update from '@/data/update.json';
import { Update } from '@/types';

export default function LastUpdated() {
    const [dateString, setDateString] = useState("")
    const { updateMessage } = update as Update;

    useEffect(() => {
        const rawDate = process.env.NEXT_PUBLIC_LAST_UPDATED

        if (rawDate) {
            const date = new Date(rawDate)

            // Check if the date is actually valid before trying to format it
            if (!isNaN(date.getTime())) {
                setDateString(date.toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                }))
            }
        }
    }, [])

    if (!dateString) return null // Hide it entirely if the date is invalid

    return (
        <span className="whitespace-nowrap text-xs">
            {updateMessage} : {dateString}
        </span>
    )
}