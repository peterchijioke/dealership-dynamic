import { useCurrentRefinements } from "react-instantsearch";
import { AccordionItem } from "../ui/custom-accordion";

export default function RefinementAccordionItem({
    attribute,
    title,
    children,
    className,
}: {
    attribute: string;
    title: string;
    children: React.ReactNode;
    className?: string;
}) {
    const { items } = useCurrentRefinements();

    const current = items.find((item) => item.attribute === attribute);
    const appliedCount = current ? current.refinements.length : 0;

    return (
        <AccordionItem title={title} count={appliedCount} className={className}>
            {children}
        </AccordionItem>
    );
}
