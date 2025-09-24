import React from 'react';

function SuccessSubmitMessage() {
	return (
		<div className="absolute left-0 top-0 z-50 h-full w-full bg-white px-6 pt-6 text-dark">
			<h3 className="text-center text-h3">Thank you for contacting us!</h3>
			<p className="mt-3 text-center text-subtitle">
				We really appreciate it! Your business is important to us. One of our customer advocates will be reaching out to
				you shortly.
			</p>
		</div>
	);
}

export default SuccessSubmitMessage;
