'use client'
import { useEffect, useState } from 'react'

export default function LastUpdated() {
    const [dateString, setDateString] = useState("")

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
            Dernière mise à jour : {dateString}
        </span>
    )
}