import React from 'react'
import { Card } from './ui/card'
import Image from 'next/image'

export default function OnboardingSide() {
  return (
    <Card className="w-full h-full rounded-none border-0 ring-0 bg-linear-to-b from-brand via-[#CCCCF5] to-white">
      <Image
        src="/assets/Lines.png"
        alt="lines"
        width={100}
        height={100}
        className="w-full h-full object-cover object-center"
      />
    </Card>
  );
}
