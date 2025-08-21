import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface JobStatusStepProps {
  onSelect: (answer: string) => void;
  onClose: () => void;
  variant: "A" | "B";
  subscriptionData: {
  id: string;          
  user_id: string;     
  monthlyPrice: number;
  currentPeriodEnd: string;
};
}

const JobStatusStep: React.FC<JobStatusStepProps> = ({ onClose, variant, subscriptionData }) => {
  const [step, setStep] = useState<
    | "question"
    | "congrats"
    | "feedback"
    | "visaSupport"
    | "completeWithLawyer"
    | "completeNoLawyer"
    | "offer"
    | "discountConfirmation"
    | "understand"
    | "reason"
    | "reasonTooExpensive"
    | "platformNotHelpfulDetail"
    | "tooExpensiveDetail"
    | "notEnoughJobsDetail"
    | "decidedNotToMoveDetail"
    | "otherDetail"
    | "cancellationComplete"
  >("question");
  const [visaLawyer, setVisaLawyer] = useState<string>("");
  const [visaType, setVisaType] = useState<string>("");
  const [cancelReason, setCancelReason] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState("");
  const [showError, setShowError] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const discountPrice =
  variant === "B"
    ? subscriptionData.monthlyPrice - 10 
    : subscriptionData.monthlyPrice;

  const daysLeft = subscriptionData?.currentPeriodEnd
  ? Math.ceil(
      (new Date(subscriptionData.currentPeriodEnd).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
    )
  : null;

const nextBillingDate = subscriptionData?.currentPeriodEnd
  ? new Date(subscriptionData.currentPeriodEnd).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  : null;
  useEffect(() => {
  if (variant === "B") {
    setShowDiscount(true); // Variant B users see discount immediately
  }
  }, [variant]); 

  // State for answers
  const [foundWithMM, setFoundWithMM] = useState<string | null>(null);
  const [rolesApplied, setRolesApplied] = useState<string | null>(null);
  const [companiesEmailed, setCompaniesEmailed] = useState<string | null>(null);
  const [companiesInterviewed, setCompaniesInterviewed] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  // Check if all answered
  const allAnswered = foundWithMM && rolesApplied && companiesEmailed && companiesInterviewed;
  const allAnswered2 = rolesApplied && companiesEmailed && companiesInterviewed;

  const handleAcceptDiscount = async () => {
  const subscriptionId = subscriptionData?.id;
  const userId = subscriptionData?.user_id;

  if (!subscriptionId || !userId) return;

  
  await supabase.from("cancellations").insert({
    user_id: userId,
    subscription_id: subscriptionId,
    downsell_variant: variant,   // A or B
    accepted_downsell: true,
  });

  
  await supabase
    .from("subscriptions")
    .update({ pending_cancellation: false })
    .eq("id", subscriptionId);


  setStep("discountConfirmation");
};

  // Handler for complete cancellation
  const handleCompleteCancellation = () => {
    if (visaLawyer === "Yes") {
      setStep("completeWithLawyer");
    } else if (visaLawyer === "No") {
      setStep("completeNoLawyer");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl relative flex flex-col w-[1000px] h-[600px] text-gray-900">
        {/* Header */}
        <div className="relative flex items-center justify-between px-6 py-4 border-b border-gray-200">
          {(step === "congrats" || step === "feedback" || step === "visaSupport" || step === "offer" ||step === "understand" || step==="reason" || step === "tooExpensiveDetail" || step === "platformNotHelpfulDetail" || step === "notEnoughJobsDetail" || step === "decidedNotToMoveDetail" || step === "otherDetail") && (
            <button
              onClick={() => {
                if (step === "feedback") setStep("congrats");
                else if (step === "congrats") setStep("question");
                else if (step === "visaSupport") setStep("feedback");
                else if (step === "offer") setStep("question");
                else if (step === "understand") setStep("offer");
                else if (step === "reason") setStep("understand");
                else if (step === "tooExpensiveDetail") setStep("reason");
                else if (step === "platformNotHelpfulDetail") setStep("reason");
                else if (step === "notEnoughJobsDetail") setStep("reason");
                else if (step === "decidedNotToMoveDetail") setStep("reason");
                else if (step === "otherDetail") setStep("reason");
              }}
              className="absolute left-6 text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
          )}

           <div className="flex items-center gap-4 mx-auto">
            <h4 className="text-sm font-medium text-gray-600">
              {(step === "completeWithLawyer" || step === "completeNoLawyer")
                ? "Subscription Cancelled"
                : step === "discountConfirmation"
                ? "Subscription" 
                : "Subscription Cancellation"}
            </h4>

            {step !== "question" && step !== "discountConfirmation" && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  {/* Step 1 */}
                  <span
                    className={`w-6 h-1 rounded-full ${
                      step === "completeWithLawyer" ||
                      step === "completeNoLawyer" ||
                      step === "visaSupport" ||
                      step === "feedback"|| step === "understand" || step === "reason" || step === "tooExpensiveDetail" || step === "platformNotHelpfulDetail" || step === "notEnoughJobsDetail" || step === "decidedNotToMoveDetail" || step === "otherDetail" || step === "cancellationComplete"
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  ></span>
                  {/* Step 2 */}
                  <span
                    className={`w-6 h-1 rounded-full ${
                      step === "completeWithLawyer" ||
                      step === "completeNoLawyer" ||
                      step === "visaSupport" || 
                      step === "reason" || 
                      step === "tooExpensiveDetail" || 
                      step === "platformNotHelpfulDetail" || 
                      step === "notEnoughJobsDetail" || 
                      step === "decidedNotToMoveDetail" || 
                      step === "otherDetail" || 
                      step === "cancellationComplete"
                        ? "bg-green-500"
                        : step === "feedback" || 
                          step === "understand" 
                        ? "bg-gray-500"
                        : "bg-gray-200"
                    }`}
                  ></span>
                  {/* Step 3 */}
                  <span
                    className={`w-6 h-1 rounded-full ${
                      step === "completeWithLawyer" ||
                      step === "completeNoLawyer" || step === "cancellationComplete"
                        ? "bg-green-500"
                        : step === "visaSupport" || step === "reason" ||  
                          step === "tooExpensiveDetail" || 
                          step === "platformNotHelpfulDetail" || 
                          step === "notEnoughJobsDetail" || 
                          step === "decidedNotToMoveDetail" || 
                          step === "otherDetail" 
                        ? "bg-gray-500"
                        : "bg-gray-200"
                    }`}
                  ></span>
                </div>
                <span>
                  {(step === "completeWithLawyer" || step === "completeNoLawyer" || step === "cancellationComplete")
                    ? "completed"
                    : step === "congrats" || step === "offer"
                    ? "Step 1 of 3"
                    : step === "feedback" || step === "understand"
                    ? "Step 2 of 3"
                    : step === "visaSupport" || step === "reason" || step === "tooExpensiveDetail" || step === "platformNotHelpfulDetail" || step === "notEnoughJobsDetail" || step === "decidedNotToMoveDetail" || step === "otherDetail"
                    ? "Step 3 of 3"
                    : ""}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>




        {/* Question step */}
        {step === "question" && (
          <div className="flex flex-1">
            <div className="flex-1 p-10 flex flex-col justify-center">
              <h2 className="text-[28px] font-bold leading-snug">
                Hey mate, <br /> Quick one before you go.
              </h2>
              <h3 className="mt-2 text-xl font-bold italic">
                Have you found a job yet?
              </h3>
              <p className="mt-4 text-gray-600 text-[15px] leading-relaxed">
                Whatever your answer, we just want to help you take the next
                step. With visa support, or by hearing how we can do better.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition"
                  onClick={() => setStep("congrats")}
                >
                  Yes, I’ve found a job
                </button>
                <button
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => setStep("offer")}
                >
                  Not yet — I’m still looking
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 flex items-end overflow-hidden rounded-xl">
              <img
                src="/empire-state-compressed.jpg"
                alt="Empire State Building"
                className="w-full h-full object-cover rounded-xl shadow-md"
              />
            </div>
          </div>
        )}

        {/* Congrats step */}
        {step === "congrats" && (
          <div className="flex flex-1">
            <div className="flex-1 p-10 flex flex-col">
              <h2 className="text-[28px] font-bold mb-6">
                Congrats on the new role! 🎉
              </h2>
              <div className="space-y-6 flex-1 overflow-y-auto pr-2">
                {/* Q1 */}
                <div>
                  <p className="font-medium mb-2">
                    Did you find this job with MigrateMate?*
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setFoundWithMM("Yes")}
                      className={`flex-1 py-2 border border-gray-100 rounded-md ${
                        foundWithMM === "Yes"
                          ? "bg-purple-500 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setFoundWithMM("No")}
                      className={`flex-1 py-2 border border-gray-100 rounded-md ${
                        foundWithMM === "No"
                          ? "bg-purple-500 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
                {/* Q2 */}
                <div>
                  <p className="font-medium mb-2">
                    How many roles did you <span className="underline">apply</span> for through
                    MigrateMate?*
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    {["0", "1–5", "6–20", "20+"].map((val) => (
                      <button
                        key={val}
                        onClick={() => setRolesApplied(val)}
                        className={`py-2 border border-gray-100 rounded-md ${
                          rolesApplied === val
                            ? "bg-purple-500 text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Q3 */}
                <div>
                  <p className="font-medium mb-2">
                    How many companies did you <span className="underline">email</span> directly?*
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    {["0", "1–5", "6–20", "20+"].map((val) => (
                      <button
                        key={val}
                        onClick={() => setCompaniesEmailed(val)}
                        className={`py-2 border border-gray-100 rounded-md ${
                          companiesEmailed === val
                            ? "bg-purple-500 text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Q4 */}
                <div>
                  <p className="font-medium mb-2">
                    How many different companies did you{" "}
                    <span className="underline">interview</span> with?*
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    {["0", "1–2", "3–5", "5+"].map((val) => (
                      <button
                        key={val}
                        onClick={() => setCompaniesInterviewed(val)}
                        className={`py-2 border border-gray-100 rounded-md ${
                          companiesInterviewed === val
                            ? "bg-purple-500 text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-auto">
                <button
                  disabled={!allAnswered}
                  onClick={() => setStep("feedback")}
                  className={`w-full py-3 rounded-lg font-semibold ${
                    allAnswered
                      ? "bg-purple-500 text-white hover:bg-purple-600"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
            <div className="flex-1 p-12 flex items-end">
              <img
                src="/empire-state-compressed.jpg"
                alt="Empire State Building"
                className="w-full h-full object-cover rounded-xl shadow-md"
              />
            </div>
          </div>
        )}

        {/* Feedback step */}
        {step === "feedback" && (
          <div className="flex flex-1">
            <div className="flex-1 p-10 flex flex-col">
              <h2 className="text-[28px] font-bold mb-2">
                What’s one thing you wish we could’ve helped you with?
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                We’re always looking to improve, your thoughts can help us make
                MigrateMate more useful for others.*
              </p>

              <div className="relative w-full">
                <textarea
                  className="w-full border rounded-lg p-3 text-gray-800 focus:ring focus:ring-blue-300 pr-20"
                  rows={5}
                  maxLength={250}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <span className="absolute bottom-2 right-3 text-xs text-black">
                  Min 25 characters ({feedback.trim().length}/25)
                </span>
              </div>

              <div className="mt-auto border-t border-gray-200 pt-4">
                <button
                  disabled={feedback.trim().length < 25}
                  onClick={() => setStep("visaSupport")}
                  className={`w-full py-3 rounded-lg font-semibold ${
                    feedback.trim().length >= 25
                      ? "bg-purple-500 text-white hover:bg-purple-600"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 flex items-end overflow-hidden rounded-xl">
              <img
                src="/empire-state-compressed.jpg"
                alt="Empire State Building"
                className="w-full h-full object-cover rounded-xl shadow-md"
              />
            </div>
          </div>
        )}

        {/* Visa Support step (updated) */}
        {step === "visaSupport" && (
          <div className="flex flex-1">
            <div className="flex-1 p-10 flex flex-col">
              <h2 className="text-[28px] font-bold mb-2">
                {foundWithMM === "Yes"
                  ? "We helped you land the job, now let’s help you secure your visa."
                  : (
                    <>
                      You landed the job! <br />
                      <span className="italic font-normal">That’s what we live for.</span>
                    </>
                  )
                }
              </h2>
              <p className="text-gray-600 mb-6">
                {foundWithMM === "Yes"
                  ? "Is your company providing an immigration lawyer to help with your visa?"
                  : (
                    <>
                      Even if it wasn’t through Migrate Mate,<br />
                      let us help get your visa sorted.<br /><br />
                      Is your company providing an immigration lawyer to help with your visa?
                    </>
                  )
                }
              </p>


              <div className="space-y-3 mb-4">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="visaLawyer"
                    checked={visaLawyer === "Yes"}
                    onChange={() => {
                      setVisaLawyer("Yes");
                      setVisaType(""); 
                    }}
                  />
                  Yes
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="visaLawyer"
                    checked={visaLawyer === "No"}
                    onChange={() => {
                      setVisaLawyer("No");
                      setVisaType(""); 
                    }}
                  />
                  No
                </label>
              </div>

              {/* Show visa type input after selection */}
              {visaLawyer === "Yes" && (
                <div>
                  <p className="font-medium mb-2">
                    What visa will you be applying for?*
                  </p>
                  <input
                    type="text"
                    value={visaType}
                    onChange={(e) => setVisaType(e.target.value)}
                    className="w-full border rounded-lg p-3 text-gray-800 focus:ring focus:ring-blue-300"
                  />
                </div>
              )}

              {visaLawyer === "No" && (
                <div className="mb-2">
                  <p className="mb-2 text-gray-700">
                    We can connect you with one of our trusted partners.<br />
                    Which visa would you like to apply for?*
                  </p>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-3 text-gray-800"
                    value={visaType}
                    onChange={(e) => setVisaType(e.target.value)}
                  />
                </div>
              )}

              <div className="mt-auto border-t border-gray-200 pt-4">
                <button
                  disabled={!visaLawyer || visaType.trim() === ""}
                  onClick={handleCompleteCancellation}
                  className={`w-full py-3 rounded-lg font-semibold ${
                    visaLawyer && visaType.trim() !== ""
                      ? "bg-purple-500 text-white hover:bg-purple-600"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Complete cancellation
                </button>
              </div>
            </div>

            <div className="flex-1 p-6 flex items-end overflow-hidden rounded-xl">
              <img
                src="/empire-state-compressed.jpg"
                alt="Empire State Building"
                className="w-full h-full object-cover rounded-xl shadow-md"
              />
            </div>
          </div>
        )}

        {step === "completeNoLawyer" && (
          <div className="flex flex-1">
            <div className="flex-1 p-10 flex flex-col">
              <h2 className="text-[28px] font-bold mb-2">
                Your cancellation’s all sorted, mate, no more charges.
              </h2>
              <div className="bg-gray-100 rounded-lg p-4 flex items-start gap-3 mb-6">
                <img
                  src="/mihailo-profile.jpeg"
                  alt="Mihaii Boxlo"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900">Mihailo Bozic</div>
                  <div className="text-xs text-gray-600 mb-1">mihailo@migratemate.co</div>
                  <div className="text-gray-700 text-sm">
                    <b>I’ll be reaching out soon to help with the visa side of things.</b><br />
                    We’ve got your back, whether it’s questions, paperwork, or just figuring out your options.<br />
                    Keep an eye on your inbox, I’ll be in touch <a href="#" className="underline">shortly</a>.
                  </div>
                </div>
              </div>
              <div className="mt-auto">
                <button
                  className="w-full py-3 rounded-lg font-semibold bg-purple-400 text-white hover:bg-purple-500"
                  onClick={onClose}
                >
                  Finish
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 flex items-end overflow-hidden rounded-xl">
              <img
                src="/empire-state-compressed.jpg"
                alt="Empire State Building"
                className="w-full h-full object-cover rounded-xl shadow-md"
              />
            </div>
          </div>
        )}

        {/* Complete - No Lawyer (Image 2) */}
        {step === "completeWithLawyer" && (
          <div className="flex flex-1">
            <div className="flex-1 p-10 flex flex-col">
              <h2 className="text-[28px] font-bold mb-2">
                All done, your cancellation’s been processed.
              </h2>
              <p className="text-gray-700 mb-6">
                We’re stoked to hear you’ve landed a job and sorted your visa.<br />
                Big congrats from the team. <span role="img" aria-label="cheers">🥂</span>
              </p>
              <div className="mt-auto">
                <button
                  className="w-full py-3 rounded-lg font-semibold bg-purple-400 text-white hover:bg-purple-500"
                  onClick={onClose}
                >
                  Finish
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 flex items-end overflow-hidden rounded-xl">
              <img
                src="/empire-state-compressed.jpg"
                alt="Empire State Building"
                className="w-full h-full object-cover rounded-xl shadow-md"
              />
            </div>
          </div>
        )}
          {/* Offer step */}
{step === "offer" && (
  <div className="flex flex-1">
    <div className="flex-1 p-10 flex flex-col justify-center">
      <h2 className="text-[28px] font-bold leading-snug">
        We built this to help you land the job, this makes it a little easier.
      </h2>
      <p className="mt-4 text-gray-600 text-[15px] leading-relaxed">
        We’ve been there and we’re here to help you.
      </p>

      {/* Violet box with dynamic pricing */}
<div className="mt-6 bg-purple-100 border border-purple-300 rounded-lg p-6 text-center">
  {showDiscount ? (
    <>
      <p className="font-semibold text-black">
        {variant === "B"
          ? "Here’s $10 off until you find a job."
          : "Here’s 50% off until you find a job."}
      </p>
      <p className="text-xl font-bold text-purple-700 mt-2">
        ${discountPrice}/month{" "}
        <span className="line-through text-gray-500 ml-1">
          ${subscriptionData.monthlyPrice}
        </span>
      </p>

      <button
      className="mt-4 w-full py-3 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition"
      onClick={handleAcceptDiscount}
      >
        Get 50% off
      </button>
    </>
  ) : (
    <>
      <p className="font-semibold text-black">
        Stay with us until you find a job.
      </p>
      <p className="text-xl font-bold text-purple-700 mt-2">
        ${subscriptionData.monthlyPrice}/month
      </p>
      <button
        className="mt-4 w-full py-3 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition"
        onClick={() => setShowDiscount(true)} 
      >
        Continue
      </button>
    </>
  )}

  <p className="text-sm text-gray-600 mt-2 italic">
    You won’t be charged until your next billing date.
  </p>
</div>

      {/* No thanks button */}
      <button
        className="mt-4 w-full py-3 rounded-lg font-semibold border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        onClick={() => setStep("understand")}
      >
        No thanks
      </button>
    </div>

    {/* Right-side image */}
    <div className="flex-1 p-6 flex items-end overflow-hidden rounded-xl">
      <img
        src="/empire-state-compressed.jpg"
        alt="Empire State Building"
        className="w-full h-full object-cover rounded-xl shadow-md"
      />
    </div>
  </div>
)}



{/* Discount Confirmation Step */}
{step === "discountConfirmation" && (
  <div className="flex flex-1">
    <div className="flex-1 p-10 flex flex-col justify-center">
      <h2 className="text-[28px] font-bold leading-snug">
        Great choice, mate!
      </h2>
      <p className="mt-4 text-[28px] font-bold leading-snug">
        You’re still on the path to your dream role.{" "}
        <span className="text-purple-600">
          Let’s make it happen together!
        </span>
      </p>
      {daysLeft !== null && nextBillingDate ? (
        <p className="mt-4 text-gray-600 text-[15px] leading-relaxed">
          You’ve got {daysLeft} days left on your current plan. <br />
          Starting from {nextBillingDate}, your monthly payment will be{" "}
          <span className="font-bold">
            ${discountPrice}
          </span>.
        </p>
      ) : (
        <p className="mt-4 text-gray-600 text-[15px] leading-relaxed">
          Loading subscription details...
        </p>
      )}
      <p className="mt-2 text-gray-500 text-sm italic">
        You can cancel anytime before then.
      </p>

      {/* Separator */}
      <hr className="my-4 border-gray-200" />

      <div className="mt-6">
        <button
          className="w-full py-3 rounded-lg font-semibold bg-purple-500 text-white hover:bg-purple-600 transition"
          onClick={onClose}
        >
          Land your dream role
        </button>
      </div>
    </div>
    <div className="flex-1 p-6 flex items-end overflow-hidden rounded-xl">
      <img
        src="/empire-state-compressed.jpg"
        alt="Empire State Building"
        className="w-full h-full object-cover rounded-xl shadow-md"
      />
    </div>
  </div>
)}


        {step === "understand" && (
  <div className="flex flex-1">
    <div className="flex-1 p-10 flex flex-col">
      <h2 className="text-[28px] font-bold mb-6">
        Help us understand how you were using Migrate Mate.
      </h2>
      <div className="space-y-6 flex-1 overflow-y-auto pr-2">
        {/* Q2 */}
        <div>
          <p className="font-medium mb-2">
            How many roles did you <span className="underline">apply</span> for through
            MigrateMate?
          </p>
          <div className="grid grid-cols-4 gap-3">
            {["0", "1–5", "6–20", "20+"].map((val) => (
              <button
                key={val}
                onClick={() => setRolesApplied(val)}
                className={`py-2 border border-gray-100 rounded-md ${
                  rolesApplied === val
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
        {/* Q3 */}
        <div>
          <p className="font-medium mb-2">
            How many companies did you <span className="underline">email</span> directly?
          </p>
          <div className="grid grid-cols-4 gap-3">
            {["0", "1–5", "6–20", "20+"].map((val) => (
              <button
                key={val}
                onClick={() => setCompaniesEmailed(val)}
                className={`py-2 border border-gray-100 rounded-md ${
                  companiesEmailed === val
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
        {/* Q4 */}
        <div>
          <p className="font-medium mb-2">
            How many different companies did you{" "}
            <span className="underline">interview</span> with?
          </p>
          <div className="grid grid-cols-4 gap-3">
            {["0", "1–2", "3–5", "5+"].map((val) => (
              <button
                key={val}
                onClick={() => setCompaniesInterviewed(val)}
                className={`py-2 border border-gray-100 rounded-md ${
                  companiesInterviewed === val
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Green Discount Button */}
      <div className="mt-4">
        <button
          className="w-full py-3 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition"
          onClick={handleAcceptDiscount}
        >
          {variant === "B"
              ? `Get $10 off | $${discountPrice}`
              : `Get 50% off | $${discountPrice}`}
            <span className="line-through text-gray-200 ml-1">
              ${subscriptionData.monthlyPrice}
            </span>
        </button>
      </div>

      {/* Continue Button */}
      <div className="border-t border-gray-200 mt-2">
        <button
          disabled={!allAnswered2}
          onClick={() => setStep("reason")}
          className={`w-full py-3 rounded-lg font-semibold ${
            allAnswered2
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
    <div className="flex-1 p-12 flex items-end">
      <img
        src="/empire-state-compressed.jpg"
        alt="Empire State Building"
        className="w-full h-full object-cover rounded-xl shadow-md"
      />
    </div>
  </div>
)}
  {step === "reason" && (
  <div className="flex flex-1">
    {/* Left side */}
    <div className="flex-1 p-10 flex flex-col">
      <h2 className="text-[28px] font-bold mb-2">What’s the main reason for cancelling?</h2>
      <p className="text-gray-600 text-sm mb-4">Please take a minute to let us know why:</p>

      {/* Error message */}
      {showError && !cancelReason && (
        <p className="text-red-600 text-sm mb-3">
          To help us understand your experience, please select a reason for cancelling*
        </p>
      )}
    
      <div className="space-y-3 mb-6">
        {["Too expensive", "Platform not helpful", "Not enough relevant jobs", "Decided not to move", "Other"].map(
          (reason) => (
            <label key={reason} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="cancelReason"
                value={reason}
                checked={cancelReason === reason}
                onChange={() => {
                  setCancelReason(reason);

                  if (reason === "Too expensive") {
                    setStep("tooExpensiveDetail"); 
                  } else if (reason === "Platform not helpful") {
                    setStep("platformNotHelpfulDetail");
                  } else if (reason === "Not enough relevant jobs") {
                    setStep("notEnoughJobsDetail");
                  } else if (reason === "Decided not to move") {
                    setStep("decidedNotToMoveDetail");
                  } else if (reason === "Other") {
                    setStep("otherDetail");
                  }
                }}
              />
              {reason}
            </label>
          )
        )}
      </div>

      <div className="mt-4">
        <button
          className="w-full py-3 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition"
          onClick={handleAcceptDiscount}
        >
          {variant === "B"
              ? `Get $10 off | $${discountPrice}`
              : `Get 50% off | $${discountPrice}`}
            <span className="line-through text-gray-200 ml-1"></span>
        </button>
      </div>

          {/* Complete Cancellation Button */}
          <div className="border-t border-gray-200 mt-2">
            <button
              onClick={() => {
                if (!cancelReason) {
                  setShowError(true);
                  return;
                }
                
                setStep("cancellationComplete"); 
                
              }}
              className={`w-full py-3 rounded-lg font-semibold ${
                cancelReason
                  ? "bg-purple-500 text-white hover:bg-purple-600"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              Complete cancellation
            </button>
          </div>
        </div>

        {/* Right side */}
        <div className="flex-1 p-12 flex items-end">
          <img
            src="/empire-state-compressed.jpg"
            alt="Empire State Building"
            className="w-full h-full object-cover rounded-xl shadow-md"
          />
        </div>
      </div>
    )}

          {/* Too Expensive Page */}
          {step === "tooExpensiveDetail" && (
            <div className="flex flex-1">
              {/* Left side */}
              <div className="flex-1 p-10 flex flex-col">
                <h2 className="text-[28px] font-bold mb-2">
                  What’s the main reason?
                </h2>
                <p className="text-gray-600 text-sm mb-4 font-bold">
                  Please take a minute to let us know why:
                </p>

                <label className="flex items-center gap-3 font-medium">
                        <input type="radio" checked readOnly />
                        Too expensive
                      </label>

                <p className="text-gray-600 text-sm mb-4">
                  What would be the maximum you would be willing to pay?
                </p>

                <input
                  type="text"
                  placeholder="$"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full border rounded-lg p-3 text-gray-800 focus:ring focus:ring-blue-300"
                />

                {/* Get 50% Off Button */}
                <div className="mt-4">
                  <button
                    className="w-full py-3 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition"
                    onClick={handleAcceptDiscount}
                  >
                    {variant === "B"
                      ? `Get $10 off | $${discountPrice}`
                      : `Get 50% off | $${discountPrice}`}
                    <span className="line-through text-gray-200 ml-1">
                      ${subscriptionData.monthlyPrice}
                    </span>
                  </button>
                </div>

                {/* Complete Cancellation Button */}
                <div className="border-t border-gray-200 mt-2">
                  <button
                    onClick={() => {
                      if (!maxPrice.trim()) return; // ✅ Require input
                      setStep("cancellationComplete");
                    }}
                    className={`w-full py-3 rounded-lg font-semibold ${
                      maxPrice.trim()
                        ? "bg-purple-500 text-white hover:bg-purple-600"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!maxPrice.trim()} // ✅ Disable when empty
                  >
                    Complete cancellation
                  </button>
                </div>
              </div>

              {/* Right side */}
              <div className="flex-1 p-12 flex items-end">
                <img
                  src="/empire-state-compressed.jpg"
                  alt="Empire State Building"
                  className="w-full h-full object-cover rounded-xl shadow-md"
                />
              </div>
            </div>
          )}
        {/* Platform Not Helpful Page */}
        {step === "platformNotHelpfulDetail" && (
          <div className="flex flex-1">
            {/* Left side */}
            <div className="flex-1 p-10 flex flex-col">
              <h2 className="text-[28px] font-bold mb-2">
                What’s the main reason?
              </h2>
              <p className="text-gray-600 text-sm mb-4 font-bold">
                Please take a minute to let us know why:
              </p>
              <label className="flex items-center gap-3 font-medium">
                      <input type="radio" checked readOnly />
                      Platform not helpful
                    </label>

              <p className="text-gray-600 text-sm mb-4">
                What can we change to make the platform more helpful?*
              </p>

              <textarea
                placeholder="Type your feedback..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full border rounded-lg p-3 text-gray-800 focus:ring focus:ring-blue-300"
                rows={3}
              />

              {feedback.trim().length >= 0 && feedback.trim().length < 25 && (
                <p className="text-red-600 text-sm mt-2">
                  Please enter at least 25 characters so we can understand your feedback*
                </p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Min 25 characters ({feedback.length}/25)
              </p>

              {/* Green Discount Button */}
              <div className="mt-4">
                <button
                  className="w-full py-3 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition"
                  onClick={handleAcceptDiscount}
                >
                  {variant === "B"
                    ? `Get $10 off | $${discountPrice}`
                    : `Get 50% off | $${discountPrice}`}
                  <span className="line-through text-gray-200 ml-1">
                    ${subscriptionData.monthlyPrice}
                  </span>
                </button>
              </div>

              {/* Complete Cancellation Button */}
              <div className="border-t border-gray-200 mt-2">
                <button
                  onClick={() => {
                    if (!cancelReason) {
                      setShowError(true);
                      return;
                    }
                    if (
                      cancelReason === "Too expensive" &&
                      !maxPrice.trim()
                    ) {
                      return; // require input for too expensive
                    }
                    if (
                      cancelReason === "Platform not helpful" &&
                      feedback.trim().length < 25
                    ) {
                      return; // require at least 25 chars
                    }
                    setStep("cancellationComplete");
                  }}
                  className={`w-full py-3 rounded-lg font-semibold ${
                    cancelReason &&
                    ((cancelReason === "Too expensive" && maxPrice.trim()) ||
                      (cancelReason === "Platform not helpful" &&
                        feedback.trim().length >= 25) ||
                      (cancelReason !== "Too expensive" &&
                        cancelReason !== "Platform not helpful"))
                      ? "bg-purple-500 text-white hover:bg-purple-600"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Complete cancellation
                </button>
              </div>
            </div>

            <div className="flex-1 p-12 flex items-end">
              <img
                src="/empire-state-compressed.jpg"
                alt="Empire State Building"
                className="w-full h-full object-cover rounded-xl shadow-md"
              />
            </div>
          </div>
        )}


{/* Not Enough Relevant Jobs Page */}
{step === "notEnoughJobsDetail" && (
  <div className="flex flex-1">
    {/* Left side */}
    <div className="flex-1 p-10 flex flex-col">
      <h2 className="text-[28px] font-bold mb-2">
        What’s the main reason?
      </h2>
      <p className="text-gray-600 text-sm mb-4 font-bold">
        Please take a minute to let us know why:
      </p>

      {/* Radio pre-selected */}
      <label className="flex items-center gap-3 font-medium">
        <input type="radio" checked readOnly />
        Not enough relevant jobs
      </label>

      {/* Prompt */}
      <p className="text-gray-600 text-sm mb-4">
        In which way can we make the jobs more relevant?*
      </p>

      {/* Textarea */}
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="w-full border rounded-lg p-3 text-gray-800 focus:ring focus:ring-blue-300"
        rows={3}
      />

      {/* Validation message */}
      <p className="text-gray-500 text-xs mt-1">
        Min 25 characters ({feedback.length}/25)
      </p>

      {/* Green Discount Button */}
      <div className="mt-4">
        <button
          className="w-full py-3 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition"
          onClick={handleAcceptDiscount}
        >
          {variant === "B"
            ? `Get $10 off | $${discountPrice}`
            : `Get 50% off | $${discountPrice}`}
          <span className="line-through text-gray-200 ml-1">
            ${subscriptionData.monthlyPrice}
          </span>
        </button>
      </div>

      {/* Complete Cancellation Button */}
      <div className="border-t border-gray-200 mt-2">
        <button
          onClick={() => {
            if (feedback.trim().length < 25) {
              return; // require at least 25 characters
            }
            setStep("cancellationComplete");
          }}
          className={`w-full py-3 rounded-lg font-semibold ${
            feedback.trim().length >= 25
              ? "bg-purple-500 text-white hover:bg-purple-600"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          Complete cancellation
        </button>
      </div>
    </div>

    {/* Right side */}
    <div className="flex-1 p-12 flex items-end">
      <img
        src="/empire-state-compressed.jpg"
        alt="Empire State Building"
        className="w-full h-full object-cover rounded-xl shadow-md"
      />
    </div>
  </div>
)}


{/* Other page*/}
{step === "otherDetail" && (
  <div className="flex flex-1">
    {/* Left side */}
    <div className="flex-1 p-10 flex flex-col">
      <h2 className="text-[28px] font-bold mb-2">
        What’s the main reason?
      </h2>
      <p className="text-gray-600 text-sm mb-4 font-bold">
        Please take a minute to let us know why:
      </p>

      {/* Radio pre-selected */}
      <label className="flex items-center gap-3 font-medium">
        <input type="radio" checked readOnly />
        Other
      </label>

      {/* Prompt */}
      <p className="text-gray-600 text-sm mb-4">
        What would have helped you the most?*
      </p>

      {/* Textarea */}
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="w-full border rounded-lg p-3 text-gray-800 focus:ring focus:ring-blue-300"
        rows={3}
      />

      {/* Validation message */}
      <p className="text-gray-500 text-xs mt-1">
        Min 25 characters ({feedback.length}/25)
      </p>

      {/* Green Discount Button */}
      <div className="mt-4">
        <button
          className="w-full py-3 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition"
          onClick={handleAcceptDiscount}
        >
          {variant === "B"
            ? `Get $10 off | $${discountPrice}`
            : `Get 50% off | $${discountPrice}`}
          <span className="line-through text-gray-200 ml-1">
            ${subscriptionData.monthlyPrice}
          </span>
        </button>
      </div>

      {/* Complete Cancellation Button */}
      <div className="border-t border-gray-200 mt-2">
        <button
          onClick={() => {
            if (feedback.trim().length < 25) {
              return; // require at least 25 characters
            }
            setStep("cancellationComplete");
          }}
          className={`w-full py-3 rounded-lg font-semibold ${
            feedback.trim().length >= 25
              ? "bg-purple-500 text-white hover:bg-purple-600"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          Complete cancellation
        </button>
      </div>
    </div>

    {/* Right side */}
    <div className="flex-1 p-12 flex items-end">
      <img
        src="/empire-state-compressed.jpg"
        alt="Empire State Building"
        className="w-full h-full object-cover rounded-xl shadow-md"
      />
    </div>
  </div>
)}


            {/* Decide not to move page*/}
            {step === "decidedNotToMoveDetail" && (
              <div className="flex flex-1">
                {/* Left side */}
                <div className="flex-1 p-10 flex flex-col">
                  <h2 className="text-[28px] font-bold mb-2">
                    What’s the main reason?
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 font-bold">
                    Please take a minute to let us know why:
                  </p>

                  {/* Radio pre-selected */}
                  <label className="flex items-center gap-3 font-medium">
                    <input type="radio" checked readOnly />
                    Decided not to move
                  </label>

                  {/* Prompt */}
                  <p className="text-gray-600 text-sm mb-4">
                    What changed for you to decide to not move?*
                  </p>

                  {/* Textarea */}
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full border rounded-lg p-3 text-gray-800 focus:ring focus:ring-blue-300"
                    rows={3}
                  />

                  {/* Validation message */}
                  <p className="text-gray-500 text-xs mt-1">
                    Min 25 characters ({feedback.length}/25)
                  </p>

                  {/* Green Discount Button */}
                  <div className="mt-4">
                    <button
                      className="w-full py-3 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition"
                      onClick={handleAcceptDiscount}
                    >
                      {variant === "B"
                        ? `Get $10 off | $${discountPrice}`
                        : `Get 50% off | $${discountPrice}`}
                      <span className="line-through text-gray-200 ml-1">
                        ${subscriptionData.monthlyPrice}
                      </span>
                    </button>
                  </div>

                  {/* Complete Cancellation Button */}
                  <div className="border-t border-gray-200 mt-2">
                    <button
                      onClick={() => {
                        if (feedback.trim().length < 25) {
                          return; // require at least 25 characters
                        }
                        setStep("cancellationComplete");
                      }}
                      className={`w-full py-3 rounded-lg font-semibold ${
                        feedback.trim().length >= 25
                          ? "bg-purple-500 text-white hover:bg-purple-600"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Complete cancellation
                    </button>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex-1 p-12 flex items-end">
                  <img
                    src="/empire-state-compressed.jpg"
                    alt="Empire State Building"
                    className="w-full h-full object-cover rounded-xl shadow-md"
                  />
                </div>
              </div>
            )}

        {step === "cancellationComplete" && (
          <div className="flex flex-1">
            {/* Left side */}
            <div className="flex-1 p-10 flex flex-col">
              <h2 className="text-[28px] font-bold mb-2">
                Sorry to see you go, mate.
                <br /> Thanks for being with us, and you’re always welcome back.
              </h2>

              {nextBillingDate && daysLeft !== null ? (
                  <p className="text-gray-600 text-sm mb-4">
                    Your subscription is set to end on <b>{nextBillingDate}</b>.<br />
                    You’ll still have full access for the next {daysLeft} days.  
                    No further charges after that.
                  </p>
                ) : (
                  <p className="text-gray-600 text-sm mb-4">Loading subscription details...</p>
                )}

              <p className="text-gray-500 text-sm mb-6">
                Changed your mind? You can reactivate anytime before your end date.
              </p>

              {/* Back to Jobs Button */}
              <div className="mt-auto">
                <button
                  className="w-full py-3 rounded-lg font-semibold bg-purple-500 text-white hover:bg-purple-600 transition"
                  onClick={onClose}
                >
                  Back to Jobs
                </button>
              </div>
            </div>

            {/* Right side */}
            <div className="flex-1 p-12 flex items-end">
              <img
                src="/empire-state-compressed.jpg"
                alt="Empire State Building"
                className="w-full h-full object-cover rounded-xl shadow-md"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobStatusStep;
