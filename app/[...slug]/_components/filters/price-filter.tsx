"use client";

import React, { useState } from 'react'
import RangeInput from '@/components/ui/range-input'

export default function PriceFilter() {
  const [price, setPrice] = useState<{min:number|null; max:number|null}>({
    min: null,
    max: null,
  });
  
  return (
    <div className="px-2 pb-3">
      <RangeInput
        value={price}
        onChange={setPrice}
        minLimit={0}
        maxLimit={200000}
        step={500}
        placeholderMin="Min"
        placeholderMax="Max"
      />
    </div>
  )
}
