# Guía de Contribución

¡Gracias por tu interés en contribuir a CARTEL TV! Esta guía te ayudará a entender cómo puedes colaborar con el proyecto.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo puedo contribuir?](#cómo-puedo-contribuir)
- [Configuración del Entorno](#configuración-del-entorno)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)

## 📜 Código de Conducta

Este proyecto se adhiere a un código de conducta que todos los contribuyentes deben seguir:

- Ser respetuoso con otros contribuyentes
- Aceptar críticas constructivas
- Enfocarse en lo que es mejor para la comunidad
- Mostrar empatía hacia otros miembros

## 🤝 ¿Cómo puedo contribuir?

Hay muchas formas de contribuir a CARTEL TV:

### 1. Reportar Bugs
- Usa la plantilla de issues para bugs
- Incluye pasos para reproducir
- Especifica tu navegador y sistema operativo

### 2. Sugerir Nuevas Características
- Abre un issue describiendo la característica
- Explica por qué sería útil
- Proporciona ejemplos de uso

### 3. Mejorar Documentación
- Corregir errores tipográficos
- Mejorar explicaciones
- Agregar ejemplos
- Traducir documentación

### 4. Contribuir con Código
- Corregir bugs
- Implementar nuevas características
- Mejorar rendimiento
- Refactorizar código

## 🛠️ Configuración del Entorno

### Requisitos

- Git instalado
- Navegador web moderno
- Editor de código (VS Code, Sublime, etc.)
- Servidor web local (opcional)

### Pasos de Instalación

1. **Fork el repositorio**
   ```bash
   # Haz clic en "Fork" en GitHub
   ```

2. **Clona tu fork**
   ```bash
   git clone https://github.com/TU_USUARIO/ctvp.git
   cd ctvp
   ```

3. **Configura el repositorio upstream**
   ```bash
   git remote add upstream https://github.com/carteltvsoporte/ctvp.git
   ```

4. **Abre el proyecto**
   ```bash
   # Opción 1: Directamente en el navegador
   open index.html
   
   # Opción 2: Con servidor local
   python3 -m http.server 8000
   ```

## 🔄 Proceso de Desarrollo

### 1. Crea una rama para tu trabajo

```bash
# Actualiza tu main
git checkout main
git pull upstream main

# Crea una nueva rama
git checkout -b feature/nombre-descriptivo
# o
git checkout -b fix/descripcion-del-bug
```

### 2. Realiza tus cambios

- Escribe código limpio y legible
- Sigue los estándares de código
- Comenta código complejo
- Prueba tus cambios

### 3. Commit tus cambios

```bash
git add .
git commit -m "tipo: descripción breve del cambio"
```

**Tipos de commit**:
- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formato, punto y coma faltantes, etc.
- `refactor`: Refactorización de código
- `perf`: Mejoras de rendimiento
- `test`: Agregar tests
- `chore`: Mantenimiento

**Ejemplos**:
```bash
git commit -m "feat: agregar paginación a lista de series"
git commit -m "fix: corregir error en búsqueda de anime"
git commit -m "docs: actualizar README con nuevas instrucciones"
```

### 4. Push a tu fork

```bash
git push origin feature/nombre-descriptivo
```

### 5. Abre un Pull Request

- Ve a tu fork en GitHub
- Haz clic en "New Pull Request"
- Completa la plantilla de PR
- Espera la revisión

## 📝 Estándares de Código

### JavaScript

```javascript
// ✅ HACER
/**
 * Descripción de la función
 * @param {string} param - Descripción del parámetro
 * @returns {boolean} Descripción del retorno
 */
function miFuncion(param) {
    const resultado = procesarDatos(param);
    return resultado;
}

// ❌ NO HACER
function miFuncion(p){
var r=procesarDatos(p);return r;}
```

**Reglas**:
- Usar `const` y `let`, nunca `var`
- Nombres descriptivos en camelCase
- Funciones con un solo propósito
- Comentarios JSDoc para funciones públicas
- Indentación de 4 espacios
- Punto y coma al final de sentencias

### HTML

```html
<!-- ✅ HACER -->
<button 
    class="primary-btn" 
    aria-label="Cerrar modal"
    onclick="handleClick()">
    Cerrar
</button>

<!-- ❌ NO HACER -->
<button class="primary-btn" onclick="handleClick()">Cerrar</button>
```

**Reglas**:
- Semántica HTML5
- Atributos ARIA para accesibilidad
- Indentación consistente
- Atributos en orden lógico

### CSS

```css
/* ✅ HACER */
.media-card {
    display: flex;
    flex-direction: column;
    background-color: var(--card-bg);
    border-radius: var(--border-radius);
    transition: var(--transition);
}

/* ❌ NO HACER */
.media-card{display:flex;background:#1a1a1a;border-radius:8px}
```

**Reglas**:
- Usar variables CSS
- Nombres de clase descriptivos en kebab-case
- Agrupar propiedades relacionadas
- Mobile-first para media queries
- Comentarios para secciones

## 🔍 Proceso de Pull Request

### Antes de Enviar

- [ ] El código sigue los estándares del proyecto
- [ ] Has probado tus cambios
- [ ] Has actualizado la documentación si es necesario
- [ ] No hay errores en la consola
- [ ] El código funciona en diferentes navegadores
- [ ] Has agregado comentarios donde es necesario

### Plantilla de PR

```markdown
## Descripción
Breve descripción de los cambios realizados.

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva característica
- [ ] Mejora de rendimiento
- [ ] Refactorización
- [ ] Documentación

## ¿Cómo se ha probado?
Describe las pruebas realizadas.

## Checklist
- [ ] Mi código sigue los estándares del proyecto
- [ ] He realizado una auto-revisión
- [ ] He comentado código complejo
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan nuevos warnings
- [ ] He probado en múltiples navegadores
```

### Proceso de Revisión

1. Un mantenedor revisará tu PR
2. Pueden solicitar cambios
3. Realiza los cambios solicitados
4. Una vez aprobado, se hará merge

## 🐛 Reportar Bugs

### Antes de Reportar

- Busca si el bug ya fue reportado
- Verifica que sea reproducible
- Prueba en diferentes navegadores

### Plantilla de Bug Report

```markdown
**Descripción del Bug**
Descripción clara y concisa del problema.

**Pasos para Reproducir**
1. Ve a '...'
2. Haz clic en '...'
3. Scroll hasta '...'
4. Ver error

**Comportamiento Esperado**
Qué esperabas que sucediera.

**Comportamiento Actual**
Qué está sucediendo actualmente.

**Screenshots**
Si aplica, agrega capturas de pantalla.

**Entorno**
- Navegador: [ej. Chrome 120]
- Sistema Operativo: [ej. Windows 11]
- Versión de CTVP: [ej. 3.0.0]

**Información Adicional**
Cualquier otro contexto sobre el problema.
```

## 💡 Sugerir Mejoras

### Plantilla de Feature Request

```markdown
**¿Tu solicitud está relacionada con un problema?**
Descripción clara del problema.

**Describe la solución que te gustaría**
Descripción clara de lo que quieres que suceda.

**Describe alternativas que has considerado**
Otras soluciones o características que has considerado.

**Contexto adicional**
Cualquier otro contexto o screenshots.
```

## 🎨 Áreas que Necesitan Ayuda

Siempre estamos buscando ayuda en:

- 🐛 **Corrección de bugs** - Revisa los issues etiquetados como `bug`
- ✨ **Nuevas características** - Issues etiquetados como `enhancement`
- 📚 **Documentación** - Issues etiquetados como `documentation`
- 🎨 **UI/UX** - Mejoras de diseño e interfaz
- ♿ **Accesibilidad** - Mejoras de accesibilidad
- 🌍 **Internacionalización** - Traducciones y soporte multi-idioma
- ⚡ **Rendimiento** - Optimizaciones de velocidad

## 📞 Contacto

Si tienes preguntas sobre cómo contribuir:

- Abre un issue con la etiqueta `question`
- Envía un email a: contribute@carteltv.demo

## 🙏 Agradecimientos

¡Gracias por contribuir a CARTEL TV! Cada contribución, sin importar su tamaño, es valiosa y apreciada.

---

**¡Happy coding!** 🚀
