import { DataSource } from 'typeorm';
import { User } from '../models/user.entity';
import { Project } from '../models/project.entity';
import { Task } from '../models/task.entity';
import { Role, TaskStatus } from '../models/enums';
import * as bcrypt from 'bcrypt';
import { configService } from '../config/config.service';

async function seedDatabase() {
  // Usar la misma configuración que la aplicación principal
  const dataSource = new DataSource({
    ...configService.getDataSourceConfig(),
    logging: true,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Conexión a la base de datos establecida');

    // Limpiar datos existentes en el orden correcto (respetando FK constraints)
    // console.log('🧹 Limpiando datos existentes...');

    // // Usar DELETE en lugar de TRUNCATE para evitar problemas con FK constraints
    // await dataSource.getRepository(Task).delete({});
    // await dataSource.getRepository(Project).delete({});
    // await dataSource.getRepository(User).delete({});

    console.log('✅ Datos existentes eliminados');

    // Crear usuarios
    console.log('👥 Creando usuarios...');
    const users = await createUsers(dataSource);
    console.log(`✅ ${users.length} usuarios creados`);

    // Crear proyectos
    console.log('📋 Creando proyectos...');
    const projects = await createProjects(dataSource, users);
    console.log(`✅ ${projects.length} proyectos creados`);

    // Crear tareas
    console.log('✅ Creando tareas...');
    const tasks = await createTasks(dataSource, users, projects);
    console.log(`✅ ${tasks.length} tareas creadas`);

    console.log('🎉 Base de datos poblada exitosamente!');
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
  } finally {
    await dataSource.destroy();
  }
}

async function createUsers(dataSource: DataSource): Promise<User[]> {
  const userRepository = dataSource.getRepository(User);
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Primero crear admin y líderes (sin createdById)
  const initialUsersData = [
    {
      name: 'Juan',
      lastName: 'Pérez',
      fullName: 'Juan Pérez',
      email: 'juan.perez@empresa.com',
      password: hashedPassword,
      role: Role.ADMIN,
      createdById: null,
      updatedById: null,
    },
    {
      name: 'María',
      lastName: 'García',
      fullName: 'María García',
      email: 'maria.garcia@empresa.com',
      password: hashedPassword,
      role: Role.LEADER,
      createdById: null,
      updatedById: null,
    },
  ];

  const initialUsers = userRepository.create(initialUsersData);
  const savedInitialUsers = await userRepository.save(initialUsers);

  // Obtener IDs de los usuarios creados
  const admin = savedInitialUsers.find((u) => u.role === Role.ADMIN);
  const leader = savedInitialUsers.find((u) => u.role === Role.LEADER);

  // Crear miembros y líder adicional con relaciones de auditoría
  const additionalUsersData = [
    {
      name: 'Carlos',
      lastName: 'López',
      fullName: 'Carlos López',
      email: 'carlos.lopez@empresa.com',
      password: hashedPassword,
      role: Role.MEMBER,
      createdById: admin?.id || null,
      updatedById: admin?.id || null,
    },
    {
      name: 'Ana',
      lastName: 'Martínez',
      fullName: 'Ana Martínez',
      email: 'ana.martinez@empresa.com',
      password: hashedPassword,
      role: Role.MEMBER,
      createdById: leader?.id || null,
      updatedById: leader?.id || null,
    },
    {
      name: 'Luis',
      lastName: 'Rodríguez',
      fullName: 'Luis Rodríguez',
      email: 'luis.rodriguez@empresa.com',
      password: hashedPassword,
      role: Role.LEADER,
      createdById: admin?.id || null,
      updatedById: admin?.id || null,
    },
  ];

  const additionalUsers = userRepository.create(additionalUsersData);
  const savedAdditionalUsers = await userRepository.save(additionalUsers);

  return [...savedInitialUsers, ...savedAdditionalUsers];
}

async function createProjects(
  dataSource: DataSource,
  users: User[],
): Promise<Project[]> {
  const projectRepository = dataSource.getRepository(Project);
  const admin = users.find((u) => u.role === Role.ADMIN);
  const leader = users.find((u) => u.role === Role.LEADER);

  const projectsData = [
    {
      name: 'Sistema de Gestión de Proyectos',
      description:
        'Desarrollo de una plataforma completa para la gestión de proyectos empresariales',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-30'),
      ownerId: admin?.id,
      createdById: admin?.id || null,
    },
    {
      name: 'Aplicación Móvil E-commerce',
      description: 'Desarrollo de una aplicación móvil para ventas online',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-08-31'),
      ownerId: leader?.id,
      createdById: leader?.id || null,
    },
    {
      name: 'Migración a la Nube',
      description: 'Migración de sistemas legacy a infraestructura cloud',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-09-30'),
      ownerId: admin?.id,
      createdById: admin?.id || null,
    },
    {
      name: 'Sistema de Reportes',
      description:
        'Desarrollo de dashboard y sistema de reportes en tiempo real',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-10-31'),
      ownerId: leader?.id,
      createdById: leader?.id || null,
    },
  ];

  const projects = projectRepository.create(projectsData);
  const savedProjects = await projectRepository.save(projects);

  // Asignar miembros a los proyectos
  for (const project of savedProjects) {
    const members = users.filter((u) => u.id !== project.ownerId).slice(0, 2);
    project.members = members;
    await projectRepository.save(project);
  }

  return savedProjects;
}

async function createTasks(
  dataSource: DataSource,
  users: User[],
  projects: Project[],
): Promise<Task[]> {
  const taskRepository = dataSource.getRepository(Task);
  const tasks: Task[] = [];

  const taskTemplates = [
    {
      title: 'Configurar entorno de desarrollo',
      description:
        'Instalar y configurar todas las herramientas necesarias para el desarrollo',
      status: TaskStatus.DONE,
    },
    {
      title: 'Diseñar arquitectura del sistema',
      description:
        'Crear diagramas de arquitectura y definir la estructura del proyecto',
      status: TaskStatus.IN_PROGRESS,
    },
    {
      title: 'Implementar autenticación',
      description: 'Desarrollar sistema de login y registro de usuarios',
      status: TaskStatus.TODO,
    },
    {
      title: 'Crear base de datos',
      description: 'Diseñar y crear las tablas de la base de datos',
      status: TaskStatus.DONE,
    },
    {
      title: 'Desarrollar API REST',
      description: 'Implementar endpoints para las funcionalidades principales',
      status: TaskStatus.IN_PROGRESS,
    },
    {
      title: 'Crear interfaz de usuario',
      description: 'Desarrollar componentes y páginas del frontend',
      status: TaskStatus.TODO,
    },
    {
      title: 'Implementar tests unitarios',
      description: 'Escribir pruebas para todas las funcionalidades',
      status: TaskStatus.TODO,
    },
    {
      title: 'Configurar CI/CD',
      description: 'Configurar pipeline de integración y despliegue continuo',
      status: TaskStatus.TODO,
    },
    {
      title: 'Optimizar rendimiento',
      description: 'Identificar y resolver cuellos de botella en el sistema',
      status: TaskStatus.TODO,
    },
    {
      title: 'Documentar API',
      description: 'Crear documentación completa de todos los endpoints',
      status: TaskStatus.IN_PROGRESS,
    },
  ];

  for (const project of projects) {
    const projectMembers = [project.owner, ...project.members].filter(Boolean);

    for (let i = 0; i < taskTemplates.length; i++) {
      const template = taskTemplates[i];
      const assignee =
        projectMembers[Math.floor(Math.random() * projectMembers.length)];

      const startDate = new Date(project.startDate);
      startDate.setDate(startDate.getDate() + i * 3); // Espaciar tareas cada 3 días

      const dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + 7); // Tareas duran 7 días

      const task = taskRepository.create({
        title: `${template.title} - ${project.name}`,
        description: template.description,
        status: template.status,
        projectId: project.id,
        assigneeId: assignee?.id,
        startDate,
        dueDate,
        createdById: project.owner?.id || null,
      });

      tasks.push(task);
    }
  }

  return await taskRepository.save(tasks);
}

// Ejecutar el script si se llama directamente
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Script completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}

export { seedDatabase };
