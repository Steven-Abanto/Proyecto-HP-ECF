import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages.css";

const API_BASE = (import.meta.env?.VITE_API_URL) ?? "http://localhost:5066";

// Lee el uid desde localStorage: primero objeto 'auth', luego 'userId'
function getUidFromStorage() {
  const raw = localStorage.getItem("auth");
  if (raw) {
    try {
      const obj = JSON.parse(raw);
      const uid =
        obj?.uidUsuario ?? obj?.UidUsuario ?? obj?.uid ?? obj?.id ?? null;
      if (uid !== null && uid !== undefined) return uid;
    } catch {}
  }
  const legacy = localStorage.getItem("userId");
  return legacy ?? null;
}

export default function History() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAcc, setSelectedAcc] = useState("");
  const [movs, setMovs] = useState([]);
  const [loadingAcc, setLoadingAcc] = useState(false);
  const [loadingMov, setLoadingMov] = useState(false);
  const [error, setError] = useState("");

  const uid = useMemo(() => getUidFromStorage(), []);

  const navigate = useNavigate();

  const fmtMoney = (n) =>
    Number(n ?? 0).toLocaleString("es-PE", { style: "currency", currency: "PEN" });

  const fmtDate = (s) => {
    if (!s) return "";
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return s;
    return d.toLocaleString("es-PE");
  };

  // 1) Cargar cuentas del usuario
  const loadAccounts = async () => {
    if (!uid) {
      setError("No se encontró un usuario autenticado.");
      return;
    }
    setLoadingAcc(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/Cuenta/by-user/${uid}`);
      if (!res.ok) throw new Error("Error al cargar las cuentas");
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setAccounts(list);
      const firstNro = list[0]?.nroCuenta ?? list[0]?.NroCuenta ?? "";
      setSelectedAcc((prev) => prev || firstNro || "");
    } catch (e) {
      setError(e.message || "No se pudieron cargar las cuentas.");
    } finally {
      setLoadingAcc(false);
    }
  };

  // 2) Cargar movimientos por cuenta (by-account)
  const loadMovs = async (nroCuenta) => {
    if (!nroCuenta) { setMovs([]); return; }
    setLoadingMov(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/Movimiento/by-account/${nroCuenta}`);
      if (!res.ok) throw new Error("Error al cargar los movimientos");
      const data = await res.json();
      const normalized = (Array.isArray(data) ? data : []).map((m) => ({
        uidMovimiento: m.uidMovimiento ?? m.UidMovimiento,
        cuentaOrigen : m.cuentaOrigen  ?? m.CuentaOrigen,
        cuentaDestino: m.cuentaDestino ?? m.CuentaDestino,
        monto        : m.monto         ?? m.Monto,
        fecha        : m.fecha         ?? m.Fecha,
      }));
      setMovs(normalized);
    } catch (e) {
      setError(e.message || "No se pudieron cargar los movimientos.");
    } finally {
      setLoadingMov(false);
    }
  };

  // Carga inicial
  useEffect(() => { loadAccounts(); /* eslint-disable-line */ }, [uid]);

  // Cada vez que cambie la cuenta, carga su historial
  useEffect(() => { if (selectedAcc) loadMovs(selectedAcc); }, [selectedAcc]);

  // Derivado: decora Entrada/Salida y contraparte
  const visibleMovs = useMemo(() => {
    if (!selectedAcc) return [];
    return movs
      .map((m) => {
        const isSalida = m.cuentaOrigen === selectedAcc;
        return {
          ...m,
          tipo: isSalida ? "Salida" : "Entrada",
          contraparte: isSalida ? m.cuentaDestino : m.cuentaOrigen,
          montoSigned: (isSalida ? -1 : 1) * Number(m.monto ?? 0),
        };
      })
      .sort((a, b) => (new Date(b.fecha) - new Date(a.fecha)));
  }, [movs, selectedAcc]);

  const refresh = async () => {
    await loadAccounts();
    if (selectedAcc) await loadMovs(selectedAcc);
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3 gap-2">
        <h3 className="m-0">Movimientos</h3>
        <div className="d-flex gap-2">
            <button
            className="btn btn-primary"
            onClick={refresh}
            disabled={loadingAcc || loadingMov || !uid}
            >
            {loadingAcc || loadingMov ? "Actualizando..." : "Actualizar"}
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
            {accounts.length === 0 ? (
              <option value="">No hay cuentas</option>
            ) : (
              accounts.map((a) => {
                const key = a.uidCuenta ?? a.UidCuenta;
                const nro = a.nroCuenta ?? a.NroCuenta;
                const tipo = a.tipoCuenta ?? a.TipoCuenta;
                const saldo = a.saldo ?? a.Saldo;
                return (
                  <option key={key} value={nro}>
                    {nro} — {tipo} — {fmtMoney(saldo)}
                  </option>
                );
              })
            )}
          </select>
        </div>
      </div>

      {selectedAcc && visibleMovs.length === 0 && !loadingMov && !error && (
        <div className="alert alert-info">
          No se encontraron movimientos para la cuenta seleccionada.
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th style={{ minWidth: 140 }}>Fecha</th>
              <th>Tipo</th>
              <th>Contraparte</th>
              <th className="text-end">Monto</th>
            </tr>
          </thead>
          <tbody>
            {visibleMovs.map((m) => (
              <tr key={m.uidMovimiento}>
                <td>{fmtDate(m.fecha)}</td>
                <td>
                  <span className={`badge rounded-pill ${m.tipo === "Entrada" ? "bg-success" : "bg-danger"}`}>
                    {m.tipo}
                  </span>
                </td>
                <td>{m.tipo === "Salida" ? "→ " : "← "}{m.contraparte}</td>
                <td className="text-end">
                  {m.montoSigned >= 0 ? "+" : ""}
                  {fmtMoney(m.montoSigned)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(loadingAcc || loadingMov) && <div className="text-muted">Cargando datos…</div>}
    </div>
  );
}
