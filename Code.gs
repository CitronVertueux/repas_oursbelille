// ============================================================
//  FÊTE D'OURSBELILLE — Webhook Réservations
//  Coller ce code dans : Extensions > Apps Script de ton Sheet
// ============================================================

const SHEET_NAME = "Réservations Vendredi";
const HEADERS = ["N°", "Nom Prénom", "Téléphone", "Adultes", "Enfants", "Montant Total", "Mode Paiement", "Statut", "Commentaires"];

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  try {
    const params = e.parameter || {};
    const action = params.action;

    let result;

    if (action === "getAll") {
      result = getAllReservations();
    } else if (action === "add") {
      result = addReservation(params);
    } else if (action === "update") {
      result = updateReservation(params);
    } else if (action === "delete") {
      result = deleteReservation(params);
    } else if (action === "getConfig") {
      result = getConfig();
    } else {
      result = { error: "Action inconnue: " + action };
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.getSheets()[0];
  return sheet;
}

function getConfig() {
  const sheet = getSheet();
  // Lire les tarifs depuis B4 (adulte) et D4 (enfant)
  const prixAdulte = sheet.getRange("B4").getValue() || 15;
  const prixEnfant = sheet.getRange("D4").getValue() || 8;
  return { prixAdulte, prixEnfant, ok: true };
}

function getAllReservations() {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 7) return { reservations: [], ok: true };

  const data = sheet.getRange(7, 1, lastRow - 6, 9).getValues();
  const reservations = [];

  data.forEach((row, i) => {
    if (row[1] && row[1].toString().trim() !== "") {
      reservations.push({
        rowIndex: i + 7,
        numero: row[0],
        nomPrenom: row[1],
        telephone: row[2],
        adultes: row[3],
        enfants: row[4],
        montant: row[5],
        paiement: row[6],
        statut: row[7],
        commentaires: row[8]
      });
    }
  });

  return { reservations, ok: true };
}

function addReservation(params) {
  const sheet = getSheet();
  const prixAdulte = parseFloat(sheet.getRange("B4").getValue()) || 15;
  const prixEnfant = parseFloat(sheet.getRange("D4").getValue()) || 8;

  const adultes = parseInt(params.adultes) || 0;
  const enfants = parseInt(params.enfants) || 0;
  const montant = (adultes * prixAdulte) + (enfants * prixEnfant);

  // Trouver la première ligne vide à partir de la ligne 7
  let targetRow = 7;
  const lastRow = sheet.getLastRow();
  if (lastRow >= 7) {
    for (let r = 7; r <= lastRow + 1; r++) {
      const val = sheet.getRange(r, 2).getValue();
      if (!val || val.toString().trim() === "") {
        targetRow = r;
        break;
      }
    }
  }

  const numero = targetRow - 6;

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

function updateReservation(params) {
  const sheet = getSheet();
  const rowIndex = parseInt(params.rowIndex);
  if (!rowIndex || rowIndex < 7) return { error: "Ligne invalide" };

  const prixAdulte = parseFloat(sheet.getRange("B4").getValue()) || 15;
  const prixEnfant = parseFloat(sheet.getRange("D4").getValue()) || 8;

  const adultes = parseInt(params.adultes) || 0;
  const enfants = parseInt(params.enfants) || 0;
  const montant = (adultes * prixAdulte) + (enfants * prixEnfant);

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

function deleteReservation(params) {
  const sheet = getSheet();
  const rowIndex = parseInt(params.rowIndex);
  if (!rowIndex || rowIndex < 7) return { error: "Ligne invalide" };

  // Effacer uniquement les données (pas la ligne entière pour garder la mise en page)
  sheet.getRange(rowIndex, 2, 1, 8).clearContent();
  sheet.getRange(rowIndex, 1).clearContent();

  return { ok: true };
}
