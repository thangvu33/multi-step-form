const steps = document.querySelectorAll(".stp");
const circleSteps = document.querySelectorAll(".step");
const formInputs = document.querySelectorAll(".step-1 form input");
const plans = document.querySelectorAll(".plan-card");
const switcher = document.querySelector(".switch");
const addons = document.querySelectorAll(".box");
const totalStr = document.querySelector(".total p");
const total = document.querySelector(".total b");
const planPrice = document.querySelector(".plan-price");
let time;
let perTime;

let currentStep = 1;
let currentCircle = 0;
const obj = {
    plan: null,
    kind: null,
    price: null,
};




steps.forEach((step) => {
    const nextBtn = step.querySelector(".next-stp");
    const prevBtn = step.querySelector(".prev-stp");

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            document.querySelector(`.step-${currentStep}`).style.display = "none";
            circleSteps[currentCircle].classList.remove("active");
            currentStep--;
            currentCircle--;
            document.querySelector(`.step-${currentStep}`).style.display = "flex";
            circleSteps[currentCircle].classList.add("active");
            })
    }
    
    if (nextBtn) {
    nextBtn.addEventListener("click", () => {

        document.querySelector(`.step-${currentStep}`).style.display = "none";
        circleSteps[currentCircle].classList.remove("active");
        if (currentStep < 5 && validateForm()) {
            currentStep++;
            currentCircle++;
            setTotal()
        }
        document.querySelector(`.step-${currentStep}`).style.display = "flex";
        circleSteps[currentCircle].classList.add("active");
        summary(obj);
    })};
})

function summary(obj) {
    const planName = document.querySelector(".plan-name");
    const planPrice = document.querySelector(".plan-price");
    planPrice.innerHTML = `${obj.price.innerText}`;
    planName.innerHTML = `${obj.plan.innerText} (${obj.kind ? "yearly" : "monthly"})`;
}

function validateForm() {
    let valid = true;
    for (i = 0; i < formInputs.length; i++) {
        if (!formInputs[i].value) {
            valid = false;
            formInputs[i].classList.add("err");
            findLabel(formInputs[i]).nextElementSibling.style.display = "flex";
        } else {
            valid = true;
            formInputs[i].classList.remove("err");
            findLabel(formInputs[i]).nextElementSibling.style.display = "none";
        }
    }
    return valid;
}

function findLabel(el) {
    const idVal = el.id;
    const labels = document.getElementsByTagName("label");
    for (i = 0; i < labels.length; i++) {
        if (labels[i].htmlFor == idVal) return labels[i];
    }
}

plans.forEach((plan) => {
    plan.addEventListener("click", () => {
      document.querySelector(".selected").classList.remove("selected");
      plan.classList.add("selected");
      const planName = plan.querySelector("b");
      const planPrice = plan.querySelector(".plan-priced");
      obj.plan = planName;
      obj.price = planPrice;
    });
});

switcher.addEventListener("click", () => {
    const val = switcher.querySelector("input").checked;
    if (val) {
      document.querySelector(".monthly").classList.remove("sw-active");
      document.querySelector(".yearly").classList.add("sw-active");
    } else {
      document.querySelector(".monthly").classList.add("sw-active");
      document.querySelector(".yearly").classList.remove("sw-active");
    }
    switchPrice(val);
    obj.kind = val;
});

function switchPrice(checked) {
    const yearlyPrices = [90, 120, 150];
    const yearlyAddonPrices = [10, 20, 20];
    const monthlyPrices = [9, 12, 15];
    const monthlyAddonPrices = [1, 2, 2];
    const prices = document.querySelectorAll(".plan-priced");
    const addonPrices = document.querySelectorAll(".price");
    if (checked) {
        for (let i = 0; i < prices.length; i++) {
            prices[i].innerHTML = `$${yearlyPrices[i]}/yr`;
            addonPrices[i].innerHTML = `+$${yearlyAddonPrices[i]}/yr`;
        }
            setTime(true);
            setPerTime(true);
    } else {
        for (let j = 0; j < prices.length; j++) {
            prices[j].innerHTML = `$${monthlyPrices[j]}/mo`;
            addonPrices[j].innerHTML = `+$${monthlyAddonPrices[j]}/mo`;
        }
            setTime(false);
            setPerTime(false);
    }
}

addons.forEach((addon) => { 
    addon.addEventListener("click", (e) => {
        const addonSelect = addon.querySelector("input");
        const ID = addon.getAttribute("data-id");
        if (addonSelect.checked) {
            addonSelect.checked = false;
            addon.classList.remove("ad-selected");
            showAddon(ID, false);

        } else {
            addonSelect.checked = true;
            addon.classList.add("ad-selected")
            showAddon(addon, true);
            e.preventDefault();
        }
    })
})

function showAddon(ad, val) {
    const nextBtn = document.querySelector(".step-3 .next-stp")
    const temp = document.getElementsByTagName("template")[0];
    const clone = temp.content.cloneNode(true);
    const serviceName = clone.querySelector(".service-name");
    const servicePrice = clone.querySelector(".service-price");
    const serviceID = clone.querySelector(".selected-addon");
    
        if (ad && val || nextBtn) {
           serviceName.innerText = ad.querySelector("label").innerText;
           servicePrice.innerText = ad.querySelector(".price").innerText;
           serviceID.setAttribute("data-id",ad.dataset.id);
           const selectedAddons = document.querySelector(".selected-addons");
           selectedAddons.appendChild(clone);
           const selectedAddonElements = Array.from(selectedAddons.querySelectorAll(".selected-addon"));
    
           selectedAddonElements.sort((a, b) => {
             return a.dataset.id - b.dataset.id;
           });
       
           selectedAddonElements.forEach((selectedAddon, index) => {
             if (index !== selectedAddons.children.length - 1) {
               selectedAddons.insertBefore(selectedAddon, selectedAddonElements[index + 1]);
             }
           });
        } else {
            const addons = document.querySelectorAll(".selected-addon");
            addons.forEach((addon) => {
                const attr = addon.getAttribute("data-id");
                if (attr === ad) {
                    addon.remove();
                }
            })
        }
    
}

function setTotal() {
    const str = planPrice.innerHTML;
    const res = str.replace(/\D/g, "");
    const addonPrices = document.querySelectorAll(".selected-addon .service-price");
    let val = 0;
    for (let i = 0;i < addonPrices.length; i++) {
        const str = addonPrices[i].innerHTML;
        const res = str.replace(/\D/g, "");
        val += Number(res);
    }
    total.innerHTML = `$${val + Number(res)}/${time ? "yr" : "mo"}`;
    totalStr.innerHTML = `Total (per ${perTime ? "year" : "month"})`
}

function setTime(t) {
    return time = t;
}

function setPerTime(t) {
    return perTime = t;
}