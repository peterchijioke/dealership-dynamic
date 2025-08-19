import React from 'react'
import { Accordion, AccordionItem } from '@/components/ui/accordion'
import ConditionFilter from './filters/condition-filter'
import EngineFilter from './filters/engine-filter'
import PriceFilter from './filters/price-filter'
import YearFilter from './filters/year-filter'
import MakeFilter from './filters/make-filter'

export default function FilterSidebar() {
  return (
      <Accordion>
          <AccordionItem title="Condition">
              <ConditionFilter />
          </AccordionItem>

          <AccordionItem title="Price">
              <PriceFilter />
          </AccordionItem>

          <AccordionItem title="Year">
              <YearFilter />
          </AccordionItem>

          <AccordionItem title="Make">
              <MakeFilter />
          </AccordionItem>

          <AccordionItem title="Model">
              <EngineFilter />
          </AccordionItem>

          <AccordionItem title="Price">
              {/* Example: custom filter */}
              <select className="w-full border rounded px-2 py-1">
                  <option>Any</option>
                  <option>Under $20,000</option>
                  <option>$20,000 - $40,000</option>
                  <option>$40,000+</option>
              </select>
          </AccordionItem>
      </Accordion>
  )
}
