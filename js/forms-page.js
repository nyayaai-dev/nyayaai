/**
 * Controller for forms.html — renders the form picker, drives the step-by-step
 * wizard (with conditional steps via showIf), validates required answers, and
 * renders the generated output from js/forms-engine.js.
 */
(function () {
  const formCardsEl = document.getElementById("formCards");
  if (!formCardsEl) return; // not on forms.html

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ---------- Form picker ----------
  FORMS_DATA.forEach(function (f) {
    formCardsEl.innerHTML += '<a class="card" href="#" data-form-id="' + f.id + '">' +
      '<div class="icon">' + f.icon + "</div>" +
      "<h3>" + f.name + "</h3><p>" + f.tagline + "</p>" +
      '<div class="meta"><span class="pill">' + f.steps.length + " questions</span></div>" +
      "</a>";
  });

  let currentForm = null;
  let visibleSteps = [];
  let stepIndex = 0;
  let answers = {};

  function visibleStepsFor(form, ans) {
    return form.steps.filter(function (s) { return !s.showIf || s.showIf(ans); });
  }

  formCardsEl.addEventListener("click", function (e) {
    const card = e.target.closest("[data-form-id]");
    if (!card) return;
    e.preventDefault();
    startWizard(card.dataset.formId);
  });

  function startWizard(formId) {
    currentForm = FORMS_DATA.find(function (f) { return f.id === formId; });
    if (!currentForm) return;
    answers = {};
    stepIndex = 0;
    visibleSteps = visibleStepsFor(currentForm, answers);
    document.getElementById("formPicker").style.display = "none";
    document.getElementById("wizardSection").style.display = "block";
    document.getElementById("wizardOutput").style.display = "none";
    document.getElementById("wizardOutput").innerHTML = "";
    document.getElementById("wizardCard").style.display = "block";
    document.getElementById("wizardFormName").textContent = currentForm.icon + " " + currentForm.name;
    renderStep();
    document.getElementById("wizardSection").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.getElementById("backToPickerBtn").addEventListener("click", function () {
    document.getElementById("formPicker").style.display = "block";
    document.getElementById("wizardSection").style.display = "none";
    document.getElementById("formPicker").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  function currentStep() { return visibleSteps[stepIndex]; }

  function renderStep() {
    // Recompute visible steps each render, since a checkbox/select answer earlier
    // in the flow can change which later steps apply (e.g. divorce route).
    visibleSteps = visibleStepsFor(currentForm, answers);
    if (stepIndex >= visibleSteps.length) stepIndex = visibleSteps.length - 1;

    const step = currentStep();
    const area = document.getElementById("wizardStepArea");
    document.getElementById("wizardProgress").textContent = "Step " + (stepIndex + 1) + " of " + visibleSteps.length;
    document.getElementById("wizardProgressFill").style.width = Math.round(((stepIndex + 1) / visibleSteps.length) * 100) + "%";
    document.getElementById("wizardBackBtn").style.visibility = stepIndex === 0 ? "hidden" : "visible";
    document.getElementById("wizardNextBtn").textContent = stepIndex === visibleSteps.length - 1 ? "Generate →" : "Next →";

    const existing = answers[step.id];
    let html = "<h3>" + escapeHtml(step.q) + "</h3>";

    if (step.type === "text") {
      html += '<input type="text" class="wizard-input" id="stepInput" value="' + escapeHtml(existing || "") + '">';
    } else if (step.type === "date") {
      html += '<input type="date" class="wizard-input" id="stepInput" value="' + escapeHtml(existing || "") + '">';
    } else if (step.type === "textarea") {
      html += '<textarea class="wizard-input" id="stepInput" rows="4">' + escapeHtml(existing || "") + "</textarea>";
    } else if (step.type === "select") {
      html += '<div class="wizard-choices" id="stepChoices">' + step.options.map(function (opt) {
        return '<button type="button" class="wizard-choice' + (existing === opt ? " selected" : "") + '" data-value="' + escapeHtml(opt) + '">' + escapeHtml(opt) + "</button>";
      }).join("") + "</div>";
    } else if (step.type === "checkboxes") {
      const sel = existing || [];
      html += '<div class="wizard-choices" id="stepChoices">' + step.options.map(function (opt) {
        return '<button type="button" class="wizard-choice' + (sel.indexOf(opt) !== -1 ? " selected" : "") + '" data-value="' + escapeHtml(opt) + '">' + escapeHtml(opt) + "</button>";
      }).join("") + "</div><p class=\"small muted\" style=\"margin-top:8px\">Select all that apply.</p>";
    }
    if (step.optional) html += '<p class="small muted" style="margin-top:6px">Optional — leave blank if not applicable.</p>';

    area.innerHTML = html;

    if (step.type === "select" || step.type === "checkboxes") {
      area.querySelectorAll(".wizard-choice").forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (step.type === "select") {
            answers[step.id] = btn.dataset.value;
            area.querySelectorAll(".wizard-choice").forEach(function (b) { b.classList.remove("selected"); });
            btn.classList.add("selected");
          } else {
            const arr = answers[step.id] || [];
            const idx = arr.indexOf(btn.dataset.value);
            if (idx === -1) arr.push(btn.dataset.value); else arr.splice(idx, 1);
            answers[step.id] = arr;
            btn.classList.toggle("selected");
          }
        });
      });
    }
  }

  function saveCurrentStepValue() {
    const step = currentStep();
    if (step.type === "text" || step.type === "date" || step.type === "textarea") {
      const input = document.getElementById("stepInput");
      answers[step.id] = input ? input.value.trim() : "";
    }
  }

  function stepIsAnswered(step) {
    if (step.optional) return true;
    const v = answers[step.id];
    if (step.type === "checkboxes") return Array.isArray(v) && v.length > 0;
    return !!(v && String(v).trim());
  }

  document.getElementById("wizardNextBtn").addEventListener("click", function () {
    saveCurrentStepValue();
    const step = currentStep();
    if (!stepIsAnswered(step)) {
      const area = document.getElementById("wizardStepArea");
      if (!area.querySelector(".wizard-error")) {
        area.insertAdjacentHTML("beforeend", '<p class="small wizard-error" style="color:var(--ink-100);margin-top:8px">Please answer this question to continue.</p>');
      }
      return;
    }
    if (stepIndex < visibleSteps.length - 1) {
      stepIndex++;
      renderStep();
    } else {
      renderOutput();
    }
  });

  document.getElementById("wizardBackBtn").addEventListener("click", function () {
    saveCurrentStepValue();
    if (stepIndex > 0) { stepIndex--; renderStep(); }
  });

  // ---------- Output ----------
  let lastResult = null;

  function renderOutput() {
    const result = FormsEngine.generate(currentForm.id, answers);
    if (!result) return;
    lastResult = result;

    document.getElementById("wizardCard").style.display = "none";
    const out = document.getElementById("wizardOutput");

    let html = '<div class="card" style="padding:32px">' +
      '<div class="badge-row"><span class="pill gold">Generated for you</span></div>' +
      "<h2>" + escapeHtml(currentForm.name) + "</h2>" +
      "<p class=\"lead\">" + escapeHtml(result.summary) + "</p>";

    if (result.guidance && result.guidance.length) {
      html += "<h3 style=\"font-size:1rem;margin-top:20px\">Guidance</h3><ul>" +
        result.guidance.map(function (g) { return "<li>" + escapeHtml(g) + "</li>"; }).join("") + "</ul>";
    }
    if (result.checklist && result.checklist.length) {
      html += "<h3 style=\"font-size:1rem;margin-top:20px\">Documents / checklist</h3>" +
        result.checklist.map(function (c) { return '<div class="doc-checklist-item">☐ ' + escapeHtml(c) + "</div>"; }).join("");
    }
    if (result.relatedLawLinks && result.relatedLawLinks.length) {
      html += '<div style="margin-top:20px">' + result.relatedLawLinks.map(function (l) {
        return '<a href="' + l.href + '" class="btn btn-ghost btn-sm" style="margin-right:10px">' + escapeHtml(l.label) + " →</a>";
      }).join("") + "</div>";
    }
    html += "</div>";

    if (result.draftDocument) {
      html += '<div class="card" style="padding:32px;margin-top:20px">' +
        '<div class="badge-row"><span class="pill">Draft document</span></div>' +
        "<h3 style=\"font-size:1.1rem\">Your draft</h3>" +
        '<div class="wizard-document" id="draftDocumentText">' + escapeHtml(result.draftDocument) + "</div>" +
        '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:16px">' +
        '<button class="btn btn-ghost btn-sm" id="copyDraftBtn">📋 Copy text</button>' +
        '<button class="btn btn-primary btn-sm" id="printDraftBtn">🖨️ Print / Save as PDF</button>' +
        (currentForm.id === "legal-notice" && typeof NotificationsEngine !== "undefined" ? '<button class="btn btn-ghost btn-sm" id="remindFollowUpBtn">🔔 Remind me to follow up</button>' : "") +
        "</div><p class=\"small muted\" style=\"margin-top:10px\">This is a drafting aid, not a certified legal document — have an advocate review it before you send or file it.</p>" +
        "</div>";
    }
    if (typeof NotificationsEngine !== "undefined") NotificationsEngine.recordToolUsage(currentForm.id, { formName: currentForm.name });

    html += '<div class="center" style="margin-top:24px">' +
      '<button class="btn btn-ghost" id="startOverBtn">Start over</button>' +
      '<a href="chat.html?q=' + encodeURIComponent("I have a question about my " + currentForm.name.toLowerCase()) + '" class="btn btn-ghost" style="margin-left:12px">💬 Ask NyayaAI for more help →</a>' +
      "</div>";

    out.innerHTML = html;
    out.style.display = "block";
    out.scrollIntoView({ behavior: "smooth", block: "start" });
    if (typeof NyayaFX !== "undefined") NyayaFX.confettiBurst();

    const copyBtn = document.getElementById("copyDraftBtn");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        navigator.clipboard.writeText(result.draftDocument).then(function () {
          copyBtn.textContent = "✓ Copied";
          setTimeout(function () { copyBtn.textContent = "📋 Copy text"; }, 2000);
        }).catch(function () { /* clipboard API unavailable — user can still select and copy manually */ });
      });
    }
    const printBtn = document.getElementById("printDraftBtn");
    if (printBtn) {
      printBtn.addEventListener("click", function () {
        const area = document.getElementById("printFormArea");
        area.innerHTML = "<h1>" + escapeHtml(currentForm.name) + "</h1>" +
          "<p class='muted'>Generated " + new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) + " by NyayaAI — drafting aid only, not a certified legal document.</p>" +
          '<div class="wizard-document">' + escapeHtml(result.draftDocument) + "</div>";
        area.style.display = "block";
        window.print();
        area.style.display = "none";
      });
    }
    const remindBtn = document.getElementById("remindFollowUpBtn");
    if (remindBtn) {
      remindBtn.addEventListener("click", function () {
        const days = parseInt((answers.deadlineDays || "15").match(/\d+/)[0], 10);
        const followUp = new Date();
        followUp.setDate(followUp.getDate() + days);
        const iso = followUp.getFullYear() + "-" + String(followUp.getMonth() + 1).padStart(2, "0") + "-" + String(followUp.getDate()).padStart(2, "0");
        NotificationsEngine.addReminder({
          title: "Follow up: legal notice to " + (answers.recipientName || "recipient"),
          category: "Consultation Reminder",
          date: iso,
          notes: "Deadline given in the notice (" + answers.deadlineDays + ") has passed — check for a response and decide next steps.",
          source: "legal-notice"
        });
        remindBtn.textContent = "✓ Reminder set";
        remindBtn.disabled = true;
      });
    }
    const startOverBtn = document.getElementById("startOverBtn");
    if (startOverBtn) startOverBtn.addEventListener("click", function () { startWizard(currentForm.id); });
  }
})();
