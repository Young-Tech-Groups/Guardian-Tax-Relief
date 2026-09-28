/* ==========================================
   GUARDIAN TAX RELIEF
   QUESTIONNAIRE + FORMSPREE
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("taxForm");

    const steps = document.querySelectorAll(".form-step");

    const progressFill =
        document.getElementById("progressFill");

    const stepText =
        document.getElementById("stepText");

    const progressPercent =
        document.getElementById("progressPercent");

    const successMessage =
        document.getElementById("successMessage");

    const year =
        document.getElementById("year");


    /* ==========================================
       CURRENT STEP
    ========================================== */

    let currentStep = 1;

    let selectedDebt = "";


    /* ==========================================
       YEAR
    ========================================== */

    if (year) {
        year.textContent = new Date().getFullYear();
    }


    /* ==========================================
       SHOW STEP
    ========================================== */

    function showStep(stepNumber) {

        steps.forEach(function (step) {
            step.classList.remove("active");
        });


        const targetStep =
            document.querySelector(
                `.form-step[data-step="${stepNumber}"]`
            );


        if (targetStep) {
            targetStep.classList.add("active");
        }


        currentStep = stepNumber;


        updateProgress();


        document
            .getElementById("questionnaire")
            .scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

    }


    /* ==========================================
       UPDATE PROGRESS
    ========================================== */

    function updateProgress() {

        let percentage;

        if (currentStep === 1) {
            percentage = 33;
        }

        else if (currentStep === 2) {
            percentage = 66;
        }

        else {
            percentage = 100;
        }


        progressFill.style.width =
            percentage + "%";


        progressPercent.textContent =
            percentage + "%";


        stepText.textContent =
            `Step ${currentStep} of 3`;

    }


    /* ==========================================
       DEBT OPTIONS
    ========================================== */

    const choiceButtons =
        document.querySelectorAll(".choice-btn");


    choiceButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            choiceButtons.forEach(function (item) {
                item.classList.remove("selected");
            });


            button.classList.add("selected");


            selectedDebt =
                button.dataset.value;


            /*
             * Store the selected debt range
             * inside the hidden form field.
             *
             * This is what allows Formspree
             * to receive the Step 1 answer.
             */

            const taxDebtField =
                document.getElementById("taxDebt");


            if (taxDebtField) {
                taxDebtField.value = selectedDebt;
            }


            document.getElementById(
                "step1Error"
            ).textContent = "";

        });

    });


    /* ==========================================
       STEP 1 → STEP 2
    ========================================== */

    document
        .getElementById("step1Next")
        .addEventListener("click", function () {

            if (!selectedDebt) {

                document.getElementById(
                    "step1Error"
                ).textContent =
                    "Please select an option to continue.";

                return;
            }


            showStep(2);

        });


    /* ==========================================
       STEP 2 → STEP 1
    ========================================== */

    document
        .getElementById("step2Back")
        .addEventListener("click", function () {

            showStep(1);

        });


    /* ==========================================
       STEP 2 → STEP 3
    ========================================== */

    document
        .getElementById("step2Next")
        .addEventListener("click", function () {

            const state =
                document.getElementById("state").value;


            if (!state) {

                document.getElementById(
                    "step2Error"
                ).textContent =
                    "Please select your state.";

                return;
            }


            document.getElementById(
                "step2Error"
            ).textContent = "";


            showStep(3);

        });


    /* ==========================================
       STEP 3 → STEP 2
    ========================================== */

    document
        .getElementById("step3Back")
        .addEventListener("click", function () {

            showStep(2);

        });


    /* ==========================================
       VALIDATE EMAIL
    ========================================== */

    function validEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email
        );

    }


    /* ==========================================
       FORM SUBMISSION
       FORMSPREE
    ========================================== */

    form.addEventListener("submit", async function (event) {

        /*
         * Stop the browser's normal form navigation
         * so we can submit to Formspree using fetch().
         */

        event.preventDefault();


        const firstName =
            document
                .getElementById("firstName")
                .value
                .trim();


        const lastName =
            document
                .getElementById("lastName")
                .value
                .trim();


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const phone =
            document
                .getElementById("phone")
                .value
                .trim();


        const consent =
            document
                .getElementById("consent")
                .checked;


        const state =
            document
                .getElementById("state")
                .value;


        const taxDebtField =
            document.getElementById("taxDebt");


        const error =
            document.getElementById("step3Error");


        error.textContent = "";


        /* ==========================================
           VALIDATION
        ========================================== */

        if (!selectedDebt) {

            error.textContent =
                "Please select your estimated tax debt.";

            showStep(1);

            return;
        }


        if (!state) {

            error.textContent =
                "Please select your state.";

            showStep(2);

            return;
        }


        if (!firstName) {

            error.textContent =
                "Please enter your first name.";

            return;
        }


        if (!lastName) {

            error.textContent =
                "Please enter your last name.";

            return;
        }


        if (!validEmail(email)) {

            error.textContent =
                "Please enter a valid email address.";

            return;
        }


        if (!phone) {

            error.textContent =
                "Please enter your phone number.";

            return;
        }


        if (!consent) {

            error.textContent =
                "Please confirm your contact preference.";

            return;
        }


        /*
         * Make absolutely sure the hidden
         * tax-debt field contains the selected value.
         */

        if (taxDebtField) {
            taxDebtField.value = selectedDebt;
        }


        /* ==========================================
           SUBMIT BUTTON
        ========================================== */

        const submitButton =
            form.querySelector(".submit-btn");


        const originalButtonText =
            submitButton.textContent;


        submitButton.disabled = true;

        submitButton.textContent =
            "Submitting...";


        /* ==========================================
           FORM DATA
        ========================================== */

        const formData =
            new FormData(form);


        /* ==========================================
           SEND TO FORMSPREE
        ========================================== */

        try {

            const response =
                await fetch(
                    "https://formspree.io/f/xyezlwky",
                    {
                        method: "POST",

                        body: formData,

                        headers: {
                            "Accept": "application/json"
                        }
                    }
                );


            /* ==========================================
               SUCCESS
            ========================================== */

            if (response.ok) {

                form.style.display = "none";


                const progressContainer =
                    document.querySelector(
                        ".progress-container"
                    );


                if (progressContainer) {

                    progressContainer.style.display =
                        "none";

                }


                successMessage.classList.add("show");


                document
                    .getElementById("questionnaire")
                    .scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });


                return;

            }


            /* ==========================================
               FORMSPREE ERROR
            ========================================== */

            let errorMessage =
                "Something went wrong. Please try again.";


            try {

                const data =
                    await response.json();


                if (
                    data &&
                    data.errors &&
                    data.errors.length
                ) {

                    errorMessage =
                        data.errors
                            .map(function (item) {
                                return item.message;
                            })
                            .join(" ");

                }

            }

            catch (jsonError) {

                /*
                 * Keep the default error message
                 * if Formspree doesn't return JSON.
                 */

            }


            error.textContent =
                errorMessage;


            submitButton.disabled = false;

            submitButton.textContent =
                originalButtonText;

        }


        /* ==========================================
           NETWORK ERROR
        ========================================== */

        catch (networkError) {

            console.error(
                "Formspree submission error:",
                networkError
            );


            error.textContent =
                "Unable to submit your request right now. Please check your internet connection and try again.";


            submitButton.disabled = false;

            submitButton.textContent =
                originalButtonText;

        }

    });


    /* ==========================================
       PHONE FORMATTING
    ========================================== */

    const phoneInput =
        document.getElementById("phone");


    if (phoneInput) {

        phoneInput.addEventListener(
            "input",
            function () {

                let numbers =
                    phoneInput.value.replace(/\D/g, "");


                /*
                 * Limit to 10 digits.
                 */

                if (numbers.length > 10) {

                    numbers =
                        numbers.substring(0, 10);

                }


                /*
                 * Format:
                 * (555) 555-5555
                 */

                if (numbers.length >= 7) {

                    phoneInput.value =
                        `(${numbers.substring(0, 3)}) ` +
                        `${numbers.substring(3, 6)}-` +
                        `${numbers.substring(6)}`;

                }

                else if (numbers.length >= 4) {

                    phoneInput.value =
                        `(${numbers.substring(0, 3)}) ` +
                        numbers.substring(3);

                }

                else {

                    phoneInput.value =
                        numbers;

                }

            }
        );

    }


    /* ==========================================
       INITIAL PROGRESS
    ========================================== */

    updateProgress();

});