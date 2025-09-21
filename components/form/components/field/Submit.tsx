import React from "react";
import { FormFieldT } from "../../types";
import BeatLoader from "react-spinners/BeatLoader";
import { Button } from "@/components/ui/button";

type Props = {
  fieldData?: FormFieldT;
  isPending: boolean;
};

function SubmitButton(props: Props) {
  const { fieldData, isPending } = props;

  return (
    <Button
      className="col-span-12 mt-4 w-full rounded-sm font-nissan !font-semibold uppercase hover:bg-text hover:text-white"
      disabled={isPending}
      type="submit"
      aria-label="Aria Submit"
    >
      {isPending ? (
        <BeatLoader loading size={8} />
      ) : (
        fieldData?.label ?? fieldData?.name ?? "Submit"
      )}
    </Button>
  );
}

export default SubmitButton;
