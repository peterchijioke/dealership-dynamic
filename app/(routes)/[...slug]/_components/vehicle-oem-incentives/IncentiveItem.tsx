import React, { Fragment, useState } from "react";
import { formatNumber } from "@/utils/utils";
import { OemIncentiveT } from "@/types/vehicle";
import IncentiveDrawer from "./IncentiveDrawer";

type Props = {
  incentive: OemIncentiveT;
};

function IncentiveItem({ incentive }: Props) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <Fragment>
      <li
        className="incentive-item-root flex cursor-pointer w-full items-start justify-between py-2 border-complete-b hover:text-primary"
        onClick={() => setShowDetail(true)}
      >
        <p className="incentive-item-title text-[#72777E] text-sm">
          {incentive.title}
        </p>

        <p className="incentive-item-value max-w-[35%] text-[#72777E] flex-wrap text-right text-sm  font-semibold">
          {incentive.cashback_price
            ? `$${formatNumber(incentive.cashback_price)}`
            : incentive.incentive_type === "finance"
            ? `${incentive.finance_apr}% APR - ${incentive.finance_apr_month} Months`
            : null}
        </p>
      </li>

      {/* Incentive Detail Drawer */}
      {showDetail && (
        <IncentiveDrawer
          incentive={incentive}
          isOpen={showDetail}
          onClose={() => setShowDetail(false)}
        />
      )}
    </Fragment>
  );
}

export default IncentiveItem;
