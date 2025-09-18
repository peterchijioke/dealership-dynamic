// import React, { useState } from 'react';
// import { OemIncentiveT } from '../../types/vehicle';
// import { formatNumber } from '../../helpers/string';
// import dynamic from 'next/dynamic';

// const IncentiveDrawer = dynamic(() => import('./IncentiveDrawer'), {
// 	ssr: false,
// });

// type Props = {
// 	incentive: OemIncentiveT;
// };

// function IncentiveItem({ incentive }: Props) {
// 	const [showDetail, setShowDetail] = useState(false);

// 	return (
// 		<>
// 			<li
// 				className="flex cursor-pointer items-start justify-between py-2 border-complete-b hover:text-primary"
// 				onClick={() => setShowDetail(true)}
// 			>
// 				<p className="max-w-[80%] text-sm">{incentive.title}</p>
// 				<p className="max-w-[35%] text-sm font-bold">
// 					{incentive.cashback_price ? `$${formatNumber(incentive.cashback_price)}` : null}
// 					{incentive.incentive_type === 'finance'
// 						? `${incentive.finance_apr}% APR - ${incentive.finance_apr_month} Months`
// 						: null}
// 				</p>
// 			</li>

// 			{showDetail && <IncentiveDrawer incentive={incentive} isOpen={showDetail} onClose={() => setShowDetail(false)} />}
// 		</>
// 	);
// }

// export default IncentiveItem;
import React, { Fragment, useState } from "react";
import dynamic from "next/dynamic";
import { formatNumber } from "@/utils/utils";
import { OemIncentiveT } from "@/types/vehicle";

const IncentiveDrawer = dynamic(() => import("./IncentiveDrawer"), {
  ssr: false,
});

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
