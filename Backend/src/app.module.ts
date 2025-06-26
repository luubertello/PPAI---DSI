import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleado } from './entity/Empleado';
import { Estado } from './entity/Estado';
import { OrdenInspeccion } from './entity/OrdenInspeccion';
import { MotivoTipo } from './entity/MotivoTipo';
import { CambioEstado } from './entity/CambioEstado';
import { EstacionSismologica } from './entity/EstacionSismologica';
import { Rol } from './entity/Rol';
import { Sesion } from './entity/Sesion';
import { Sismografo } from './entity/Sismografo';
import { Usuario } from './entity/Usuario';
import { GestorCierreOIModule } from './GestorCierreOI/gestorCierreOI.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'ordenInspeccion',
      entities: [
        Empleado,
        Estado,
        OrdenInspeccion,
        MotivoTipo,
        CambioEstado,
        EstacionSismologica,
        Rol,
        Sesion,
        Usuario,
        Sismografo
      ],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
    Empleado,
    Estado,
    OrdenInspeccion,
    MotivoTipo,
    CambioEstado,
    Rol,
    Sesion,
    Usuario,
    Sismografo
    ]),
    GestorCierreOIModule,
  ],
})
export class AppModule {}
