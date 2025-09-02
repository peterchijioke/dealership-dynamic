import React from 'react'
import InfiniteHits from '@/components/algolia/infinite-hits'

interface IProps {
  params: Promise<{ slug: string }>;
}

export default function CertifiedUsedVehiclesModelPage({ params }: IProps) {
  return (
    <InfiniteHits serverHits={[]} />
  )
}
