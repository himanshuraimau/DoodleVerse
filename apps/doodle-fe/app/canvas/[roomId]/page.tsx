'use client'

import { RoomCanvas } from '@/components/Canvas/RoomCanvas'
import React from 'react'


export default function Canvas({ params }: { params: Promise<{ roomId: string }> }) {
    const resolvedParams = React.use(params)

    return (
        <RoomCanvas roomId={resolvedParams.roomId} />
    )
}