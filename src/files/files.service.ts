import { BadRequestException, Injectable } from '@nestjs/common';
import { error } from 'console';
import { existsSync } from 'fs';
import { join } from 'path';


@Injectable()
export class FilesService {

    getStaticProductImage(imageName: string) {
        const path = join(__dirname, '../../static/uploads/', imageName);
        if (!existsSync(path)) {
            throw new BadRequestException(`No se encontró ningun producto con esa imagen ${imageName}`);
        }
        return path;
    }

}
