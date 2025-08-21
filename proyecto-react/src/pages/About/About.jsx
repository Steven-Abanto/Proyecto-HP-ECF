import React from "react";
//Página Nosotros, solo es informativa
function About() {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 fuente-1">Préstamo Estudiantil Idatbank S.A.</h2>
      <p>
        En <strong>Idatbank S.A.</strong> impulsamos tu educación con un financiamiento
        <em>pensado para estudiantes y sus familias</em>. Nuestro préstamo estudiantil
        te ayuda a cubrir matrícula, pensiones, materiales, titulación, movilidad y
        equipos (como laptops), con procesos simples, 100% transparentes y soporte
        durante todo tu camino académico.
      </p>

      <h4 className="mt-4">Nuestra Misión</h4>
      <p>
        Acercar la educación superior y la formación técnica a más personas mediante
        un financiamiento responsable, flexible y accesible, promoviendo hábitos de
        educación financiera desde el primer día de clases.
      </p>

      <h4 className="mt-4">Nuestra Visión</h4>
      <p>
        Ser el aliado financiero de referencia para estudiantes a nivel nacional,
        reconocidos por nuestra innovación, transparencia y por acompañar cada etapa
        del proyecto educativo y profesional.
      </p>

      <h4 className="mt-4">Nuestros Valores</h4>
      <ul>
        <li><strong>Confianza:</strong> Condiciones claras, sin letras pequeñas, y comunicación directa en todo momento.</li>
        <li><strong>Responsabilidad:</strong> Evaluamos tu capacidad de pago y promovemos el crédito responsable para evitar el sobreendeudamiento.</li>
        <li><strong>Accesibilidad:</strong> Tasas preferenciales, periodos de gracia mientras estudias y cuotas alineadas al calendario académico.</li>
        <li><strong>Acompañamiento:</strong> Asesoría personalizada, simuladores de cuota y recordatorios para que te enfoques en lo importante: estudiar.</li>
        <li><strong>Inclusión:</strong> Convenios con institutos y universidades, y alternativas para primera generación y reconversión laboral.</li>
      </ul>
      <h4 className="mt-4">¿Por qué elegirnos?</h4>
      <p>
        Porque entendemos tus necesidades como estudiante y queremos ser parte de tu
        éxito académico. Con nosotros, no solo obtienes un préstamo, sino un aliado
        comprometido con tu futuro.
      </p>
      <h4 className="mt-4">Nuestro Equipo</h4>
      <p>
        Nuestro equipo está formado por profesionales apasionados por la educación y
        comprometidos con tu éxito. Trabajamos cada día para ofrecerte las mejores
        condiciones y un servicio excepcional.
      </p>

      <div className="text-center mt-5">
        <img
          src="https://png.pngtree.com/png-vector/20230407/ourmid/pngtree-return-of-investment-flat-icon-vector-png-image_6680913.png"
          alt="Equipo de trabajo Idatbank"
          className="img-fluid rounded"
          style={{ maxHeight: "400px", objectFit: "cover" }}
        />
        <p className="mt-2 text-muted">Nuestro equipo trabaja cada día para ayudarte a cumplir tus metas.</p>
      </div>
    </div>
  );
}

export default About;
