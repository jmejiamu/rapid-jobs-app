# Reglas de Desarrollo - Rapid Jobs App

## 📋 Reglas Generales de Desarrollo

### 🏗️ Estructura de Proyecto
- **NUNCA** crear carpetas nuevas sin verificar primero la estructura existente
- **SIEMPRE** usar las carpetas ya establecidas en el proyecto
- Verificar con `ls` la estructura antes de crear cualquier archivo
- Mantener la organización establecida en el proyecto

### 🔍 Antes de Codificar
1. **Analizar el código existente** - Revisar patrones, convenciones y estructura
2. **Verificar dependencias** - Comprobar package.json antes de usar librerías
3. **Revisar componentes existentes** - Reutilizar antes de crear nuevos
4. **Entender el contexto** - Leer archivos relacionados para mantener consistencia

## 🎯 Reglas Específicas por Tecnología

### ⚛️ React/Expo (Frontend)
```typescript
// ✅ CORRECTO - Componente funcional con TypeScript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const CustomButton: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary',
  disabled = false 
}) => {
  return (
    <TouchableOpacity 
      style={[styles.button, styles[variant], disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};
```

#### Reglas React/Expo:
- **TypeScript obligatorio** - Todos los componentes deben tener tipos definidos
- **Props interface** - Siempre definir interfaces para props
- **Naming conventions** - PascalCase para componentes, camelCase para funciones
- **Hooks personalizados** - Crear hooks reutilizables para lógica compleja
- **Estado local mínimo** - Usar Context/Redux para estado global
- **Componentes puros** - Evitar efectos secundarios innecesarios
- **Responsive design** - Usar Flexbox y dimensiones relativas

### 🟢 Node.js (Backend)
```typescript
// ✅ CORRECTO - Controlador con manejo de errores
export const createJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, salary, company } = req.body;
    
    // Validación
    if (!title || !description || !company) {
      res.status(400).json({
        success: false,
        message: 'Campos requeridos: title, description, company'
      });
      return;
    }

    const job = new Job({ title, description, salary, company });
    await job.save();

    res.status(201).json({
      success: true,
      data: job,
      message: 'Trabajo creado exitosamente'
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
```

#### Reglas Node.js:
- **Async/await obligatorio** - No usar callbacks ni promises sin async/await
- **Manejo de errores robusto** - Try-catch en todas las operaciones asíncronas
- **Validación de entrada** - Validar todos los datos de entrada
- **Respuestas consistentes** - Formato estándar para todas las respuestas API
- **Middleware personalizado** - Crear middleware reutilizable
- **Logging apropiado** - Usar console.error para errores, console.log para debug
- **Variables de entorno** - Usar .env para configuración sensible

### 🍃 MongoDB
```typescript
// ✅ CORRECTO - Schema con validaciones
import { Schema, model, Document } from 'mongoose';

interface IJob extends Document {
  title: string;
  description: string;
  salary?: number;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    maxLength: [100, 'El título no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true,
    maxLength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  salary: {
    type: Number,
    min: [0, 'El salario no puede ser negativo']
  },
  company: {
    type: String,
    required: [true, 'La empresa es requerida'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'La ubicación es requerida'],
    trim: true
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract'],
    required: [true, 'El tipo de trabajo es requerido']
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

export const Job = model<IJob>('Job', jobSchema);
```

#### Reglas MongoDB:
- **Schemas tipados** - Usar interfaces TypeScript con Mongoose
- **Validaciones en schema** - Definir validaciones a nivel de base de datos
- **Índices apropiados** - Crear índices para consultas frecuentes
- **Poblado selectivo** - Usar populate solo cuando sea necesario
- **Agregaciones eficientes** - Usar pipeline de agregación para consultas complejas

## 🎨 Reglas de UI/UX

### Diseño
- **Consistencia visual** - Usar sistema de design establecido
- **Colores cohesivos** - Paleta de colores definida
- **Tipografía consistente** - Máximo 2-3 familias de fuentes
- **Espaciado uniforme** - Usar múltiplos de 4px para espaciado
- **Componentes reutilizables** - Crear biblioteca de componentes

### Accesibilidad
- **Labels descriptivos** - Todos los inputs deben tener labels
- **Contraste adecuado** - Mínimo WCAG AA compliance
- **Navegación por teclado** - Soporte completo para navegación
- **Screen readers** - Usar semantic HTML y ARIA labels

## 🔧 Reglas de Código

### Calidad General
```typescript
// ❌ INCORRECTO
function getData(id) {
  const data = fetch('/api/data/' + id);
  return data;
}

// ✅ CORRECTO
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const fetchJobData = async (jobId: string): Promise<ApiResponse<Job>> => {
  try {
    const response = await fetch(`/api/jobs/${jobId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<Job> = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching job data:', error);
    throw new Error('Failed to fetch job data');
  }
};
```

### Reglas de Código:
- **Funciones pequeñas** - Máximo 20-30 líneas por función
- **Nombres descriptivos** - Variables y funciones con nombres claros
- **Comentarios mínimos** - El código debe ser auto-explicativo
- **DRY principle** - No repetir código, crear funciones reutilizables
- **SOLID principles** - Seguir principios de programación orientada a objetos
- **Error boundaries** - Implementar manejo de errores en React

## 📁 Estructura de Archivos

### Frontend (React/Expo)
```
src/
├── components/          # Componentes reutilizables
│   ├── common/         # Componentes comunes (Button, Input, etc.)
│   ├── forms/          # Componentes de formularios
│   └── navigation/     # Componentes de navegación
├── screens/            # Pantallas de la aplicación
├── hooks/              # Custom hooks
├── services/           # Servicios API
├── utils/              # Funciones utilitarias
├── types/              # Definiciones TypeScript
├── constants/          # Constantes de la aplicación
└── assets/            # Imágenes, iconos, etc.
```

### Backend (Node.js)
```
src/
├── controllers/        # Controladores de rutas
├── models/            # Modelos de MongoDB
├── routes/            # Definiciones de rutas
├── middleware/        # Middleware personalizado
├── services/          # Lógica de negocio
├── utils/             # Funciones utilitarias
├── types/             # Definiciones TypeScript
└── config/            # Configuración de la aplicación
```

## 🧪 Testing

### Reglas de Testing:
- **Unit tests** - Probar funciones individuales
- **Integration tests** - Probar flujos completos
- **E2E tests** - Probar funcionalidad crítica
- **Cobertura mínima** - 80% de cobertura de código
- **Mocks apropiados** - Mockear dependencias externas

## 🚀 Performance

### Optimización:
- **Lazy loading** - Cargar componentes bajo demanda
- **Memoización** - Usar React.memo, useMemo, useCallback
- **Imágenes optimizadas** - Comprimir y usar formatos modernos
- **Bundle splitting** - Dividir código en chunks
- **Caching inteligente** - Implementar estrategias de cache

## 🔒 Seguridad

### Reglas de Seguridad:
- **Validación input** - Validar y sanitizar todas las entradas
- **HTTPS obligatorio** - Solo conexiones seguras en producción
- **JWT tokens** - Implementar autenticación segura
- **Rate limiting** - Limitar requests por IP
- **Secrets management** - Nunca hardcodear secrets

## 📝 Documentación

### Reglas de Documentación:
- **README actualizado** - Mantener documentación de instalación y uso
- **JSDoc comments** - Documentar funciones complejas
- **API documentation** - Documentar todos los endpoints
- **Changelog** - Mantener registro de cambios

## ⚡ Reglas de Commit

### Git Workflow:
```bash
# Formato de commits
feat: add user authentication
fix: resolve login validation issue
refactor: improve job search performance
docs: update API documentation
style: fix code formatting
test: add unit tests for user service
```

### Reglas Git:
- **Commits atómicos** - Un commit por feature/fix
- **Mensajes descriptivos** - Explicar qué y por qué
- **Branching strategy** - feature/fix/hotfix branches
- **Code review** - Revisar todo código antes de merge

---

## 🎯 CHECKLIST PRE-IMPLEMENTACIÓN

Antes de escribir cualquier código, verificar:

- [ ] ¿Existe ya un componente/función similar?
- [ ] ¿Estoy usando las carpetas correctas?
- [ ] ¿He revisado el package.json para dependencias?
- [ ] ¿Seguiré las convenciones del proyecto?
- [ ] ¿El código será reutilizable?
- [ ] ¿He definido los tipos TypeScript?
- [ ] ¿He implementado manejo de errores?
- [ ] ¿El código es testeable?

## 🎯 CHECKLIST POST-IMPLEMENTACIÓN

Después de escribir código, verificar:

- [ ] ¿El código compila sin errores?
- [ ] ¿He probado todas las funcionalidades?
- [ ] ¿El código sigue las reglas de estilo?
- [ ] ¿He agregado validaciones apropiadas?
- [ ] ¿El código es performante?
- [ ] ¿He documentado funciones complejas?
- [ ] ¿El código es accesible?
- [ ] ¿He limpiado imports no utilizados?

---

**RECUERDA**: Estas reglas son para mantener un código de calidad profesional. Siempre prioriza la legibilidad, mantenibilidad y escalabilidad sobre la velocidad de desarrollo.