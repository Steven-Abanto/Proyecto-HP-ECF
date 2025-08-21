import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages.css";

export default function Login({
  title = "Iniciar sesión",
  apiUrl = "http://localhost:5066/api/auth/login", // POST /api/auth/login
  onLogin,
}) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    //Validaciones simples
    setError("");
    if (!id.trim()) return setError("Ingresa tu número de documento.");
    if (!password) return setError("Ingresa tu contraseña.");

    try {
      setLoading(true);
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      });

      if (!response.ok) {
        let msg = "Error en el servidor";
        if (response.status === 401) msg = "Usuario o contraseña inválidos";
        try {
          const err = await response.json();
          msg = err.message ?? msg;
        } catch {}
        throw new Error(msg);
      }

      const data = await response.json();

      //Esta parte permite guardar la sesión
      const uid =
        data.uidUsuario ??
        data.UidUsuario ??
        data.uid ??
        data.id ??
        null;

      localStorage.setItem("auth", JSON.stringify(data));
      if (uid !== null && uid !== undefined) {
        localStorage.setItem("userId", String(uid));
      }

      onLogin?.(data);
      navigate("/accounts");
    } catch (e) {
      setError(e?.message || "No se pudo iniciar sesión. Verifica tus datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-sm p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="mb-3 text-center">{title}</h3>

        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}
        
        {/* Login por número de documento y contraseña */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="id" className="form-label">
              Número de documento
            </label>
            <input
              id="id"
              type="text"
              inputMode="numeric"
              autoComplete="username"
              placeholder="Ej. 12345678"
              className="form-control"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <div className="input-group">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-100">
            {loading ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
