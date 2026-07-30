type StepState = "done" | "current" | "upcoming";

type CheckoutStepsProps = {
  activeStep: 1 | 2 | 3 | 4;
  paymentSuccess?: boolean | null;
  /** Cart page shows the active step as completed (green check) while keeping the current class. */
  showActiveAsComplete?: boolean;
};

function StepCircle({
  state,
  label,
  number,
  isCurrentStep = false,
}: {
  state: StepState;
  label: string;
  number?: number;
  isCurrentStep?: boolean;
}) {
  const done = state === "done";

  return (
    <div
      className={`step ${state === "current" || isCurrentStep ? "current" : ""} mt-5 flex flex-col items-center gap-2`}
    >
      <span
        className={`flex aspect-square w-12 items-center justify-center rounded-full p-2 ${
          done
            ? "bg-[#06CC85] text-white"
            : state === "current"
              ? "bg-[#EFEFEF] dark:bg-[#4A4E7C]"
              : "bg-[#EFEFEF] dark:bg-[#4A4E7C]"
        }`}
      >
        {done ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 457.57" className="h-6 w-6">
            <path
              fill="white"
              d="M0,220.57c100.43-1.33,121-5.2,191.79,81.5,54.29-90,114.62-167.9,179.92-235.86C436-.72,436.5-.89,512,.24,383.54,143,278.71,295.74,194.87,457.57,150,361.45,87.33,280.53,0,220.57Z"
            />
          </svg>
        ) : (
          <span>{number}</span>
        )}
      </span>
      <span>{label}</span>
    </div>
  );
}

function Connector({ green = false }: { green?: boolean }) {
  return (
    <div className="current hidden w-full lg:block">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={green ? "/img/svg/green.svg" : "/img/svg/checkout.svg"}
        alt=""
        className="w-full"
      />
    </div>
  );
}

function stepState(step: number, activeStep: number): StepState {
  if (step < activeStep) return "done";
  if (step === activeStep) return "current";
  return "upcoming";
}

function resolveStepState(
  step: number,
  activeStep: number,
  showActiveAsComplete: boolean,
): StepState {
  if (showActiveAsComplete && step === activeStep) {
    return "done";
  }

  return stepState(step, activeStep);
}

export function CheckoutSteps({
  activeStep,
  paymentSuccess = null,
  showActiveAsComplete = false,
}: CheckoutStepsProps) {
  const step4Done = paymentSuccess === true;
  const step4Failed = paymentSuccess === false;

  return (
    <div className="flex items-center justify-between gap-3">
      <StepCircle
        state={resolveStepState(1, activeStep, showActiveAsComplete)}
        label="سبد خرید"
        number={1}
        isCurrentStep={activeStep === 1}
      />
      <Connector green={activeStep > 1} />
      <StepCircle state={stepState(2, activeStep)} label="ایجاد حساب" number={2} />
      <Connector green={activeStep > 2} />
      <StepCircle state={stepState(3, activeStep)} label="پرداخت" number={3} />
      <Connector green={activeStep > 3} />
      <div
        className={`step mt-5 flex flex-col items-center gap-2 text-center ${
          step4Done ? "completed" : step4Failed ? "not-completed" : ""
        }`}
      >
        <span
          className={`flex aspect-square w-12 items-center justify-center rounded-full bg-[#EFEFEF] text-3xl dark:bg-[#4A4E7C] ${
            step4Done ? "bg-[#06CC85] text-white" : step4Failed ? "la-times" : ""
          }`}
        >
          {step4Done ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 457.57" className="h-6 w-6">
              <path
                fill="white"
                d="M0,220.57c100.43-1.33,121-5.2,191.79,81.5,54.29-90,114.62-167.9,179.92-235.86C436-.72,436.5-.89,512,.24,383.54,143,278.71,295.74,194.87,457.57,150,361.45,87.33,280.53,0,220.57Z"
              />
            </svg>
          ) : (
            "4"
          )}
        </span>
        <p>جزئیات پرداخت</p>
      </div>
    </div>
  );
}
