// ============================================================
//  FÊTE D'OURSBELILLE — Webhook Réservations (avec JSONP)
// ============================================================

const SHEET_NAME = "Réservations Vendredi";

function doGet(e) {
  const params = e.parameter || {};
  const callback = params.callback; // JSONP callback
  let result;

  try {
    const action = params.action;
    if      (action === "getAll")    result = getAllReservations();
    else if (action === "add")       result = addReservation(params);
    else if (action === "update")    result = updateReservation(params);
    else if (action === "delete")    result = deleteReservation(params);
    else if (action === "getConfig") result = getConfig();
    else                             result = { error: "Action inconnue: " + action };
  } catch(err) {
    result = { error: err.message };
  }

  const json = JSON.stringify(result);

  // JSONP : enveloppe dans le callback
  if (callback) {
    return ContentService
      .createTextOutput(callback + "(" + json + ")")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  return doGet(e);
}

// ── Feuille ───────────────────────────────────────────────────
function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
}

// ── Config (tarifs) ───────────────────────────────────────────
function getConfig() {
  const sheet = getSheet();
  const prixAdulte = sheet.getRange("D3").getValue() || 15;
  const prixEnfant = sheet.getRange("F3").getValue() || 8;
  return { prixAdulte, prixEnfant, ok: true };
}

// ── Lire toutes les réservations ──────────────────────────────
function getAllReservations() {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 5) return { reservations: [], ok: true };

  const data = sheet.getRange(5, 1, lastRow - 4, 9).getValues();
  const reservations = [];

  data.forEach((row, i) => {
    if (row[1] && row[1].toString().trim() !== "") {
      reservations.push({
        rowIndex:     i + 5,
        numero:       row[0],
        nomPrenom:    row[1],
        telephone:    row[2],
        adultes:      row[3],
        enfants:      row[4],
        montant:      row[5],
        paiement:     row[6],
        statut:       row[7],
        commentaires: row[8]
      });
    }
  });

  return { reservations, ok: true };
}

// ── Ajouter une réservation ───────────────────────────────────
function addReservation(params) {
  const sheet = getSheet();
  const prixAdulte = parseFloat(sheet.getRange("D3").getValue()) || 15;
  const prixEnfant = parseFloat(sheet.getRange("F3").getValue()) || 8;

  const adultes = parseInt(params.adultes) || 0;
  const enfants = parseInt(params.enfants) || 0;
  const montant = adultes * prixAdulte + enfants * prixEnfant;

  // Trouver la première ligne vide à partir de la ligne 5
  const lastRow = sheet.getLastRow();
  let targetRow = 5;
  for (let r = 5; r <= lastRow + 1; r++) {
    if (!sheet.getRange(r, 2).getValue()) { targetRow = r; break; }
  }

  const numero = targetRow - 4;

  sheet.getRange(targetRow, 1).setValue(numero);
  sheet.getRange(targetRow, 2).setValue(params.nomPrenom || "");
  sheet.getRange(targetRow, 3).setValue(params.telephone || "");
  sheet.getRange(targetRow, 4).setValue(adultes);
  sheet.getRange(targetRow, 5).setValue(enfants);
  sheet.getRange(targetRow, 6).setValue(montant);
  sheet.getRange(targetRow, 7).setValue(params.paiement || "");
  sheet.getRange(targetRow, 8).setValue(params.statut || "Non payé");
  sheet.getRange(targetRow, 9).setValue(params.commentaires || "");

  return { ok: true, rowIndex: targetRow, montant };
}

// ── Modifier une réservation ──────────────────────────────────
function updateReservation(params) {
  const sheet = getSheet();
  const rowIndex = parseInt(params.rowIndex);
  if (!rowIndex || rowIndex < 5) return { error: "Ligne invalide" };

  const prixAdulte = parseFloat(sheet.getRange("D3").getValue()) || 15;
  const prixEnfant = parseFloat(sheet.getRange("F3").getValue()) || 8;

  const adultes = parseInt(params.adultes) || 0;
  const enfants = parseInt(params.enfants) || 0;
  const montant = adultes * prixAdulte + enfants * prixEnfant;

  sheet.getRange(rowIndex, 2).setValue(params.nomPrenom || "");
  sheet.getRange(rowIndex, 3).setValue(params.telephone || "");
  sheet.getRange(rowIndex, 4).setValue(adultes);
  sheet.getRange(rowIndex, 5).setValue(enfants);
  sheet.getRange(rowIndex, 6).setValue(montant);
  sheet.getRange(rowIndex, 7).setValue(params.paiement || "");
  sheet.getRange(rowIndex, 8).setValue(params.statut || "Non payé");
  sheet.getRange(rowIndex, 9).setValue(params.commentaires || "");

  return { ok: true, montant };
}

// ── Supprimer une réservation ─────────────────────────────────
function deleteReservation(params) {
  const sheet = getSheet();
  const rowIndex = parseInt(params.rowIndex);
  if (!rowIndex || rowIndex < 5) return { error: "Ligne invalide" };

  sheet.getRange(rowIndex, 1, 1, 9).clearContent();

  return { ok: true };
}
