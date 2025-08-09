import { configService } from '../config/config.service';
import * as fs from 'fs';

let config = configService.getTypeOrmConfig();

fs.writeFileSync('ormconfig.json', JSON.stringify(config, null, 2));
console.log('ormconfig.json generado exitosamente');
