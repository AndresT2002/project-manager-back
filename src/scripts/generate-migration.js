const { execSync } = require('child_process');
const path = require('path');

// Obtener el nombre de la migración desde los argumentos
const migrationName = process.argv[2];

if (!migrationName) {
  console.error('❌ Error: Debes proporcionar un nombre para la migración');
  console.log('📝 Uso: npm run typeorm:migration:generate <nombre_de_migracion>');
  console.log('📝 Ejemplo: npm run typeorm:migration:generate update_base_entity');
  process.exit(1);
}

// Construir la ruta completa
const migrationPath = `src/migration/${migrationName}`;

// Ejecutar el comando TypeORM directamente
const command = `npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate -d src/data-source.ts ${migrationPath}`;

try {
  console.log(`🚀 Generando migración: ${migrationName}`);
  console.log(`📁 Ruta: ${migrationPath}`);
  console.log('');
  
  execSync(command, { stdio: 'inherit' });
  
  console.log('');
  console.log('✅ ¡Migración generada exitosamente!');
} catch (error) {
  console.error('❌ Error al generar la migración:', error.message);
  process.exit(1);
}
