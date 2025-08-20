import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = (import.meta.env?.VITE_API_URL) ?? "http://localhost:5066";

// Lee el uid desde localStorage: primero objeto 'auth', luego 'userId'
function getAuth() {
  const raw = localStorage.getItem("auth");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
function getUidFromStorage() {
  const a = getAuth();
  if (a && (a.uidUsuario ?? a.UidUsuario ?? a.uid ?? a.id) != null) {
    return a.uidUsuario ?? a.UidUsuario ?? a.uid ?? a.id;
  }
  const legacy = localStorage.getItem("userId");
  return legacy ?? null;
}

export default function LoanHistory() {
  const uid = useMemo(() => getUidFromStorage(), []);

  const [accounts, setAccounts] = useState([]);
  const [details, setDetails] = useState([]);
  const [selectedAcc, setSelectedAcc] = useState("ALL");
  const [loadingAcc, setLoadingAcc] = useState(false);
  const [loadingDet, setLoadingDet] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  
  const fmtMoney = (n) =>
    Number(n ?? 0).toLocaleString("es-PE", { style: "currency", currency: "PEN" });
  const fmtPct = (n) =>
    `${Number(n ?? 0).toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
  const fmtDate = (s) => {
    if (!s) return "";
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? s : d.toLocaleString("es-PE");
  };

  // Cargar cuentas del usuario
  const loadAccounts = async () => {
    if (!uid) { setError("No hay sesión activa."); return; }
    setLoadingAcc(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/Cuenta/by-user/${uid}`);
      if (!res.ok) throw new Error("Error al cargar las cuentas.");
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setAccounts(list);
      if (list.length > 0 && selectedAcc === "ALL") {
        setSelectedAcc("ALL");
      }
    } catch (e) {
      setError(e.message || "No se pudieron cargar las cuentas.");
    } finally {
      setLoadingAcc(false);
    }
  };

  //Carga todos los detalles y luego filtra según las cuentas del usuario
  const loadDetails = async () => {
    setLoadingDet(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/PrestamoDetalle`);
      if (!res.ok) throw new Error("Error al cargar el historial de préstamos.");
      const data = await res.json();
      const arr = Array.isArray(data) ? data : [];
      //camelCase / PascalCase
      const normalized = arr.map((d) => ({
        uidDetalle: d.uidDetalle ?? d.UidDetalle,
        uidPrestamo: d.uidPrestamo ?? d.UidPrestamo,
        nroCuenta: d.nroCuenta ?? d.NroCuenta,
        montoPrestamo: d.montoPrestamo ?? d.MontoPrestamo,
        tasaInt: d.tasaInt ?? d.TasaInt,
        cuotas: d.cuotas ?? d.Cuotas,
        deudaCuota: d.deudaCuota ?? d.DeudaCuota,
        deudaTotal: d.deudaTotal ?? d.DeudaTotal,
        fecha: d.fecha ?? d.Fecha,
      }));
      setDetails(normalized);
    } catch (e) {
      setError(e.message || "No se pudo cargar el historial.");
    } finally {
      setLoadingDet(false);
    }
  };

  useEffect(() => { loadAccounts(); /* eslint-disable-line */ }, [uid]);
  useEffect(() => { loadDetails(); }, []);

  //Carga las cuentas del usuario para filtrar
  const userAccountSet = useMemo(() => {
    return new Set(
      accounts.map((a) => a.nroCuenta ?? a.NroCuenta).filter(Boolean)
    );
  }, [accounts]);

  //Filtrar: solo detalles con NroCuenta del usuario; y si hay una cuenta elegida distinta de "ALL", filtrar por esa
  const userDetails = useMemo(() => {
    const onlyMine = details.filter(d => userAccountSet.has(d.nroCuenta));
    const filtered = selectedAcc === "ALL"
      ? onlyMine
      : onlyMine.filter(d => d.nroCuenta === selectedAcc);
    return filtered.sort((a, b) => (new Date(b.fecha) - new Date(a.fecha)));
  }, [details, userAccountSet, selectedAcc]);

  const refresh = async () => {
    await loadAccounts();
    await loadDetails();
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3 gap-2">
        <h3 className="m-0">Historial de Préstamos</h3>
        <div className="d-flex gap-2">
            <button
            className="btn btn-primary"
            onClick={refresh}
            disabled={loadingAcc || loadingDet || !uid}
            >
            {loadingAcc || loadingDet ? "Actualizando..." : "Actualizar"}
            </button>
            <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/accounts")}
            >
            Volver a Cuentas
            </button>
        </div>
      </div>

      {!uid && <div className="alert alert-warning">No hay sesión activa.</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-3">
        <div className="col-12 col-md-6">
          <label htmlFor="cuentaSel" className="form-label">Cuenta</label>
          <select
            id="cuentaSel"
            className="form-select"
            value={selectedAcc}
            onChange={(e) => setSelectedAcc(e.target.value)}
            disabled={loadingAcc || accounts.length === 0}
          >
            <option value="ALL">Todas mis cuentas</option>
            {accounts.map((a) => {
              const key = a.uidCuenta ?? a.UidCuenta;
              const nro = a.nroCuenta ?? a.NroCuenta;
              const tipo = a.tipoCuenta ?? a.TipoCuenta;
              return (
                <option key={key} value={nro}>
                  {nro} — {tipo}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {userDetails.length === 0 && !loadingDet && !error && (
        <div className="alert alert-info">
          No se encontraron préstamos para el cliente seleccionado.
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th style={{ minWidth: 140 }}>Fecha</th>
              <th>Préstamo #</th>
              <th>Cuenta</th>
              <th className="text-end">Monto</th>
              <th className="text-end">Tasa</th>
              <th className="text-end">Cuotas</th>
              <th className="text-end">Cuota</th>
              <th className="text-end">Deuda Total</th>
            </tr>
          </thead>
          <tbody>
            {userDetails.map((d) => (
              <tr key={d.uidDetalle}>
                <td>{fmtDate(d.fecha)}</td>
                <td>{d.uidPrestamo}</td>
                <td>{d.nroCuenta}</td>
                <td className="text-end">{fmtMoney(d.montoPrestamo)}</td>
                <td className="text-end">{fmtPct(d.tasaInt)}</td>
                <td className="text-end">{d.cuotas}</td>
                <td className="text-end">{fmtMoney(d.deudaCuota)}</td>
                <td className="text-end">{fmtMoney(d.deudaTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(loadingAcc || loadingDet) && (
        <div className="text-muted">Cargando datos…</div>
      )}
    </div>
  );
}
