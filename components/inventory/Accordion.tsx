import React, {
  useState,
  useContext,
  createContext,
  ReactNode,
  FC,
} from "react";

type AccordionContextType = {
  openIndexes: number | number[] | null;
  toggleIndex: (index: number) => void;
  allowMultiple: boolean;
};

const AccordionContext = createContext<AccordionContextType | undefined>(
  undefined
);

type AccordionProps = {
  /** Children must be AccordionItem components */
  children: ReactNode;
  /** Default open index (for single mode) */
  defaultIndex?: number | null;
  /** Allow multiple items to be open at the same time */
  allowMultiple?: boolean;
};

export const Accordion: FC<AccordionProps> = ({
  children,
  defaultIndex = null,
  allowMultiple = false,
}) => {
  const [openIndexes, setOpenIndexes] = useState<number | number[] | null>(
    allowMultiple ? [] : defaultIndex
  );

  const toggleIndex = (index: number) => {
    if (allowMultiple) {
      setOpenIndexes((prev) =>
        Array.isArray(prev)
          ? prev.includes(index)
            ? prev.filter((i) => i !== index)
            : [...prev, index]
          : [index]
      );
    } else {
      setOpenIndexes((prev) => (prev === index ? null : index));
    }
  };

  return (
    <AccordionContext.Provider
      value={{ openIndexes, toggleIndex, allowMultiple }}
    >
      <div className="rounded-md border shadow-sm divide-y">{children}</div>
    </AccordionContext.Provider>
  );
};

type AccordionItemProps = {
  children: ReactNode;
  title: string;
  index: number;
};

export const AccordionItem: FC<AccordionItemProps> = ({
  children,
  title,
  index,
}) => {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error("AccordionItem must be used within an Accordion component");
  }

  const { openIndexes, toggleIndex, allowMultiple } = context;

  const isOpen = allowMultiple
    ? Array.isArray(openIndexes) && openIndexes.includes(index)
    : openIndexes === index;

  return (
    <div>
      <button
        onClick={() => toggleIndex(index)}
        className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 focus:outline-none"
      >
        <span className="font-semibold text-gray-800">{title}</span>
        <span className="text-xl">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && <div className="px-4 py-3 bg-white">{children}</div>}
    </div>
  );
};
