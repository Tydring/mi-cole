# miCole: briefing de preparación para la reunión con tu abogado

Fecha: 17 de noviembre de 2026. Preparado como material de estudio para el fundador. **No es asesoría legal formal.** Está escrito desde la perspectiva de un abogado venezolano que asesora startups, colegios y negocios educativos en Caracas, pero no sustituye a tu abogado: todo lo marcado **[Verificar]** debe confirmarse con él, y todo lo marcado **[No verificado]** no se pudo comprobar en una fuente primaria durante esta investigación.

Convenciones: **[Fuente]** significa que el dato viene de una fuente citada al final. **[Criterio]** es razonamiento propio a partir de las fuentes. Los artículos de ley citados de memoria (sin fuente primaria abierta) van con **[Verificar]**.

---

## 1. English summary

- **There is no general personal data protection law in Venezuela as of November 2026.** Protection rests on the Constitution (art. 28 habeas data, art. 60 privacy and honor, art. 48 privacy of communications), TSJ case law, LOPNNA, the Cybercrime Law and sector rules. No data protection bill appears on the 2026 legislative agenda found. Absence of a law does not mean absence of liability: habeas data claims, LOPNNA administrative sanctions and criminal exposure all exist.
- **Images of children are the highest legal risk.** LOPNNA art. 65 forbids exposing or publishing a child's image "against their will or that of their parents or representatives", by any means. "Momentos del día" needs opt-in, specific, revocable consent per channel; Instagram posting needs a separate consent and should stay off for the pilot.
- **Medical justificativos are sensitive health data about minors.** Minimize them: restricted access, short retention, no use by you as a psychologist, ever.
- **Your biggest personal risk is your employer, not the State.** Piloting at the school where you work full time creates a conflict of interest and an IP ownership question (LOTTT arts. 320 to 326 on workers' inventions; the TSJ reportedly held that LOTTT tacitly displaced art. 59 of the Copyright Law for workers' creations). Get written authorization from the school's owner or board and a written acknowledgment that miCole is yours, before the pilot.
- **Roles:** the school should be the data controller (responsable); miCole acts as processor (encargado) under a written data processing annex, even though Venezuelan law does not use those terms.
- **Contracts needed:** pilot agreement (free, April to July 2027), service/licence agreement for paid schools (USD price, payment in Bs at BCV rate, liability cap, no SLA, data export and deletion), terms of use, privacy notice, acceptable use policy, and consent forms.
- **Sanctions:** private Venezuelan businesses are not under a comprehensive US embargo, the Government of Venezuela remained blocked as of mid 2026, and OFAC has issued successive general licenses through 2026 (banks, telecom). Risk for miCole is mainly over-compliance by US providers and payment rails, and any contract with a state-linked school. Confirm the current status in the meeting.
- **Before the free pilot:** employer authorization and IP acknowledgment, pilot agreement with data annex, privacy notice, consents (data, photos, readable messages), access controls that prevent you from seeing your colleagues' data, and SAPI trademark search. **Before the first paid contract:** a legal entity, invoicing, the service contract, and the trademark filing.

---

## 2. Lo que tienes enfrente

Te lo digo como te lo diría en la oficina: **en Venezuela no hay una ley de protección de datos personales**, pero eso no te deja en un vacío cómodo. Te deja en un terreno donde las reglas vienen de la Constitución, de la jurisprudencia del TSJ, de la LOPNNA (que es muy estricta con la imagen y la intimidad de los niños), de la ley penal de delitos informáticos y de las normas educativas del MPPE. Cuando no hay ley especial, el juez y el Consejo de Protección razonan con principios, y con niños de por medio el principio que pesa es el **interés superior del niño**. Eso significa que el estándar que te van a exigir en la práctica es alto, aunque no esté escrito en una ley de datos.

Tu producto toca cuatro zonas sensibles a la vez: **imágenes de menores**, **datos de salud de menores**, **comunicaciones privadas** (padres y docentes, con la dirección leyendo) y **datos alojados en EE. UU.** Encima, tú eres empleado del primer colegio donde quieres probarlo, y psicólogo clínico con consulta privada. Ninguna de estas cosas es un obstáculo insalvable, pero cada una necesita un papel firmado y una decisión de diseño.

La buena noticia: estás temprano. Casi todo se resuelve con documentos bien hechos y con decisiones de producto conservadoras (consentimiento previo, mínimo de datos, acceso restringido, nada público por defecto). Lo caro es arreglarlo después de un incidente con la foto de un niño o con tu empleador reclamando el software.

Contexto 2026 que tu abogado debe tener presente **[Fuente]**: tras los hechos de enero de 2026 hubo un gobierno interino, la OFAC fue emitiendo licencias generales durante todo el año (bancos en abril, telecomunicaciones en agosto) y la Asamblea Nacional tiene una agenda legislativa 2026 amplia. El marco puede cambiar rápido: pídele que te diga qué está vigente **hoy**.

---

## 3. Temas, uno por uno

### 3.1 Datos e imagen de niños, niñas y adolescentes

**Constitución (CRBV 1999).**
- **Art. 28 (habeas data):** toda persona puede acceder a los datos sobre sí misma o sus bienes que consten en registros públicos o privados, conocer su uso y finalidad, y pedir su actualización, rectificación o destrucción si son erróneos o afectan ilegítimamente sus derechos. Aplica a registros **privados**, o sea, a miCole y al colegio. **[Verificar texto exacto]**
- **Art. 60:** derecho al honor, vida privada, intimidad, propia imagen, confidencialidad y reputación; "la ley limitará el uso de la informática para garantizar el honor y la intimidad". **[Verificar texto exacto]**
- **Art. 48:** secreto e inviolabilidad de las comunicaciones privadas. Importa para la lectura de mensajes por la dirección (ver 3.7). **[Verificar]**
- **Art. 78:** niños como sujetos plenos de derecho, interés superior. **[Verificar]**

**Jurisprudencia del TSJ sobre habeas data.**
- La sentencia 1050 de la Sala Constitucional (23 de agosto de 2000) es la referencia clásica sobre habeas data y la competencia mientras no hubiera desarrollo legislativo **[Fuente]**.
- Desde la Ley Orgánica del TSJ de 2010 (G.O. 39.552, 1 de octubre de 2010), el habeas data tiene procedimiento propio en sus disposiciones transitorias (arts. 167 y ss.); según la jurisprudencia reportada, conocen los **tribunales de municipio con competencia contencioso administrativa del domicilio del solicitante**, sin incidencias y con lapsos breves **[Fuente: Acceso a la Justicia, SC 0477 de 29-10-2024 y otras]**. Traducción práctica: un representante molesto puede demandar en Caracas, rápido y barato. Tu defensa es poder responder en días: "estos son los datos de su hijo, este es su uso, aquí está la constancia de borrado".
- Doctrina citada con frecuencia: la Sala Constitucional ha desarrollado principios de protección de datos (autodeterminación informativa, finalidad, calidad, consentimiento, seguridad, temporalidad). Se cita mucho una sentencia de 2011 (n.º 1318) **[No verificado: no pude abrir el texto]**. Pídele a tu abogado que te confirme cuál es la sentencia vigente de referencia y qué principios enumera, porque esos principios son, en la práctica, tu "ley de datos".

**¿Hay ley general de datos personales?**
- **No, a noviembre de 2026** **[Fuente: Espacio Público; Baker McKenzie; búsqueda en noticias de la AN]**. La Ley de Infogobierno remite a una futura ley de protección de datos que no se ha dictado. No encontré un proyecto de ley de datos en la Agenda Legislativa 2026 publicada por la AN (sí aparece consulta sobre una ley de inteligencia artificial y otras leyes) **[Fuente]**. **[Verificar]** con tu abogado si hay algún proyecto en primera discusión que yo no haya encontrado.
- Recomendación **[Criterio]**: diseña como si existiera una ley tipo GDPR o tipo Estándares Iberoamericanos (2017). Cuesta poco, te protege ante un juez que razona con principios, y te deja listo si mañana sale la ley.

**LOPNNA** (Ley Orgánica para la Protección de Niños, Niñas y Adolescentes; reforma de 2007, G.O. 5.859 Ext., y reforma parcial de 2015, G.O. 6.185 Ext. del 8 de junio de 2015 **[Fuente para 2015; Verificar 2007]**).
- **Art. 65 (honor, reputación, propia imagen, vida privada e intimidad familiar)** **[Fuente: transcripciones judiciales; Verificar texto vigente]**. Contenido esencial:
  - Estos derechos no pueden ser objeto de injerencias arbitrarias o ilegales.
  - **Parágrafo primero:** se prohíbe exponer o divulgar, **por cualquier medio**, la imagen de niños, niñas y adolescentes **contra su voluntad o la de su padre, madre, representantes o responsables**; y se prohíbe divulgar datos, imágenes o informaciones que lesionen su honor o reputación o que sean injerencias en su vida privada.
  - **Parágrafo segundo:** prohibición absoluta de divulgar datos o imágenes que identifiquen a NNA víctimas, testigos o autores de hechos punibles.
  - Lectura práctica **[Criterio]**: la frase "contra su voluntad **o** la de sus representantes" significa que basta la objeción de **uno** de los dos. Si un niño de 11 años no quiere salir en la foto, aunque su mamá haya firmado, no se publica. Tu sistema de "falta consentimiento de foto" debe poder registrar también la negativa del propio niño, y el docente debe tener la instrucción de respetarla.
- **Arts. 67 a 69** (libertad de expresión, información, educación crítica para medios) y **art. 80** (derecho a opinar y ser oído): apoyan que los adolescentes participen en decisiones sobre su imagen **[Verificar numeración]**.
- **Art. 91 y concordantes:** el personal docente tiene deber de denunciar amenazas o violaciones de derechos de NNA **[Verificar]**. Si en un chat aparece un indicio de maltrato, el colegio tiene que actuar. miCole no investiga, pero el colegio debe tener un protocolo y miCole debe permitir conservar la evidencia (no borrado automático de un hilo marcado).
- **Sanciones:** la LOPNNA tiene un régimen de infracciones y multas (Título sobre sanciones, arts. 216 y ss.), con una infracción específica por violar el derecho al honor, reputación, propia imagen, vida privada e intimidad **[No verificado: no pude confirmar el número de artículo ni el monto; Verificar]**. Además, el Consejo de Protección puede dictar medidas, el Ministerio Público puede actuar (hay antecedentes de acciones de la Fiscalía contra medios por art. 65 **[Fuente: vLex]**) y cabe responsabilidad civil por daño moral (Código Civil, art. 1.196 **[Verificar]**).
- **"Medios de comunicación":** la LOPNNA regula expresamente los medios, pero el art. 65 dice "por cualquier medio", así que **una app escolar cerrada también cuenta**, y una cuenta de Instagram del colegio con más razón **[Criterio]**.

**Ley sobre Mensajes de Datos y Firmas Electrónicas** (Decreto-Ley 1.204, G.O. 37.148 de 28 de febrero de 2001 **[Verificar]**).
- Los mensajes de datos tienen la misma eficacia probatoria que los documentos escritos (art. 4) y satisfacen el requisito de forma escrita (art. 6) **[Verificar]**. Esto respalda los consentimientos digitales y la "confirmación de lectura" de circulares como prueba.
- La firma electrónica tiene pleno valor si está certificada por un proveedor acreditado ante SUSCERTE; si no, vale como elemento de convicción apreciado según la sana crítica **[Verificar]**. Para un consentimiento escolar, una aceptación con usuario autenticado, fecha, hora, IP y texto exacto aceptado es razonable **[Criterio]**.

**Ley de Infogobierno** (G.O. 40.274, 17 de octubre de 2013 **[Verificar]**).
- Aplica principalmente al Poder Público y a quienes presten servicios públicos con tecnologías de información; promueve software libre y soberanía tecnológica, y contiene reglas sobre datos en manos del Estado **[Fuente: texto en SITEAL/UNESCO]**.
- Para un colegio privado y miCole su aplicación directa es dudosa, pero la educación es un servicio público aunque la preste un privado (LOE). **[Verificar]** si tu abogado ve riesgo de que se aplique a planteles privados, y sobre todo **si algún día vendes a colegios públicos o subvencionados**, porque ahí entran Infogobierno, alojamiento en el extranjero y sanciones OFAC a la vez.

**Ley Especial contra los Delitos Informáticos** (G.O. 37.313, 30 de octubre de 2001 **[Fuente: OEA/WIPO Lex]**).
- **Art. 6** acceso indebido; **art. 11** espionaje informático; **art. 20** violación de la privacidad de la data o información de carácter personal (apoderarse, usar, modificar o eliminar sin consentimiento); **art. 21** violación de la privacidad de las comunicaciones; **art. 22** revelación indebida de data personal **[Fuente]**.
- Riesgos para ti como operador **[Criterio]**:
  1. Tú vas a ser "superadministrador" de una base de datos que incluye a tus propios alumnos, colegas y jefes. Si entras a ver mensajes o justificativos sin autorización del colegio, eso encaja en la descripción de los arts. 20 y 21. Necesitas una regla escrita: solo accedes a datos de un colegio con solicitud escrita del colegio (soporte técnico), y queda registro.
  2. Una brecha (por ejemplo, una política de Supabase mal configurada que expone fotos) no es delito tuyo si no hubo dolo, pero sí es fuente de responsabilidad civil, LOPNNA y reputacional.
  3. Si un padre usa la app para acosar o difundir contenido de un niño, el delito es de él, pero el colegio y tú deben poder bloquear, conservar evidencia y entregarla a la autoridad con orden.

**Ley Orgánica de Educación (LOE)** (G.O. 5.929 Ext., 15 de agosto de 2009 **[Fuente]**) **y normas del MPPE**.
- El registro y control de estudios (matrícula, notas, certificados) es competencia del MPPE y del plantel; históricamente regulado por el Reglamento de la LOE de 1986 en lo no derogado **[Fuente: UNESCO-IBE 2010; Verificar vigencia]**. miCole **no debe** presentarse como registro oficial de asistencia o de estudios: es una herramienta auxiliar del colegio. El expediente oficial sigue en el colegio y en los sistemas del MPPE.
- La idea de "expediente del estudiante que lo sigue entre colegios" (aparcada) toca directamente la competencia del MPPE y la transferencia de datos de menores entre responsables distintos. Bien aparcada.
- **Cobros:** el MPPE regula lo que los planteles privados pueden cobrar (Resolución 114 sobre matrícula **[Fuente]**; asambleas de padres para aumentos). Si el colegio quisiera trasladar tu costo a las familias como "cuota de app", eso probablemente requiere el procedimiento de aprobación correspondiente **[Verificar]**. Diseña el modelo para que lo pague el colegio de su presupuesto, como ya planeas.
- **[No verificado]** No encontré una resolución del MPPE específica sobre canales digitales de comunicación con representantes ni sobre fotos de alumnos en plataformas. Pregúntale a tu abogado si conoce alguna circular o resolución reciente.

**Datos de salud (justificativos médicos).**
- No hay en Venezuela una categoría legal de "datos sensibles" como en la GDPR, pero la salud está protegida por la intimidad (CRBV art. 60), el secreto médico (Ley de Ejercicio de la Medicina y Código de Deontología Médica) y la Ley Orgánica de Salud **[Verificar]**. Trátalos como sensibles **[Criterio]**.
- Medidas concretas: foto del justificativo visible solo para el docente guía y coordinación (no para todos los docentes), bucket privado con URLs firmadas de corta duración, borrado automático al cierre del año escolar (o antes si el colegio lo decide), nada de miniaturas en notificaciones, y una opción para que el representante entregue el original en físico y solo marque "justificado" en la app.
- **Tu rol de psicólogo:** el Código de Ética del psicólogo (Federación de Psicólogos de Venezuela) y la Ley de Ejercicio de la Psicología te obligan a secreto profesional y a evitar relaciones duales **[Verificar]**. Nunca uses datos de miCole para tu consulta, nunca captes pacientes entre las familias de la plataforma, y no tengas acceso a justificativos de tus propios alumnos más allá de lo que tenga cualquier docente guía.

### 3.2 Diseño del consentimiento

**Quién es quién (sin ley tipo GDPR).**
- **Colegio = responsable** de los datos de sus alumnos, representantes y personal: decide para qué se usan, quién los ve, cuánto tiempo se guardan. Tiene la relación jurídica con las familias (contrato de servicios educativos).
- **miCole = encargado**: trata los datos solo por cuenta e instrucciones del colegio, para prestar el servicio.
- **miCole = responsable** solo de sus propios datos de operación: cuentas de usuario para autenticación, registros de seguridad, facturación con el colegio, analítica agregada.
- Como la ley venezolana no define estas figuras, la asignación se hace **por contrato** (anexo de tratamiento de datos) **[Criterio]**. Pídele a tu abogado que use una terminología que un juez venezolano entienda ("el Colegio es titular y responsable de la información; el Prestador la custodia y procesa por cuenta del Colegio").

**Qué consentimientos necesitas y quién los recoge.**

| Consentimiento | Quién lo pide | Forma recomendada | Notas |
|---|---|---|---|
| Uso de la plataforma y tratamiento de datos del alumno y del representante | El colegio (como responsable), con texto que miCole proporciona | Digital al activar la cuenta, más cláusula en el contrato de servicios educativos o planilla de inscripción | Informar: qué datos, para qué, quién los ve, que están en servidores en EE. UU., cuánto tiempo, cómo pedir acceso o borrado |
| Fotos en "momentos del día" (canal cerrado, solo familias del salón) | El colegio | Opt-in separado, por alumno, revocable en la app | Por defecto: **no**. Registrar también la negativa del niño |
| Publicación en redes del colegio (Instagram) | El colegio | Opt-in **distinto** y específico, idealmente por publicación o por campaña | Fuera del piloto. Nunca con nombre completo ni uniforme identificable si se puede evitar |
| Justificativos médicos | El colegio | Aviso específico en el flujo de "enviar ausencia" | Alternativa sin foto siempre disponible |
| Lectura de mensajes por la dirección | El colegio | Aviso visible en el contrato, en la política y **en la propia pantalla del chat** | Es aviso y transparencia, más que consentimiento (ver 3.7) |
| Comunicaciones de miCole (correos de servicio) | miCole | Términos de uso | Sin marketing a padres sin opt-in |

**Escrito vs. digital.** Con la Ley de Mensajes de Datos, un consentimiento digital es válido y prueba. Para el piloto conviene **doble vía [Criterio]**: una planilla física firmada (colegios y padres venezolanos confían en el papel, y sirve si hay familias sin acceso) y el registro digital en la app. Guarda versión del texto, fecha, hora, usuario y la acción (aceptó o rechazó).

**Menores.** Para niños de primaria consiente el representante. Para adolescentes (12 años o más en la LOPNNA) **[Verificar]** su opinión debe ser oída y, en imagen, su negativa basta (art. 65). Si algún día los estudiantes tienen cuentas propias, necesitarás un régimen distinto (y, si van a tiendas de apps, las reglas de categoría infantil).

**Retiro del consentimiento.** Debe ser tan fácil como darlo: un interruptor en la app. Efecto: no se toman ni muestran nuevas fotos; las existentes se ocultan a las demás familias de inmediato y se borran en un plazo definido. Explica que lo ya descargado por terceros no se puede recuperar (esto debe decirse **antes** del consentimiento).

**Representantes separados o con conflicto.** Caso muy frecuente: un padre autoriza fotos y la madre no. Regla sugerida **[Criterio]**: prevalece la negativa. Y si hay una medida judicial (por ejemplo, un padre sin derecho a información o con régimen de convivencia restringido), el colegio debe poder bloquear el acceso de ese representante. Pídele a tu abogado una cláusula sobre esto.

### 3.3 Contratos

**a) Acuerdo de piloto gratuito (abril a julio de 2027).**
- Objeto: uso gratuito y de prueba, sin obligación de compra.
- Duración y fin: fecha de cierre; al terminar, el colegio elige continuar (contrato pagado) o exportar y borrar.
- Métricas que el colegio acepta compartir (activación de familias, lectura de circulares, uso por docentes), en forma agregada.
- Permiso de testimonio y de usar el nombre y logo del colegio **solo con autorización escrita adicional** y nunca con imágenes de alumnos.
- Anexo de tratamiento de datos (el mismo del contrato pagado).
- "Tal cual" (as is), sin garantía de disponibilidad, con límite de responsabilidad.
- Firma: el **representante legal del colegio** (no la coordinadora), con poder suficiente según los estatutos.

**b) Contrato de prestación de servicios / licencia de uso de software (desde septiembre 2027).** Pregúntale a tu abogado cuál figura prefiere; en SaaS suele ser prestación de servicios con licencia de uso no exclusiva **[Criterio]**. Cláusulas clave:
- **Objeto y alcance:** funcionalidades incluidas; qué no incluye (por ejemplo, no es registro oficial de estudios).
- **Precio:** USD 5 por estudiante por año, con base en matrícula a una fecha de corte. **Moneda:** precio expresado en USD como moneda de cuenta, pagadero en USD o en bolívares al tipo de cambio oficial del BCV del día de pago. La Ley del BCV (art. 128 **[Verificar]**) permite al deudor pagar en bolívares al tipo de cambio vigente salvo convención especial; redacta la cláusula a sabiendas de esto. Coordina con tu contador el IGTF (3% sobre pagos en divisas) y el IVA **[Verificar con contador]**.
- **Facturación y forma de pago:** anual o por lapsos; mora; suspensión por falta de pago con preaviso.
- **Duración y terminación:** año escolar, renovación; terminación anticipada con preaviso (30 a 60 días); terminación por incumplimiento.
- **Propiedad de los datos:** del colegio. miCole no vende ni usa los datos para otros fines; sí puede usar datos **anonimizados y agregados** para mejorar el producto.
- **Exportación y borrado:** exportación en formato estándar (CSV/JSON y archivo de fotos) dentro de X días tras el fin; borrado a los Y días, con constancia escrita. Copias de respaldo: se borran en su ciclo natural (decir cuánto).
- **Confidencialidad:** mutua, sobrevive al contrato.
- **Seguridad:** medidas razonables descritas en un anexo; notificación de incidentes al colegio en un plazo (por ejemplo, 72 horas desde que lo conoces).
- **Subencargados:** lista de proveedores (Vercel, Supabase o Firebase/Google, proveedor de correo) y aviso de cambios. Ubicación de los servidores: EE. UU. (o la región que elijas).
- **Limitación de responsabilidad:** tope igual a lo pagado en los últimos 12 meses; exclusión de daños indirectos y lucro cesante. **[Verificar]** hasta dónde un tribunal venezolano respeta el tope frente a daño moral de un menor; el dolo y la culpa grave no se pueden limitar.
- **Disponibilidad:** "esfuerzos razonables", sin SLA con porcentaje ni penalidades. Menciona fallas eléctricas y de conectividad en Venezuela como causa no imputable.
- **Obligaciones del colegio:** obtener y conservar consentimientos, designar administradores, usar la plataforma conforme a la ley, comunicar medidas judiciales que afecten a representantes.
- **Ley aplicable y jurisdicción:** ley venezolana, tribunales de Caracas; o arbitraje en el CEDCA o el Centro de Arbitraje de la Cámara de Caracas para montos mayores **[Verificar costos]**. Con colegios pequeños, tribunales ordinarios y mediación previa suele bastar.
- **Fuerza mayor, cesión, modificaciones del servicio, notificaciones por correo electrónico válidas** (apoyadas en la Ley de Mensajes de Datos).

**c) Términos de uso para representantes y docentes.** Cortos y en español claro: quién presta el servicio, que el colegio es quien administra la información, reglas de conducta, horario de mensajes, que la dirección puede leer las conversaciones, suspensión de cuentas, edad mínima, contacto.

**d) Política de privacidad (aviso de privacidad).** Dos capas: un resumen de una pantalla y el texto completo. Debe decir: datos tratados, finalidad, base (contrato educativo y consentimiento), quién accede (docentes, dirección, soporte de miCole bajo solicitud), alojamiento en EE. UU., plazos de conservación, derechos (acceso, rectificación, borrado; habeas data), cómo ejercerlos y ante quién (primero el colegio).

**e) Política de uso aceptable.** Prohíbe: acoso, insultos o amenazas entre padres y docentes; difamación; difundir capturas de pantalla de fotos de otros niños; usar la plataforma para propaganda política o comercial; suplantación. Consecuencias graduales (advertencia, suspensión, aviso a la dirección). Recuerda que las conductas graves pueden ser delito (por ejemplo, violencia contra la mujer en su modalidad de acoso, Ley Orgánica sobre el Derecho de las Mujeres a una Vida Libre de Violencia **[Verificar]**) y que el colegio conserva la evidencia. **[Verificar]** si la Ley Constitucional contra el Odio (2017) o la nueva ley "por la Convivencia Democrática, la Paz y la Tolerancia" en consulta pública en noviembre de 2026 **[Fuente: Prensa Latina]** imponen deberes de retiro de contenido a plataformas; mi lectura es que el riesgo es bajo para una app escolar cerrada, pero conviene saberlo.

### 3.4 Empleo y propiedad intelectual frente a tu colegio empleador

**El riesgo.** Eres docente a tiempo completo. Si tu colegio llegara a sostener que miCole es fruto de tu trabajo para ellos, podría reclamar titularidad o participación.

**Qué dice la ley (a confirmar).**
- **Ley sobre el Derecho de Autor** (G.O. 4.638 Ext., 1 de octubre de 1993): los programas de computación son obras protegidas **[Fuente]**. Su **art. 59** presume, salvo pacto expreso en contrario, que las obras creadas **bajo relación de trabajo o por encargo** se ceden al patrono **[Fuente]**.
- **LOTTT** (G.O. 6.076 Ext., 7 de mayo de 2012 **[Fuente]**), **arts. 320 a 326** sobre invenciones, innovaciones y mejoras: parte de que el "proceso social de trabajo" es fuente del conocimiento; distingue el sector privado y reconoce derechos del trabajador sobre sus creaciones **[Fuente parcial: solo fragmentos del 320 y 326]**.
- Según Acceso a la Justicia, la Sala Constitucional declaró decaída una acción de nulidad contra el art. 59 de la Ley de Derecho de Autor porque la **LOTTT habría derogado tácitamente** la regulación de creaciones de los trabajadores de ese artículo; hay además una decisión SC 1130 del 28-11-2024 sobre el mismo artículo **[Fuente; texto completo no verificado]**. Esto es importante y poco conocido: pídele a tu abogado que te explique qué régimen rige hoy.

**Tu posición, en principio fuerte [Criterio]:** te contrataron para dar clases de 6.º grado, no para desarrollar software; lo haces fuera de horario, con tus equipos y cuentas. El riesgo sube si: usas la laptop, el correo o la red del colegio; usas información interna (listas de alumnos, formatos de circulares, datos de representantes); desarrollas en horas de trabajo; o el colegio "participa" en el diseño durante el piloto y luego alega coautoría.

**Cómo documentar la creación independiente (hazlo ya):**
1. Lee tu contrato de trabajo y el reglamento interno: busca cláusulas de exclusividad, confidencialidad, propiedad intelectual o "actividades conflictivas". Llévalos a la reunión.
2. Repositorio en tu cuenta personal con historial de commits (fechas y horas fuera de jornada). Exporta un respaldo fechado.
3. Facturas o comprobantes de tus herramientas y servicios (dominio, Vercel, Supabase, laptop).
4. Una declaración jurada o un documento autenticado ante notaría con la descripción del software y la fecha (o el registro en SAPI, ver 3.5), como prueba de fecha cierta.
5. **Nunca** cargues datos reales del colegio en el demo. El demo con datos inventados está bien; mantenlo así.
6. Las sugerencias del colegio durante el piloto se reciben como "retroalimentación" con cláusula de que no generan derechos (cláusula estándar en el acuerdo de piloto).

**Conflicto de interés del piloto en tu propio colegio.**
- Pide **autorización escrita** al órgano con poder de decisión (dueño, junta directiva o representante legal según los estatutos), no solo a la directora académica.
- Contenido mínimo: que miCole es un proyecto personal tuyo, preexistente y ajeno a tu relación laboral; que el colegio no adquiere derechos sobre el software; que el piloto es gratuito y voluntario; que tu evaluación laboral no depende del piloto ni viceversa; que no usarás horario laboral para soporte (o, si lo haces, en qué condiciones).
- **Separación de roles:** otra persona del colegio (coordinación o dirección) es la administradora de la plataforma y la interlocutora contractual; tú no decides por el colegio si se compra. Tú no tienes acceso a datos de otros salones ni de colegas más allá del que tienes como docente; el acceso de "soporte" solo con solicitud escrita y registro.
- Si el colegio quiere comprar después, la decisión la toma quien no tiene relación contigo, y el precio debe ser el mismo de lista.
- Evalúa con tu abogado si conviene que el **segundo** colegio piloto sea uno donde no trabajes, para no depender de un piloto que siempre parecerá "de casa".

### 3.5 Propiedad intelectual

**Marca "miCole" y logo en SAPI.**
- Marco: Ley de Propiedad Industrial de 1955/1956 (vigente desde la salida de la CAN) **[Fuente: Harris Sliwoski, Bloomberg Línea]**. Bloomberg Línea reporta que en 2026 se anunció una revisión de la legislación de propiedad industrial **[Fuente]**.
- Paso 1, **búsqueda de antecedentes** (requisito previo): fonética para la denominación y gráfica para el logo, por el sistema en línea WEBPI. Fonética en unos 3 días, gráfica en 7 o más **[Fuente]**.
- Paso 2, **solicitud por clase**: Venezuela no admite solicitudes multiclase; cada clase es una solicitud con su tasa **[Fuente; hay una fuente que dice que Venezuela no usa Niza, Verificar]**. Clases candidatas: **42** (software como servicio, plataformas en línea), **9** (software descargable, app), **41** (servicios educativos, si quieres cubrir el uso educativo), **38** (servicios de mensajería, opcional). Para empezar, 42 y 9 son lo esencial **[Criterio]**.
- Paso 3, publicación en el **Boletín de la Propiedad Industrial** y plazo de **oposición de 30 días hábiles** **[Fuente]**; luego examen y concesión.
- Duración: 10 años renovables **[No verificado con fuente primaria]**. Tiempo total: suele tomar más de un año **[No verificado]**. Costo: **no pude verificar las tasas 2026**; pide presupuesto a tu abogado o agente (tasas SAPI más honorarios por clase). Pregunta si aplica alguna exoneración para emprendedores (hubo anuncios de exoneración de tasas SAPI para emprendedores, al menos en patentes **[Fuente: Finanzas Digital]**).
- Riesgo a revisar: "Mi Cole" o "MiCole" es una expresión común; puede haber marcas parecidas o el examinador puede considerarla poco distintiva para servicios escolares. El logo ayuda (marca mixta). Si la búsqueda sale con conflictos, mejor saberlo antes de imprimir nada.
- ¿Quién es el titular? Si vas a constituir empresa pronto, valora registrar a nombre de la empresa, o a tu nombre con cesión posterior (la cesión también se inscribe en SAPI) **[Verificar]**.

**Derecho de autor del software en SAPI.**
- El derecho de autor nace con la creación; el registro en la Dirección Nacional de Derecho de Autor del SAPI es **declarativo**, pero da **fecha cierta** y prueba de autoría, que es justo lo que necesitas frente a tu empleador **[Criterio; requisitos de depósito no verificados]**. Pregunta qué se deposita (descripción, extractos del código, manual) para no entregar el código completo.

**Dominio.**
- `.com.ve` lo administra NIC.VE (bajo CONATEL); se exige RIF o cédula **[Fuente: GoDaddy, nota de 2020; Verificar vigencia]**. Registra también el `.com` si está libre, a tu nombre o al de la empresa, nunca a nombre del colegio ni de un tercero.

### 3.6 Forma societaria (lado legal; coordina con tu contador)

| Opción | Pros | Contras |
|---|---|---|
| Firma personal (Registro Mercantil, Código de Comercio) | Barata, rápida, permite facturar con RIF | **Responsabilidad ilimitada**: tu patrimonio personal responde. Con datos de menores, es la opción que menos te protege |
| Compañía Anónima (C.A.) o S.R.L. | Responsabilidad limitada al capital; es lo que un colegio espera ver en un contrato | Costos de constitución, libros, obligaciones ante SENIAT, IVSS, etc. Requiere al menos dos accionistas en la práctica **[Verificar]** |
| LLC en EE. UU. | Facilita cobros en USD y cuentas en EE. UU. | No te sirve para facturar localmente a colegios que necesitan factura venezolana; posible establecimiento permanente; cumplimiento OFAC y bancario más exigente para un dueño residente en Venezuela; costos anuales |

- La responsabilidad limitada no te protege de **tus propios** hechos ilícitos (por ejemplo, si accedes indebidamente a datos), ni de la LOPNNA si eres tú quien publica, pero sí separa el patrimonio frente a reclamos contractuales **[Criterio]**.
- **Cuándo constituir [Criterio]:** antes del primer contrato pagado (septiembre 2027) es obligatorio en la práctica, por facturación. Antes del piloto es recomendable si puedes, porque el piloto ya implica custodiar fotos y datos de salud de menores. Si no llegas, firma el piloto como persona natural con límite de responsabilidad y cesión posterior del contrato a la empresa.
- Pregunta por la **Ley para el Fomento y Desarrollo de Nuevos Emprendimientos** (2021) y si ofrece alguna figura o registro simplificado útil para ti **[No verificado]**.
- Activos que deben quedar en la empresa: código (cesión de derechos de autor tuya a la empresa, por escrito), marca, dominio, cuentas de proveedores.

### 3.7 Docentes y personal del colegio

**La dirección lee los mensajes padre-docente.**
- Base para hacerlo: son comunicaciones **institucionales**, en una herramienta del colegio, sobre asuntos escolares; el colegio responde por lo que sus docentes dicen a las familias y tiene deber de protección de los alumnos.
- Límite: el art. 48 de la CRBV protege las comunicaciones privadas. La forma de mantener estos chats fuera de lo "privado" es **la transparencia previa**: todos (docentes y representantes) saben desde el primer día que la dirección puede leerlos **[Criterio; Verificar]**.
- Implementación: cláusula en el contrato de trabajo o una política interna firmada por los docentes (o al menos acuse de recibo), aviso en términos de uso, y un **aviso permanente en la pantalla del chat** ("Esta conversación es institucional y puede ser revisada por la dirección del colegio"). Registro de accesos de la dirección (quién leyó qué y cuándo), visible al menos para el colegio.
- Evita la lectura "en secreto" y evita que el docente use su WhatsApp personal como canal paralelo, porque eso derrota todo el sistema y expone al docente.
- Pregúntale a tu abogado si basta una política interna o si hace falta modificar los contratos de trabajo, y si la LOTTT o la convención colectiva aplicable dicen algo **[Verificar]**.

**Horario de atención (7:00 a.m. a 3:30 p.m.).**
- Protege la jornada y el descanso del docente (LOTTT, límites de jornada **[Verificar artículos]**). Venezuela no tiene, que yo sepa, un "derecho a la desconexión" expreso **[No verificado]**, pero un sistema que empuja mensajes de noche puede alimentar reclamos de horas extra o de condiciones de trabajo.
- Diseño: los mensajes fuera de horario se entregan, pero no se notifican al docente hasta el día hábil siguiente, y el representante ve un aviso con la hora en que se atenderá. Para urgencias reales, el colegio define un canal (teléfono de coordinación), no el docente.

### 3.8 Exposición internacional

**Alojamiento en EE. UU.**
- No hay en Venezuela una prohibición general de transferir datos personales al extranjero para el sector privado **[Criterio; Verificar]**. Debe informarse en la política de privacidad y en el contrato con el colegio, y elegir proveedores con buenas prácticas (cifrado, región definida, acuerdos de tratamiento de datos de Vercel, Supabase o Google).
- Si algún día vendes a colegios públicos, la Ley de Infogobierno y la soberanía tecnológica entran en juego.

**Sanciones de EE. UU. (OFAC), estado a 2026.**
- La Orden Ejecutiva 13884 (2019) bloqueó al **Gobierno de Venezuela** (incluye entes y empresas del Estado). Según informes de bufetes de febrero y julio de 2026, ese bloqueo **seguía vigente** y el alivio se ha dado por **licencias generales** revocables, no por derogación **[Fuente: Davis Polk vía resumen, Faegre Drinker]**.
- En 2026 la OFAC emitió, entre otras: GL 46 y siguientes (petróleo, desde enero), GL 56 (negociaciones con el Gobierno), **GL 57 (servicios financieros con ciertos bancos venezolanos, incluido el BCV y el Banco de Venezuela, abril de 2026)**, GL 58 y 59, y **GL 61/61A y 62 (telecomunicaciones, agosto de 2026)**; el 27 de agosto de 2026 enmendó varias licencias **[Fuente]**. No encontré acciones posteriores a agosto; **[Verificar]** el estado al día de la reunión en la página de la OFAC.
- Lo que significa para miCole **[Criterio]**:
  - Una empresa privada venezolana **no** está sancionada por serlo. Usar Vercel, Supabase o Google Cloud desde Venezuela no está prohibido en sí.
  - El riesgo real es: (1) que un proveedor de EE. UU. bloquee cuentas o pagos venezolanos por exceso de cumplimiento (revisa los términos de cada proveedor y ten plan B y respaldos fuera del proveedor); (2) cobrar a un colegio **vinculado al Estado** (público, de una empresa estatal, de un ministerio o de una persona en la lista SDN), lo cual puede ser una transacción prohibida para una contraparte estadounidense; (3) recibir pagos a través de bancos sancionados o no cubiertos por licencias.
  - Regla práctica: en el contrato, el colegio declara que no es entidad del Estado ni persona sancionada; tú haces una verificación simple en la lista SDN antes de firmar.
- Pagos: Stripe no atiende entidades venezolanas **[Fuente: investigación de mercado previa]**. Opciones: transferencia en bolívares a tasa BCV a una cuenta local de la empresa, USD en efectivo, Zelle a cuenta en EE. UU., o stablecoins. Cada una tiene implicaciones fiscales y de cumplimiento: decídelo con el contador y el abogado.

**Tiendas de apps (más adelante).** Si publicas en Google Play o App Store: políticas de privacidad obligatorias, formularios de seguridad de datos, y reglas especiales si la app se dirige a niños (Families Policy de Google; directrices de Apple para la categoría infantil) **[Verificar versiones vigentes]**. Mientras los usuarios sean adultos (representantes y personal), una PWA evita casi todo esto. La disponibilidad de cuentas de desarrollador y de cobros para residentes en Venezuela debe verificarse **[No verificado]**.

**Integraciones (Instagram, Google Classroom).** Publicar en Instagram es "divulgar por cualquier medio" en el sentido del art. 65 LOPNNA y además entrega las imágenes a Meta. Google Classroom implica acuerdos de Google Workspace for Education del colegio. Ambas quedan fuera del piloto **[Criterio]**.

### 3.9 Lista de riesgos por etapa

Ordenados por gravedad dentro de cada etapa.

**Antes del piloto gratuito (abril 2027):**
1. **Autorización escrita del colegio empleador y reconocimiento de que miCole es tuyo.** Sin esto, el piloto puede costarte el empleo o el software.
2. **Consentimiento de fotos opt-in, con negativa del niño y del representante, y bloqueo técnico** (sin consentimiento, el sistema no deja publicar la foto en el feed, no solo "recuerda").
3. **Control de acceso**: tú, como desarrollador y docente, sin acceso a datos de otros salones; acceso de soporte con registro; políticas de seguridad (RLS en Supabase o reglas en Firebase) probadas; buckets privados.
4. **Acuerdo de piloto con anexo de datos**, firmado por el representante legal del colegio.
5. **Aviso de privacidad y términos de uso** (versión piloto), incluido el aviso de que la dirección lee los chats.
6. **Justificativos médicos**: acceso restringido, retención corta, alternativa sin foto.
7. **Política interna para docentes** sobre lectura de mensajes y horario.
8. **Búsqueda de marca en SAPI** (barata y rápida) antes de invertir en imagen.
9. Plan de respuesta a incidentes de una página: quién avisa a quién, en cuánto tiempo.

**Antes del primer contrato pagado (septiembre 2027):**
1. **Constituir la empresa** (C.A. o la que recomiende tu abogado), RIF, facturación, y cesión del software, marca y dominio a la empresa.
2. **Contrato de servicios / licencia** con cláusulas de 3.3.b.
3. **Solicitud de marca** en SAPI (clases 42 y 9, como mínimo) y, si te lo recomiendan, registro del software.
4. Revisión de sanciones (declaración en contrato y verificación SDN) y definición de rieles de pago.
5. Versión definitiva de la política de privacidad y de uso aceptable; procedimiento para atender solicitudes de habeas data en días.
6. Seguro de responsabilidad civil o ciberriesgo si existe oferta razonable en el mercado local **[No verificado]**.

**Más adelante:**
1. Cuentas para estudiantes (régimen de menores, tiendas de apps).
2. Publicación en Instagram del colegio (consentimiento por publicación).
3. Expediente que sigue al estudiante entre colegios (requiere análisis con MPPE).
4. Perfiles de docentes (datos laborales, portabilidad).
5. Venta a colegios públicos o subvencionados (Infogobierno, OFAC).
6. Seguimiento de una eventual ley de protección de datos o de inteligencia artificial.

---

## 4. Agenda para la reunión con tu abogado (60 minutos)

| Minuto | Bloque | Objetivo |
|---|---|---|
| 0 a 5 | Contexto | Explicas miCole en 2 minutos con el demo (datos inventados); dejas claro que hoy no hay ingresos ni datos reales |
| 5 a 17 | Empleo y conflicto de interés | Revisar tu contrato de trabajo; régimen LOTTT vs. Derecho de Autor; texto de la autorización del colegio; cómo separar roles |
| 17 a 30 | Niños, fotos, salud y mensajes | Art. 65 LOPNNA, sanciones, consentimientos, lectura de chats por la dirección, justificativos, habeas data |
| 30 a 40 | Contratos | Piloto, contrato pagado, anexo de datos, términos, privacidad, uso aceptable; quién redacta qué y en qué orden |
| 40 a 48 | Empresa y PI | Firma personal vs. C.A.; cuándo constituir; SAPI marca y software; dominio |
| 48 a 55 | Internacional | Alojamiento en EE. UU., OFAC al día de hoy, cobros en USD y bolívares |
| 55 a 60 | Cierre | Presupuesto de honorarios, calendario, lista de entregables y fechas |

---

## 5. Preguntas exactas para hacerle

1. ¿Hay hoy, noviembre de 2026, algún proyecto de ley de protección de datos personales en discusión en la Asamblea Nacional? ¿Y alguna norma del MPPE sobre plataformas digitales o fotos de alumnos?
2. ¿Cuál es la sentencia del TSJ que usted toma como referencia para los principios de protección de datos, y qué principios debo cumplir en la práctica?
3. Según su lectura del art. 65 de la LOPNNA, ¿la negativa del niño basta para impedir que se muestre su foto aunque el representante haya consentido? ¿Desde qué edad?
4. ¿Cuál es el artículo y el monto de la sanción de la LOPNNA por violar la propia imagen, y quién la impone (Consejo de Protección, tribunal)? ¿Respondería el colegio, miCole o ambos?
5. ¿Un consentimiento dado en la app (usuario autenticado, fecha, hora, texto) es suficiente, o recomienda además planilla física firmada para el piloto?
6. Si dos representantes de un mismo alumno discrepan sobre las fotos, ¿qué regla debo implementar?
7. ¿Qué régimen rige hoy la titularidad de creaciones de un trabajador: LOTTT arts. 320 a 326 o el art. 59 de la Ley de Derecho de Autor? ¿Qué dice la sentencia SC 1130 de 2024?
8. Revise mi contrato de trabajo: ¿hay alguna cláusula que le permita al colegio reclamar miCole o que me impida desarrollar actividades propias?
9. ¿Quién en mi colegio tiene poder para firmar la autorización y el acuerdo de piloto? ¿Qué debe decir la autorización para protegerme?
10. ¿Puede la dirección leer los mensajes entre docentes y representantes con un simple aviso, o hace falta modificar contratos de trabajo o el reglamento interno? ¿Hay riesgo frente al art. 48 de la Constitución?
11. ¿Cómo redactamos la relación colegio responsable y miCole encargado para que un juez venezolano la entienda sin una ley de datos?
12. ¿Hasta dónde se respeta en Venezuela un tope de responsabilidad igual a 12 meses de precio, especialmente frente a daño moral de un menor?
13. ¿Cómo debe redactarse la cláusula de precio en USD con pago en bolívares a tasa BCV, considerando el art. 128 de la Ley del BCV?
14. ¿Firma personal, C.A. o S.R.L. en mi caso? ¿Puedo firmar el piloto como persona natural y ceder el contrato a la empresa después?
15. ¿Registro la marca a mi nombre o a nombre de la empresa? ¿Qué clases recomienda, cuánto cuestan hoy por clase (tasas más honorarios) y cuánto tarda?
16. ¿Vale la pena registrar el software en el SAPI? ¿Qué se deposita?
17. ¿Ve algún riesgo OFAC concreto en usar proveedores de nube estadounidenses y en cobrar a colegios privados? ¿Qué cláusula de sanciones pondría?
18. ¿Hay alguna obligación de alojar datos de alumnos en Venezuela o de informar al MPPE sobre el uso de la plataforma?
19. Si un representante interpone un habeas data contra el colegio o contra mí, ¿qué debo poder entregar y en qué plazo?
20. ¿Cuánto costaría el paquete de documentos de la sección 6, y en qué orden lo haría?

---

## 6. Documentos que deberías pedirle que redacte o revise

| Prioridad | Documento | Para cuándo |
|---|---|---|
| **Alta** | Autorización del colegio empleador y reconocimiento de titularidad de miCole | Antes de hablar formalmente del piloto |
| **Alta** | Acuerdo de piloto gratuito, con cláusula de retroalimentación sin derechos y permiso de testimonio separado | Febrero o marzo 2027 |
| **Alta** | Anexo de tratamiento de datos (colegio responsable, miCole encargado, subencargados, seguridad, incidentes, exportación y borrado) | Junto con el piloto |
| **Alta** | Formularios de consentimiento para representantes: datos, fotos en canal cerrado, justificativos; texto en app y planilla física | Junto con el piloto |
| **Alta** | Aviso de privacidad (versión corta y larga) y términos de uso | Junto con el piloto |
| **Alta** | Política interna para docentes (lectura de mensajes por la dirección, horario, conducta) | Junto con el piloto |
| Media | Política de uso aceptable y procedimiento de reportes | Junto con el piloto (versión simple) |
| Media | Contrato de prestación de servicios / licencia de uso | Junio o julio 2027 |
| Media | Documentos de constitución de la empresa y cesión de software, marca y dominio | Antes de septiembre 2027 |
| Media | Solicitud de marca en SAPI (búsqueda ya, solicitud antes de lanzar) | Búsqueda: ahora. Solicitud: antes de septiembre 2027 |
| Baja | Registro del software en SAPI o documento de fecha cierta ante notaría | Cuando lo recomiende el abogado (pronto si hay riesgo con el empleador) |
| Baja | Plan de respuesta a incidentes y protocolo de habeas data | Antes del piloto en versión de una página; formal antes de contratos pagados |
| Baja | Consentimiento específico para redes sociales del colegio | Solo si se activa la función |

---

## 7. Qué llevar a la reunión

- Tu **contrato de trabajo** con el colegio, el reglamento interno y cualquier política de confidencialidad o uso de equipos que hayas firmado.
- Una descripción de una página de miCole y el enlace al **demo con datos inventados** (o capturas).
- La **lista de datos** que trata la app: por cada función, qué datos, quién los ve, dónde se guardan, cuánto tiempo.
- Diagrama simple de arquitectura: navegador, Vercel, Supabase o Firebase, proveedor de correo; región de los servidores.
- Evidencia de creación independiente: historial del repositorio, comprobantes de pago de herramientas, fecha de inicio.
- El calendario: piloto abril a julio 2027, cobro desde septiembre 2027, precio USD 5 por alumno por año.
- La investigación de mercado previa (`research/2026-11-17-venezuela-market-research.md`) para el contexto de pagos.
- Tus preguntas de la sección 5 impresas, con espacio para notas.
- Tu presupuesto máximo para honorarios legales en esta etapa, para priorizar.

---

## 8. Lo que no debes hacer

- **No** cargues datos reales de alumnos, representantes o colegas en el demo, en pruebas ni en capturas para presentaciones.
- **No** empieces el piloto en tu colegio sin autorización escrita del órgano con poder para darla.
- **No** uses la laptop, el correo, la red ni el horario del colegio para desarrollar miCole.
- **No** te asignes acceso de superadministrador a los datos de tu colegio "por si acaso". Acceso de soporte solo con solicitud escrita y registro.
- **No** publiques fotos de alumnos por defecto ni actives la publicación en Instagram en el piloto.
- **No** uses fotos reales de niños en tu marketing, ni siquiera con permiso, en esta etapa.
- **No** mezcles miCole con tu consulta de psicología: ni datos, ni pacientes, ni publicidad cruzada a las familias.
- **No** prometas disponibilidad tipo "99,9%" ni "seguridad total" en ventas o contratos.
- **No** digas que miCole "cumple con la ley de protección de datos de Venezuela": esa ley no existe. Di que aplicas buenas prácticas internacionales y la normativa venezolana aplicable.
- **No** cobres al colegio ni firmes contratos pagados como persona natural sin hablarlo con tu abogado y tu contador.
- **No** imprimas material con la marca antes de la búsqueda en SAPI.
- **No** vendas a colegios públicos o vinculados al Estado sin un análisis específico (Infogobierno y OFAC).

---

## 9. Fuentes

**Protección de datos, Constitución y jurisprudencia**
- Espacio Público, "¿En Venezuela se regula la protección de datos personales?": https://espaciopublico.ong/en-venezuela-se-regula-la-proteccion-de-datos-personales/
- Baker McKenzie, Global Data and Cyber Handbook, Venezuela: https://resourcehub.bakermckenzie.com/en/resources/global-data-and-cyber-handbook/latin-america/venezuela/topics/key-data-and-cybersecurity-laws
- Asamblea Nacional, Agenda Legislativa 2026: https://www.asambleanacional.gob.ve/noticias/agenda-legislativa-2026-contempla-29-leyes-y-ocho-codigos
- Asamblea Nacional, consulta sobre Ley de Inteligencia Artificial: https://www.asambleanacional.gob.ve/noticias/comision-de-ciencia-planifica-consulta-publica-sobre-ley-de-inteligencia-artificial
- Prensa Latina, consulta pública de ley (noviembre 2026): https://www.prensa-latina.cu/2026/11/05/venezuela-exaltan-aportes-de-consulta-publica-sobre-proyecto-de-ley/
- TSJ, sentencia 1050 de 23-08-2000 (copia): https://www.civilisac.org/civilis/wp-content/uploads/agosto_1050-230800-00-2378-.pdf
- Acceso a la Justicia, competencia de juzgados de municipio en habeas data: https://accesoalajusticia.org/competencia-para-conocer-de-las-demandas-de-habeas-data-correspondera-a-los-juzgados-de-municipio/
- Acceso a la Justicia, SC 0477 de 29-10-2024: https://accesoalajusticia.org/wp-content/uploads/2024/11/SC-no.-0477-29-10-2024.pdf
- Universidad del Zulia, artículo sobre habeas data y autodeterminación informativa: https://produccioncientifica.luz.edu.ve/index.php/fronesis/article/download/2907/2906
- Ley de Infogobierno (texto en SITEAL/UNESCO): https://siteal.iiep.unesco.org/sites/default/files/sit_accion_files/10211.pdf

**LOPNNA**
- Transcripción judicial del art. 65 LOPNNA (vLex): https://vlexvenezuela.com/vid/ruben-remon-marichina-garc-herrero-288190894
- Acción de la Fiscalía con base en el art. 65 (vLex): https://vlexvenezuela.com/vid/fiscalia-ministerio-publico-302264606
- Acceso a la Justicia, reforma LOPNNA 2015 (G.O. 6.185 Ext.): https://accesoalajusticia.org/sistema-de-justicia-ineficiente-para-frenar-la-violencia-juvenil/

**Delitos informáticos**
- Ley Especial contra los Delitos Informáticos (OEA): https://iin.oea.org/badaj/wp-content/uploads/2014/07/Ley_Especial_contra_Delitos_Inform%c3%a1ticos.pdf
- WIPO Lex, ficha de la ley: https://www.wipo.int/wipolex/es/legislation/details/10223
- Consejo de Europa, perfil legal de Venezuela en ciberdelito: https://rm.coe.int/octocom-legal-profile-venezuela/16809e83be

**Educación**
- Ley Orgánica de Educación 2009 (Justia): https://venezuela.justia.com/estatales/miranda/leyes/ley-organica-de-educacion-2009/gdoc
- UNESCO-IBE, datos mundiales de educación, Venezuela (2010): https://webarchive.unesco.org/web/20160810124912/http://www.ibe.unesco.org/sites/default/files/Venezuela.pdf
- Acceso a la Justicia, metodología de matrícula en planteles privados: https://accesoalajusticia.org/metodologia-a-seguir-para-la-fijacion-de-la-matricula-en-instituciones-de-educacion-privadas/

**Empleo y derecho de autor**
- Acceso a la Justicia, normas aplicables a creaciones o invenciones de los trabajadores: https://accesoalajusticia.org/normas-aplicables-a-las-creaciones-o-invenciones-de-los-trabajadores/
- TSJ, SC 1130 de 28-11-2024: https://accesoalajusticia.org/wp-content/uploads/2025/01/SC-1130-28-11-2024.pdf
- Ley sobre el Derecho de Autor 1993 (WIPO Lex): https://wipolex-res.wipo.int/edocs/lexdocs/laws/es/ve/ve004es.pdf
- Reglamento de la Ley sobre el Derecho de Autor (SAPI): https://sapi.gob.ve/wp-content/uploads/2015/06/leyes/reglamento_da.pdf
- UJAP, derecho de autor en la LOTTT: https://riujap.ujap.edu.ve/bitstreams/187aa498-5367-465f-a9c4-b54d496ad120/download

**Propiedad industrial y dominios**
- Harris Sliwoski, registro de marca en Venezuela: https://harris-sliwoski.com/es/blog/registering-a-trademark-in-venezuela/
- Bloomberg Línea, registro de marcas en Venezuela: https://www.bloomberglinea.com/latinoamerica/venezuela/venezuela-vuelve-al-radar-empresarial-con-el-registro-de-marcas-esto-revela-una-firma-legal-especializada/
- Finanzas Digital, exoneración de tasas SAPI para emprendedores: https://finanzasdigital.com/gobierno-venezolano-exonerara-tasas-para-el-registro-de-patentes-de-emprendedores-ante-el-sapi/
- GoDaddy, dominios .ve (RIF o cédula): https://www.godaddy.com/es/help/about-ve-domains-9078

**Sanciones OFAC**
- OFAC, programa de sanciones de Venezuela: https://ofac.treasury.gov/sanctions-programs-and-country-information/venezuela-related-sanctions
- OFAC, acción del 27-08-2026: https://ofac.treasury.gov/recent-actions/20260827
- OFAC, acción del 21-08-2026: https://ofac.treasury.gov/recent-actions/20260821
- King & Spalding, alivio en servicios financieros: https://www.kslaw.com/insights/articles/ofac-eases-sanctions-on-financial-services-and-commercial-related-transactions-in-venezuela
- Baker McKenzie, GL 56 y 57: https://sanctionsnews.bakermckenzie.com/ofac-issues-new-venezuela-related-general-licenses-authorizing-commercial-negotiations-of-contingent-contracts-with-gov-and-financial-services-involving-named-venezuelan-banks/
- Faegre Drinker, cambios de julio de 2026: https://www.faegredrinker.com/en/insights/publications/2026/7/update-additional-changes-to-the-venezuela-sanctions-program-impacting-the-energy-minerals-financial-services-and-aviation-sectors
- Cleary Gottlieb, licencias de telecomunicaciones 2026: https://www.clearygottlieb.com/news-and-insights/publication-listing/ofac-issues-general-licenses-authorizing-activity-in-venezuelan-telecommunications-sector
- Davis Polk (actualización 2026): https://www.davispolk.com/index%2Ephp/print/pdf/node/115909

### Nota sobre lo que no se pudo verificar

- **Método:** búsquedas web genéricas (sin nombres personales ni del colegio). El entorno de investigación no permitió abrir directamente varias páginas (por ejemplo, JD Supra y Faegre Drinker), así que varios datos vienen de resúmenes de buscador de esas páginas, no de su lectura completa.
- **Textos legales citados de memoria y no confirmados en fuente primaria:** texto exacto de CRBV arts. 28, 48, 60 y 78; LOPNNA arts. 67 a 69, 80, 91 y el artículo y monto de la sanción por violación de la propia imagen; Ley de Mensajes de Datos arts. 4, 6 y firma electrónica; Ley del BCV art. 128; Código Civil art. 1.196; Ley de Infogobierno en cuanto a su aplicación a privados; LOTTT arts. 321 a 325 (solo vi fragmentos del 320 y del 326); límites de jornada en la LOTTT; existencia de un "derecho a la desconexión".
- **Jurisprudencia:** no pude abrir la sentencia de 2011 sobre principios de protección de datos (citada como n.º 1318) ni el texto completo de la SC 1130 de 2024.
- **SAPI:** no encontré las tasas vigentes de 2026, el tiempo total de registro ni los requisitos de depósito del software. Hay fuentes contradictorias sobre el uso de la Clasificación de Niza.
- **NIC.VE:** el requisito de RIF o cédula viene de una nota de 2020.
- **OFAC:** no encontré acciones posteriores al 27 de agosto de 2026; el estado del bloqueo del Gobierno de Venezuela se basa en informes de febrero y julio de 2026. Tampoco pude confirmar si la GL 25 (comunicaciones por internet, 2019) sigue vigente.
- **MPPE:** no encontré resoluciones específicas sobre plataformas digitales escolares ni fotos de alumnos.
- **Otros no verificados:** Ley para el Fomento y Desarrollo de Nuevos Emprendimientos (alcance), disponibilidad de seguros de ciberriesgo en Venezuela, disponibilidad de cuentas de desarrollador de Apple y Google para residentes en Venezuela, y si la Ley contra el Odio o la ley de convivencia en consulta afectan a plataformas cerradas.
