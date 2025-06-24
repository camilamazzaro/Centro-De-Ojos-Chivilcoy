-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 24-06-2025 a las 16:33:56
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `centrodeojoschivilcoy`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciudades`
--

CREATE TABLE `ciudades` (
  `id` int(11) NOT NULL,
  `ciudad` varchar(255) NOT NULL,
  `codigo_postal` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historias_clinicas`
--

CREATE TABLE `historias_clinicas` (
  `id` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `id_paciente` int(11) NOT NULL,
  `motivo` varchar(255) NOT NULL,
  `antecedentes_personales` varchar(255) NOT NULL,
  `medicacion_actual` varchar(255) NOT NULL,
  `examen_clinico` varchar(255) NOT NULL,
  `diagnostico` varchar(255) NOT NULL,
  `tratamiento` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historias_clinicas`
--

INSERT INTO `historias_clinicas` (`id`, `fecha`, `id_paciente`, `motivo`, `antecedentes_personales`, `medicacion_actual`, `examen_clinico`, `diagnostico`, `tratamiento`) VALUES
(1, '2025-06-20 11:28:58', 5, 'Consulta', 'Miopía y astigmatismo.', 'Ninguna.', 'Examen del paciente.', 'Diagnóstico del paciente.', 'Tratamiento del paciente.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horarios`
--

CREATE TABLE `horarios` (
  `id` int(11) NOT NULL,
  `id_medico` int(11) NOT NULL,
  `dia_semana` enum('lunes','martes','miercoles','jueves','viernes','sabado') NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `horarios`
--

INSERT INTO `horarios` (`id`, `id_medico`, `dia_semana`, `hora_inicio`, `hora_fin`) VALUES
(1, 1, 'lunes', '06:00:00', '15:00:00'),
(3, 1, 'lunes', '16:39:00', '21:35:00'),
(4, 1, 'martes', '10:00:00', '12:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicos`
--

CREATE TABLE `medicos` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `telefono` varchar(255) NOT NULL,
  `foto` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medicos`
--

INSERT INTO `medicos` (`id`, `id_usuario`, `telefono`, `foto`, `descripcion`) VALUES
(1, 8, '3444', '/public\\uploads\\1746729677147.jpeg', 'Actualizada'),
(5, 8, '2222222', '/public\\uploads\\1746818581613.png', 'Hola');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medico_horarios`
--

CREATE TABLE `medico_horarios` (
  `id` int(11) NOT NULL,
  `id_medico` int(11) NOT NULL,
  `dia_semana` enum('lunes','martes','miercoles','jueves','viernes','sabado') NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medico_obrassociales`
--

CREATE TABLE `medico_obrassociales` (
  `id` int(11) NOT NULL,
  `id_medico` int(11) NOT NULL,
  `id_obraSocial` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medico_practicas`
--

CREATE TABLE `medico_practicas` (
  `id` int(11) NOT NULL,
  `id_medico` int(11) NOT NULL,
  `id_practica` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `obras_sociales`
--

CREATE TABLE `obras_sociales` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `obras_sociales`
--

INSERT INTO `obras_sociales` (`id`, `nombre`) VALUES
(1, 'IOMA'),
(2, 'Swiss Medical'),
(3, 'OSPE'),
(4, 'OSDE'),
(5, 'Galeno');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `dni` int(11) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `genero` enum('femenino','masculino','otro') NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `telefono` varchar(255) NOT NULL,
  `id_obra_social` int(11) NOT NULL,
  `nro_afiliado` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`id`, `nombre`, `dni`, `fecha_nacimiento`, `genero`, `direccion`, `email`, `telefono`, `id_obra_social`, `nro_afiliado`) VALUES
(5, 'Camila Ana Mazzaro', 44488835, '2002-09-24', 'femenino', 'Biedma 123', 'camilamazzaro90@gmail.com', '2346654466', 4, '12366655'),
(6, 'Camila Mazzaro', 44488835, '2025-06-14', 'femenino', 'Las Heras 122', 'camilamazzaro90@gmail.com', '2346665555', 1, '123'),
(7, 'Camila Mazzaro', 44488835, '2025-06-21', 'femenino', 'Las Heras 122', 'camilamazzaro90@gmail.com', '2346665555', 1, '123'),
(8, 'Juan Perez', 23333444, '1988-09-23', 'masculino', 'Junín 35', 'juanperez@gmail.com', '2344332225', 1, '23444555'),
(9, 'Esteban Gómez', 21322438, '1975-05-22', 'masculino', 'Junín 35', 'estebangomez@gmail.com', '2346554433', 2, '67999888'),
(10, 'Sofía Rodríguez', 30654321, '1985-07-20', 'femenino', 'Calle 25 de Mayo 678', 'sofia.rodriguez@gmail.com', '1122334455', 1, '101'),
(11, 'Juan Pérez', 30543210, '1990-05-14', 'masculino', 'Av. Rivadavia 1234', 'juan.perez@gmail.com', '1133445566', 2, '102'),
(12, 'Carlos Gómez', 30876543, '1978-11-30', 'masculino', 'Calle San Martín 45', 'carlos.gomez@yahoo.com', '1144556677', 3, '103'),
(13, 'Lucía López', 30223344, '2000-02-10', 'femenino', 'Calle Belgrano 210', 'lucia.lopez@hotmail.com', '1155667788', 4, '104'),
(14, 'Pedro González', 30987665, '1995-04-02', 'masculino', 'Calle Sarmiento 322', 'pedro.gonzalez@gmail.com', '1166778899', 5, '105'),
(15, 'Valentina Martínez', 30123456, '1998-09-08', 'femenino', 'Calle Corrientes 157', 'valentina.martinez@mail.com', '1177889900', 6, '106'),
(16, 'Martín Fernández', 30765498, '1983-01-18', 'masculino', 'Av. de Mayo 98', 'martin.fernandez@gmail.com', '1188990011', 7, '107'),
(17, 'Estefanía Díaz', 30678901, '1992-12-12', 'femenino', 'Calle Avellaneda 500', 'estefania.diaz@hotmail.com', '1199001122', 8, '108'),
(18, 'Ricardo Ramírez', 30456789, '1975-08-25', 'masculino', 'Calle Perú 345', 'ricardo.ramirez@yahoo.com', '1200112233', 9, '109'),
(19, 'Mariana Torres', 30987654, '1987-06-30', 'femenino', 'Av. Libertador 322', 'mariana.torres@gmail.com', '1211223344', 10, '110'),
(20, 'Tomás Herrera', 30567890, '1991-03-22', 'masculino', 'Calle H. Yrigoyen 789', 'tomas.herrera@mail.com', '1222334455', 11, '111'),
(21, 'Victoria Martínez', 30765432, '1989-05-16', 'femenino', 'Calle Güemes 120', 'victoria.martinez@gmail.com', '1233445566', 12, '112'),
(22, 'Federico Rodríguez', 30323456, '1994-07-07', 'masculino', 'Calle Moreno 678', 'federico.rodriguez@gmail.com', '1244556677', 13, '113'),
(23, 'Gabriela Sánchez', 30987632, '1990-09-21', 'femenino', 'Calle Pueyrredón 501', 'gabriela.sanchez@mail.com', '1255667788', 14, '114'),
(24, 'Ricardo Álvarez', 30412345, '1982-10-11', 'masculino', 'Calle Tucumán 900', 'ricardo.alvarez@gmail.com', '1266778899', 15, '115');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turnos`
--

CREATE TABLE `turnos` (
  `id` int(11) NOT NULL,
  `id_medico` int(11) NOT NULL,
  `id_paciente` int(11) NOT NULL,
  `id_practica` int(11) NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `id_estadoTurno` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turno_estados`
--

CREATE TABLE `turno_estados` (
  `id` int(11) NOT NULL,
  `estado` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `id_categoriaUsuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `id_categoriaUsuario`) VALUES
(2, 'Camila Mazzaro', 'camilamazzaro90@gmail.com', '*******', 1),
(8, 'Esteban Mazzaro', 'estebanmazzaro@gmail.com', 'Camila123', 2),
(9, 'Bruno Mazzaro', 'camilamazzaro90@gmail.com', 'Camila123', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_categorias`
--

CREATE TABLE `usuario_categorias` (
  `id` int(11) NOT NULL,
  `categoria` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario_categorias`
--

INSERT INTO `usuario_categorias` (`id`, `categoria`) VALUES
(1, 'Administrador'),
(2, 'Medico'),
(3, 'Secretaria');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ciudades`
--
ALTER TABLE `ciudades`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `historias_clinicas`
--
ALTER TABLE `historias_clinicas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `horarios`
--
ALTER TABLE `horarios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `medico_horarios`
--
ALTER TABLE `medico_horarios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `medico_obrassociales`
--
ALTER TABLE `medico_obrassociales`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `medico_practicas`
--
ALTER TABLE `medico_practicas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `obras_sociales`
--
ALTER TABLE `obras_sociales`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `turno_estados`
--
ALTER TABLE `turno_estados`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuario_categorias`
--
ALTER TABLE `usuario_categorias`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `ciudades`
--
ALTER TABLE `ciudades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `historias_clinicas`
--
ALTER TABLE `historias_clinicas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `horarios`
--
ALTER TABLE `horarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `medicos`
--
ALTER TABLE `medicos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `medico_horarios`
--
ALTER TABLE `medico_horarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `medico_obrassociales`
--
ALTER TABLE `medico_obrassociales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `medico_practicas`
--
ALTER TABLE `medico_practicas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `obras_sociales`
--
ALTER TABLE `obras_sociales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `turnos`
--
ALTER TABLE `turnos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `turno_estados`
--
ALTER TABLE `turno_estados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `usuario_categorias`
--
ALTER TABLE `usuario_categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
